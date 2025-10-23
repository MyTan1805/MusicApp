// File: app/(tabs)/index.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CheckCircleIcon, DownloadIcon, HistoryIcon, PlayIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import MiniPlayer from '../../components/MiniPlayer';
import SongItem from '../../components/SongItem';
import SuggestionCarousel from '../../components/SuggestionCarousel';
import { TRACKS, Track } from '../../constants/tracks';
import { Playlist, usePlayer } from '../../contexts/PlayerContext';
import { useAppToast } from '../../hooks/useAppToast';

const COLORS = {
  primary: '#1DB954',
  textSecondary: '#b3b3b3',
  textMuted: '#b3b3b3',
  border: '#404040',
};

const Banner = ({ playlist, onPlay }: { playlist: Playlist | null; onPlay: () => void }) => {
  if (!playlist) {
    return (
      <View style={styles.bannerContainer}>
        <View style={[styles.bannerInner, { padding: 24 }]}>
          <Text style={styles.bannerTitle}>Chào mừng bạn</Text>
          <Text style={styles.bannerSubtitle}>Tạo playlist đầu tiên để bắt đầu.</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.bannerContainer}>
      <View style={[styles.bannerInner, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={styles.bannerFeaturedText}>PLAYLIST NỔI BẬT</Text>
          <Text style={styles.bannerTitle} numberOfLines={1}>{playlist.name}</Text>
          <Text style={styles.bannerSubtitle} numberOfLines={2}>
            {playlist.tracks.length > 0 ? `Bắt đầu với ${playlist.tracks.length} bài hát tuyệt vời.` : "Hãy thêm bài hát vào playlist này."}
          </Text>
        </View>
        <TouchableOpacity onPress={onPlay} style={styles.playButton}>
          <PlayIcon color="white" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const {
    playTrack, currentTrack, history, playlists, addTrackToPlaylist,
    isDownloaded, downloadTrack, deleteDownload
  } = usePlayer();
  const { showToast } = useAppToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false); 
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const featuredPlaylist = useMemo(() => (playlists.length > 0 ? playlists[0] : null), [playlists]);
  
  const featuredPlaylistTracks = useMemo(() => {
    if (!featuredPlaylist) return [];
    return TRACKS.filter(track => featuredPlaylist.tracks.includes(track.id));
  }, [featuredPlaylist]);

  const handleDownload = async (track: Track) => {
    if (isDownloaded(track.id)) {
        deleteDownload(track.id);
        return;
    }
    setDownloadingId(track.id); // Bắt đầu loading
    try {
        await downloadTrack(track);
    } catch (error) {
        console.error("Download failed in UI:", error);
    } finally {
        setDownloadingId(null); // Kết thúc loading
    }
  };

  const handlePlayFeaturedPlaylist = () => {
    if (featuredPlaylistTracks.length > 0) {
      playTrack(featuredPlaylistTracks[0], featuredPlaylistTracks);
    }
  };

  const suggestedTracks = useMemo(() => {
    if (history.length === 0) {
      return [...TRACKS].sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    const lastPlayedTrack = TRACKS.find(t => t.id === history[0]);
    if (!lastPlayedTrack) return [];
    const artistTracks = TRACKS.filter(t => t.artist === lastPlayedTrack.artist && t.id !== lastPlayedTrack.id);
    return artistTracks.length > 0 ? artistTracks : [...TRACKS].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [history]);
  
  const newReleases = useMemo(() => TRACKS.slice(0, 5), []);
  const trendingTracks = useMemo(() => [...TRACKS].sort((a, b) => a.title > b.title ? -1 : 1), []);
  
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return TRACKS.filter(track =>
      track.title.toLowerCase().includes(lowercasedQuery) ||
      track.artist.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  const discoveryData = useMemo(() => [
    { type: 'banner', id: 'banner-section', playlist: featuredPlaylist },
    { type: 'carousel', id: 'new-releases-section', title: 'Mới phát hành', tracks: newReleases },
    { type: 'carousel', id: 'suggestions-section', title: 'Đề xuất cho bạn', tracks: suggestedTracks },
    { type: 'list_header', id: 'trending-header', title: 'Bài hát thịnh hành' },
    ...trendingTracks.map(track => ({ type: 'track', id: track.id, trackData: track })),
  ], [suggestedTracks, newReleases, trendingTracks, featuredPlaylist]);

  const handleLongPressSong = (track: Track) => {
    setSelectedTrack(track);
    setShowPlaylistModal(true);
  };

const handleSelectPlaylist = (playlistId: string) => {
    if (selectedTrack) {
      addTrackToPlaylist(playlistId, selectedTrack.id);
      
      // TÌM TÊN PLAYLIST ĐỂ HIỂN THỊ TRONG THÔNG BÁO
      const playlistName = playlists.find(p => p.id === playlistId)?.name;
      
      // GỌI TOAST
      showToast({
        title: "Đã thêm vào playlist",
        description: `"${selectedTrack.title}" đã được thêm vào "${playlistName || ''}"`
      });
    }
    setShowActionsheet(false);
    setSelectedTrack(null);
  };

  const renderDiscoveryItem = ({ item }: { item: any }) => {
    switch (item.type) {
        case 'banner':
            return <Banner playlist={item.playlist} onPlay={handlePlayFeaturedPlaylist} />;
        case 'carousel':
            if (item.tracks.length === 0) return null;
            return <SuggestionCarousel title={item.title} tracks={item.tracks} onTrackPress={(track) => playTrack(track, item.tracks)} />;
        case 'list_header':
            return <Text style={styles.sectionHeader}>{item.title}</Text>;
        case 'track':
            const track = item.trackData;
            const isTrackDownloaded = isDownloaded(track.id);
            const isCurrentlyDownloading = downloadingId === track.id; // Kiểm tra

            const DownloadButton = (
                <Pressable onPress={() => handleDownload(track)} style={{ padding: 8 }} disabled={isCurrentlyDownloading}>
                    {isCurrentlyDownloading ? (
                        <ActivityIndicator color={COLORS.textMuted} /> // 4. HIỂN THỊ SPINNER
                    ) : isTrackDownloaded ? (
                        <CheckCircleIcon color={COLORS.primary} />
                    ) : (
                        <DownloadIcon color={COLORS.textMuted} />
                    )}
                </Pressable>
            );
            return <SongItem track={track} onPress={() => {
                playTrack(track, trendingTracks);
                router.push('/player');
            }} onLongPress={() => handleLongPressSong(track)} downloadComponent={DownloadButton} />;
        default: return null;
    }
  };
  
  const renderSearchItem = ({ item }: { item: Track }) => {
      const track = item;
      const isTrackDownloaded = isDownloaded(track.id);
      const isCurrentlyDownloading = downloadingId === track.id; // Kiểm tra

      const DownloadButton = (
          <Pressable onPress={() => handleDownload(track)} style={{ padding: 8 }} disabled={isCurrentlyDownloading}>
              {isCurrentlyDownloading ? (
                  <ActivityIndicator color={COLORS.textMuted} /> // 4. HIỂN THỊ SPINNER
              ) : isTrackDownloaded ? (
                  <CheckCircleIcon color={COLORS.primary} />
              ) : (
                  <DownloadIcon color={COLORS.textMuted} />
              )}
          </Pressable>
      );
      return <SongItem track={track} 
        onPress={() => {
          playTrack(track, searchResults);
          router.push('/player');
      }}
        onLongPress={() => handleLongPressSong(track)} downloadComponent={DownloadButton} />;
  }

  return (
        <LinearGradient colors={['#434343', '#000000']} locations={[0, 0.25]} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                {/* Header và ô tìm kiếm luôn hiển thị */}
                <View style={styles.headerRow}>
                    <Text style={styles.screenTitle}>Thư viện</Text>
                    <Pressable onPress={() => router.push('/history')} style={{padding: 8}}><HistoryIcon color="white" /></Pressable>
                </View>
                <View style={styles.searchContainer}>
                    <SearchIcon color={COLORS.textSecondary} style={{marginLeft: 12}}/>
                    <TextInput style={styles.searchInput} placeholder="Tìm kiếm..." placeholderTextColor={COLORS.textSecondary} value={searchQuery} onChangeText={setSearchQuery}/>
                </View>

                {/* === LOGIC RENDER CÓ ĐIỀU KIỆN === */}
                {searchQuery.trim() === '' ? (
                    // 1. GIAO DIỆN KHÁM PHÁ (KHI KHÔNG TÌM KIẾM)
                    <FlatList
                        data={discoveryData}
                        keyExtractor={(item, index) => item.id + index.toString()}
                        renderItem={renderDiscoveryItem}
                        contentContainerStyle={{ paddingBottom: currentTrack ? 160 : 80 }}
                    />
                ) : (
                    // 2. GIAO DIỆN KẾT QUẢ (KHI ĐANG TÌM KIẾM)
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSearchItem}
                        ListHeaderComponent={<Text style={styles.sectionHeader}>Kết quả tìm kiếm</Text>}
                        contentContainerStyle={{ paddingBottom: currentTrack ? 160 : 80 }}
                    />
                )}
        {currentTrack && <MiniPlayer />}
        <Modal
            transparent={true}
            visible={showPlaylistModal}
            onRequestClose={() => setShowPlaylistModal(false)}
            animationType="slide"
        >
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowPlaylistModal(false)}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Thêm "{selectedTrack?.title}" vào...</Text>
                        <Pressable onPress={() => setShowPlaylistModal(false)}>
                            <XIcon color={COLORS.textSecondary} />
                        </Pressable>
                    </View>
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <TouchableOpacity key={playlist.id} style={styles.playlistItem} onPress={() => handleSelectPlaylist(playlist.id)}>
                                <PlusIcon color={COLORS.textSecondary} style={{marginRight: 12}}/>
                                <Text style={styles.playlistItemText}>{playlist.name}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.playlistItem}>
                            <Text style={styles.playlistItemText}>Bạn chưa tạo playlist nào.</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    sectionHeader: { fontSize: 24, fontWeight: 'bold', color: 'white', paddingHorizontal: 16, marginTop: 24, marginBottom: 8 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 },
    screenTitle: { fontSize: 32, fontWeight: 'bold', color: 'white' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A2A2A', borderRadius: 8, marginHorizontal: 16, marginTop: 16 },
    searchInput: { flex: 1, color: 'white', padding: 12, fontSize: 16 },
    bannerContainer: { paddingHorizontal: 16, paddingTop: 16 },
    bannerInner: { backgroundColor: '#2A2A2A', borderRadius: 12, padding: 16 },
    bannerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
    bannerSubtitle: { color: COLORS.textSecondary, marginTop: 8, fontSize: 14 },
    bannerFeaturedText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    playButton: { backgroundColor: COLORS.primary, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#282828', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: '50%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 12, marginBottom: 12 },
    modalTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, flex: 1 },
    playlistItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
    playlistItemText: { color: 'white', fontSize: 16 },
});