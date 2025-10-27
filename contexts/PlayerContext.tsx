// File: contexts/PlayerContext.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Track } from '../constants/tracks';
// SỬA CÁCH IMPORT CHO FILE SYSTEM
import { createDownloadResumable, deleteAsync, documentDirectory } from 'expo-file-system/legacy';

export interface Playlist {
  id: string;
  name: string;
  tracks: string[];
}
export type RepeatMode = 'off' | 'one' | 'all';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  isSeeking: boolean;
  playTrack: (track: Track, playlist?: Track[]) => void;
  togglePlayPause: () => void;
  onSeek: (value: number) => void;
  onSeekComplete: (value: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  favorites: string[];
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  playlists: Playlist[];
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  toggleRepeatMode: () => void;
  toggleShuffle: () => void;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  downloadedTracks: { [trackId: string]: string };
  downloadTrack: (track: Track) => Promise<void>;
  deleteDownload: (trackId: string) => Promise<void>;
  isDownloaded: (trackId: string) => boolean;
  history: string[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [currentPlaylist, setCurrentPlaylist] = useState<Track[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
    const [isShuffle, setIsShuffle] = useState(false);
    const [shuffledPlaylist, setShuffledPlaylist] = useState<Track[]>([]);
    const [volume, setVolume] = useState(1.0);
    const [downloadedTracks, setDownloadedTracks] = useState<{ [trackId: string]: string }>({});
    const [history, setHistory] = useState<string[]>([]);
    
    const FAVORITES_STORAGE_KEY = '@music_app_favorites';
    const PLAYLISTS_STORAGE_KEY = '@music_app_playlists';
    const DOWNLOADS_STORAGE_KEY = '@music_app_downloads';
    const HISTORY_STORAGE_KEY = '@music_app_history';
    const soundObjectRef = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
                if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
                const storedPlaylists = await AsyncStorage.getItem(PLAYLISTS_STORAGE_KEY);
                if (storedPlaylists) setPlaylists(JSON.parse(storedPlaylists));
                const storedDownloads = await AsyncStorage.getItem(DOWNLOADS_STORAGE_KEY);
                if (storedDownloads) setDownloadedTracks(JSON.parse(storedDownloads));
                const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
                if (storedHistory) setHistory(JSON.parse(storedHistory));
                console.log('User data loaded from storage.');
            } catch (e) { console.error('Failed to load data from storage.', e); }
        };
        loadData();
    }, []);

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
        return () => { soundObjectRef.current?.unloadAsync(); };
    }, []);
    
    useEffect(() => {
        if (soundObjectRef.current) {
            soundObjectRef.current.setVolumeAsync(volume);
        }
    }, [volume]);
    
    const downloadTrack = async (track: Track) => {
        if (!track.downloadUrl) { throw new Error('No download URL for this track.'); }
        if (downloadedTracks[track.id]) { return; }
        if (!documentDirectory) { throw new Error('Document directory is not available.'); }
        
        const fileUri = documentDirectory + `${track.id}.mp3`;
        console.log(`Downloading ${track.title} to ${fileUri}`);

        const downloadResumable = createDownloadResumable(track.downloadUrl, fileUri, {});
        const result = await downloadResumable.downloadAsync();
        
        if (result && result.uri) {
            console.log('Download successful:', result.uri);
            setDownloadedTracks(prev => {
                const newDownloads = { ...prev, [track.id]: result.uri };
                AsyncStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(newDownloads));
                return newDownloads;
            });
        } else {
            throw new Error('Download failed: Result is undefined.');
        }
    };

    const deleteDownload = async (trackId: string) => {
        const fileUri = downloadedTracks[trackId];
        if (!fileUri) return;
        try {
            await deleteAsync(fileUri, { idempotent: true });
            console.log('Deleted file:', fileUri);
            setDownloadedTracks(prev => {
                const newDownloads = { ...prev };
                delete newDownloads[trackId];
                AsyncStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(newDownloads));
                return newDownloads;
            });
        } catch (e) { console.error('Failed to delete download.', e); }
    };
  
    const isDownloaded = (trackId: string) => !!downloadedTracks[trackId];

    const playTrack = async (track: Track, playlist: Track[] = allTracks) => {
        if (soundObjectRef.current) {
            await soundObjectRef.current.unloadAsync();
            soundObjectRef.current = null;
        }
        
        // *** BẮT ĐẦU SỬA LỖI ***
        // 1. RESET STATE NGAY LẬP TỨC
        console.log("Resetting position and duration for new track.");
        setPosition(0);
        setDuration(0);
        // *** KẾT THÚC SỬA LỖI ***

        const localUri = downloadedTracks[track.id];
        const source = localUri ? { uri: localUri } : track.url;

        console.log(`Playing track: ${track.title}. Source:`, localUri ? `LOCAL FILE (${localUri})` : 'REMOTE/BUNDLED');

        if (JSON.stringify(playlist) !== JSON.stringify(currentPlaylist)) {
            setIsShuffle(false);
            setShuffledPlaylist([]);
        }

        try {
            const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true, volume: volume });
            soundObjectRef.current = sound;
            setCurrentTrack(track);

            setCurrentPlaylist(playlist);
            addToHistory(track.id);
        } catch (error) { 
            console.error('Error playing track:', error); 
        }
    };
    
    const addToHistory = async (trackId: string) => {
        setHistory(prevHistory => {
        // 1. Xóa bài hát này nếu đã tồn tại trong lịch sử (để đưa nó lên đầu)
        const newHistory = prevHistory.filter(id => id !== trackId);

        // 2. Thêm bài hát vào đầu danh sách
        newHistory.unshift(trackId);
        
        // 3. Giới hạn danh sách lịch sử (ví dụ: 100 bài)
        const limitedHistory = newHistory.slice(0, 100);

        // 4. Lưu vào AsyncStorage (không cần await ở đây vì setState đã là bất đồng bộ)
        AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
        
        return limitedHistory;
        });
    };

    const playNext = () => {
        if (!currentTrack) return;
        if (repeatMode === 'one') {
            playTrack(currentTrack, currentPlaylist);
            return;
        }
        const playlistToUse = isShuffle ? shuffledPlaylist : currentPlaylist;
        if (playlistToUse.length === 0) return;
        const currentIndex = playlistToUse.findIndex(t => t.id === currentTrack.id);
        if (currentIndex === -1) { playTrack(playlistToUse[0], currentPlaylist); return; }
        const isLastTrack = currentIndex === playlistToUse.length - 1;
        if (isLastTrack) {
            if (repeatMode === 'all') playTrack(playlistToUse[0], currentPlaylist);
            return;
        }
        const nextIndex = currentIndex + 1;
        playTrack(playlistToUse[nextIndex], currentPlaylist);
    };
    
    const playPrevious = () => {
        if (!currentTrack || currentPlaylist.length === 0) return;
        const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack.id);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        playTrack(currentPlaylist[prevIndex], currentPlaylist);
    };

    const toggleFavorite = async (trackId: string) => {
        const newFavorites = favorites.includes(trackId) ? favorites.filter(id => id !== trackId) : [...favorites, trackId];
        setFavorites(newFavorites);
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    };

    const isFavorite = (trackId: string) => favorites.includes(trackId);

    const savePlaylists = async (newPlaylists: Playlist[]) => {
        try {
        setPlaylists(newPlaylists);
        await AsyncStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(newPlaylists));
        } catch (e) {
        console.error('Failed to save playlists.', e);
        }
    };

    const createPlaylist = async (name: string) => {
        const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: name.trim(),
        tracks: [],
        };
        if (newPlaylist.name) {
        const newPlaylists = [...playlists, newPlaylist];
        await savePlaylists(newPlaylists);
        }
    };
    
    const deletePlaylist = async (playlistId: string) => {
        const newPlaylists = playlists.filter(p => p.id !== playlistId);
        await savePlaylists(newPlaylists);
    };
    
    const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
        const newPlaylists = playlists.map(p => {
        if (p.id === playlistId) {
            if (!p.tracks.includes(trackId)) {
            return { ...p, tracks: [...p.tracks, trackId] };
            }
        }
        return p;
        });
        await savePlaylists(newPlaylists);
    };

    const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
        const newPlaylists = playlists.map(p => {
        if (p.id === playlistId) {
            return { ...p, tracks: p.tracks.filter(id => id !== trackId) };
        }
        return p;
        });
        await savePlaylists(newPlaylists);
    };

    useEffect(() => {
        if (!soundObjectRef.current) return;
        const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
            if (!status.isLoaded) { if (status.error) console.error(`Playback Error: ${status.error}`); return; }
            if (!isSeeking) {
                setPosition(status.positionMillis);
                setDuration(status.durationMillis ?? 0);
                setIsPlaying(status.isPlaying);
            }
            if (status.didJustFinish) playNext();
        };
        soundObjectRef.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }, [isSeeking, currentTrack, currentPlaylist, isShuffle, repeatMode]);
    
    const togglePlayPause = async () => {
        const sound = soundObjectRef.current;
        if (!sound) return;
        try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
            status.isPlaying ? await sound.pauseAsync() : await sound.playAsync();
        }
        } catch (error) {
        console.error("Error toggling play/pause: ", error);
        }
    };

    const onSeek = (value: number) => {
        if (!isSeeking) {
        setIsSeeking(true);
        }
        setPosition(value); 
    };

    const onSeekComplete = async (value: number) => {
        if (!soundObjectRef.current) {
        setIsSeeking(false);
        return;
        }
        try {
        await soundObjectRef.current.setStatusAsync({ positionMillis: value });
        } catch (error) {
        console.error('Error on seeking', error);
        } finally {
        setIsSeeking(false);
        }
    };

    const toggleRepeatMode = () => {
        setRepeatMode(prevMode => {
            if (prevMode === 'off') return 'all';
            if (prevMode === 'all') return 'one';
            return 'off';
        });
    };
  
    const toggleShuffle = () => {
        setIsShuffle(prevState => {
            const newShuffleState = !prevState;
            if (newShuffleState) {
                const shuffled = [...currentPlaylist].sort(() => Math.random() - 0.5);
                setShuffledPlaylist(shuffled);
            }
            return newShuffleState;
        });
    };

    const value: PlayerContextType = {
        currentTrack, isPlaying, position, duration, isSeeking,
        playTrack, togglePlayPause, onSeek, onSeekComplete, playNext, playPrevious,
        favorites, toggleFavorite, isFavorite, playlists, createPlaylist,
        deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist,
        repeatMode, isShuffle, toggleRepeatMode, toggleShuffle, volume, setVolume, 
        downloadedTracks, downloadTrack, deleteDownload, isDownloaded, history,
    };

    return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (context === undefined) throw new Error('usePlayer must be used within a PlayerProvider');
    return context;
};