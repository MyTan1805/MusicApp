// File: app/player.tsx

import {
    Actionsheet,
    ActionsheetBackdrop, ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem, ActionsheetItemText,
    Box,
    HStack, Icon,
    Image,
    Pressable,
    Spinner,
    Text,
    VStack
} from '@gluestack-ui/themed';
import Slider from '@react-native-community/slider';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    ChevronDownIcon,
    DownloadIcon,
    HeartIcon,
    MoreHorizontalIcon,
    PauseIcon,
    PlayIcon,
    Repeat1Icon,
    RepeatIcon,
    ShareIcon,
    ShuffleIcon,
    SkipBackIcon,
    SkipForwardIcon,
    TrashIcon,
    Volume2Icon,
    VolumeXIcon
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, Share, StyleSheet, UIManager } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRACKS } from '../constants/tracks';

import ArcticBackground from '../components/ArcticBackground';
import LyricsViewer from '../components/LyricsViewer';
import { usePlayer } from '../contexts/PlayerContext';
import { formatTime } from '../utils/formatTime';

// Bật LayoutAnimation trên Android (vẫn hữu ích cho các animation khác nếu có)
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PlayerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ trackId?: string }>();
    const {
        currentTrack, isPlaying, position, duration, togglePlayPause, playNext, playPrevious,
        isSeeking, onSeek, onSeekComplete, isFavorite, toggleFavorite, isShuffle, toggleShuffle, 
        repeatMode, toggleRepeatMode, volume, setVolume, isDownloaded, downloadTrack, deleteDownload,
        playTrack,
    } = usePlayer();

    const [seekingPosition, setSeekingPosition] = useState(0);
    const [viewMode, setViewMode] = useState<'artwork' | 'lyrics'>('artwork');
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    
    // --- LOGIC ANIMATION ---
    const animationProgress = useSharedValue(0);

    const toggleViewMode = () => {
        if (viewMode === 'artwork') {
            animationProgress.value = withTiming(1, { duration: 400 });
            setViewMode('lyrics');
        } else {
            animationProgress.value = withTiming(0, { duration: 400 });
            setViewMode('artwork');
        }
    };

    const artworkStyle = useAnimatedStyle(() => ({
        opacity: 1 - animationProgress.value,
        transform: [{ scale: 1 - animationProgress.value * 0.1 }],
    }));

    const lyricsStyle = useAnimatedStyle(() => ({
        opacity: animationProgress.value,
        transform: [{ scale: 0.95 + animationProgress.value * 0.05 }],
        display: animationProgress.value === 0 ? 'none' : 'flex',
    }));
    
    const handleSeek = (value: number) => { setSeekingPosition(value); onSeek(value); };
    const displayPosition = isSeeking ? seekingPosition : position;
    const handleShare = async () => {
        if (!currentTrack) return;
        setShowOptionsMenu(false);
        try {
            const deepLink = `musicapp://player?trackId=${currentTrack.id}`;
            
            await Share.share({
                message: `Nghe thử bài hát "${currentTrack.title}" của ${currentTrack.artist} trên MusicApp nhé!\n\n${deepLink}`,
                
                url: deepLink
            });
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDownloadPress = () => {
        if (!currentTrack) return;
        isCurrentlyDownloaded ? deleteDownload(currentTrack.id) : downloadTrack(currentTrack);
        setShowOptionsMenu(false);
    };
    useEffect(() => {
        // Chỉ xử lý khi MÀN HÌNH ĐƯỢC MỞ TRỰC TIẾP và CHƯA CÓ NHẠC PHÁT
        if (params.trackId && !currentTrack) {
            const trackToPlay = TRACKS.find(t => t.id === params.trackId);
            if (trackToPlay) {
                console.log('Playing track from deep link:', trackToPlay.title);
                playTrack(trackToPlay, TRACKS);
            }
        }
    }, [params.trackId, currentTrack, playTrack]);
    useEffect(() => {
        if (!currentTrack && router.canGoBack()) {
            router.back();
        }
    }, [currentTrack, router]);
    
    // useEffect để đồng bộ seekingPosition
    useEffect(() => {
        if (!isSeeking) { setSeekingPosition(position); }
    }, [position, isSeeking]);

    
    if (!currentTrack) {
        // Thay vì quay lại ngay, hiển thị loading để chờ useEffect xử lý deep link
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="black">
                <Spinner size="large" color="white" />
            </Box>
        );
    }
    const RepeatIconComponent = () => repeatMode === 'one' ? Repeat1Icon : RepeatIcon;
    const isCurrentlyFavorite = isFavorite(currentTrack.id);
    const isCurrentlyDownloaded = isDownloaded(currentTrack.id);

    return (
        <Box flex={1}>
            <ArcticBackground />
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                
                <VStack 
                    flex={1} m="$4" bg="rgba(50, 50, 50, 0.5)" borderRadius={24}
                    borderWidth={1} borderColor="rgba(255, 255, 255, 0.1)"
                    style={{ overflow: 'hidden' }} p="$4"
                >
                    {/* Header */}
                     <HStack justifyContent="space-between" alignItems="center">
                        {/* Phần bên trái (Nút Back) */}
                        <Box w="$1/5">
                            <Pressable onPress={() => router.back()} p="$2" alignItems="flex-start">
                                <Icon as={ChevronDownIcon} size="xl" color="white" />
                            </Pressable>
                        </Box>

                        {/* Phần ở giữa (Tiêu đề) */}
                        <Box flex={1} alignItems="center">
                            <Pressable onPress={toggleViewMode}>
                                <Text color="white" fontWeight="$medium">
                                    {viewMode === 'artwork' ? 'Now Playing' : 'Lyrics'}
                                </Text>
                            </Pressable>
                        </Box>

                        {/* Phần bên phải (Nút ba chấm) */}
                        <Box w="$1/5" alignItems="flex-end">
                            {/* THÊM console.log VÀO ĐÂY ĐỂ DEBUG LẦN CUỐI */}
                            <Pressable 
                                onPress={() => {
                                    console.log("Three-dot button PRESSED!");
                                    setShowOptionsMenu(true);
                                }} 
                                p="$2"
                                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                            >
                                <Icon as={MoreHorizontalIcon} size="xl" color="white" />
                            </Pressable>
                        </Box>
                    </HStack>

                    {/* Nội dung chính */}
                    <VStack flex={1} justifyContent="center" alignItems="center">
                        <Animated.View style={[styles.artworkContainer, artworkStyle]}>
                            <Pressable style={{ flex: 1 }} onPress={toggleViewMode}>
                                <Image source={currentTrack!.artwork} alt={currentTrack.title} size="full" borderRadius={999}/>
                            </Pressable>
                        </Animated.View>
                        
                        <Animated.View style={[styles.lyricsContainer, lyricsStyle]}>
                             {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                                <Pressable style={{ flex: 1 }} onPress={toggleViewMode}>
                                    <LyricsViewer 
                                        lyrics={currentTrack.lyrics} 
                                        position={position} 
                                        trackId={currentTrack!.id}
                                    />
                                </Pressable>
                            ) : (
                                <Pressable style={styles.lyricsPlaceholder} onPress={toggleViewMode}>
                                    <Text color="$trueGray400">Không có lời cho bài hát này.</Text>
                                </Pressable>
                            )}
                        </Animated.View>
                    </VStack>

                    {/* Khu vực điều khiển */}
                    <VStack space="md">
                        <HStack justifyContent="space-between" alignItems="center">
                            <VStack flex={1}>
                                <Text size="2xl" fontWeight="$bold" color="white" isTruncated>{currentTrack.title}</Text>
                                <Text size="md" color="$trueGray400">{currentTrack.artist}</Text>
                            </VStack>
                            <Pressable onPress={() => toggleFavorite(currentTrack.id)} p="$2">
                                <Icon as={HeartIcon} size="xl" color={isCurrentlyFavorite ? '$rose500' : 'white'} fill={isCurrentlyFavorite ? '$rose500' : 'none'} />
                            </Pressable>
                        </HStack>

                        <VStack>
                            <Slider style={{ width: '100%', height: 20 }} value={displayPosition} minimumValue={0} maximumValue={duration > 0 ? duration : 1} minimumTrackTintColor="white" maximumTrackTintColor="rgba(255, 255, 255, 0.3)" thumbTintColor="white" onValueChange={handleSeek} onSlidingComplete={onSeekComplete} />
                            <HStack justifyContent="space-between"><Text size="xs" color="white">{formatTime(displayPosition)}</Text><Text size="xs" color="white">{formatTime(duration)}</Text></HStack>
                        </VStack>

                        <HStack justifyContent="space-around" alignItems="center">
                            <Pressable onPress={toggleShuffle} p="$4"><Icon as={ShuffleIcon} size="lg" color={isShuffle ? '$purple400' : 'white'} /></Pressable>
                            <Pressable onPress={playPrevious} p="$4"><Icon as={SkipBackIcon} size="xl" w="$8" h="$8" color="white" /></Pressable>
                            <Pressable onPress={togglePlayPause} p="$4" bg="rgba(192, 132, 252, 0.8)" borderRadius={999}><Icon as={isPlaying ? PauseIcon : PlayIcon} size="xl" w="$10" h="$10" color="white" /></Pressable>
                            <Pressable onPress={playNext} p="$4"><Icon as={SkipForwardIcon} size="xl" w="$8" h="$8" color="white" /></Pressable>
                            <Pressable onPress={toggleRepeatMode} p="$4"><Icon as={RepeatIconComponent()} size="lg" color={repeatMode !== 'off' ? '$purple400' : 'white'} /></Pressable>
                        </HStack>
                        
                        <HStack space="sm" alignItems="center">
                            <Icon as={VolumeXIcon} size="md" color="white" />
                            <Slider style={{ flex: 1, height: 20 }} value={volume} minimumValue={0} maximumValue={1} step={0.05} minimumTrackTintColor="white" maximumTrackTintColor="rgba(255, 255, 255, 0.3)" thumbTintColor="white" onValueChange={setVolume} />
                            <Icon as={Volume2Icon} size="md" color="white" />
                        </HStack>
                    </VStack>
                </VStack>
            </SafeAreaView>

            <Actionsheet isOpen={showOptionsMenu} onClose={() => setShowOptionsMenu(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent bg="$blueGray900">
                    <ActionsheetDragIndicatorWrapper><ActionsheetDragIndicator /></ActionsheetDragIndicatorWrapper>
                    <ActionsheetItem onPress={handleDownloadPress}>
                        <Icon as={isCurrentlyDownloaded ? TrashIcon : DownloadIcon} mr="$3" color="white" />
                        <ActionsheetItemText color="white">
                            {isCurrentlyDownloaded ? 'Xóa bản tải về' : 'Tải về'}
                        </ActionsheetItemText>
                    </ActionsheetItem>
                    <ActionsheetItem onPress={handleShare}>
                        <Icon as={ShareIcon} mr="$3" color="white" />
                        <ActionsheetItemText color="white">Chia sẻ</ActionsheetItemText>
                    </ActionsheetItem>
                    <ActionsheetItem onPress={() => setShowOptionsMenu(false)} bg="$blueGray800" mt="$2">
                        <ActionsheetItemText color="$red400" textAlign="center" w="$full">
                            Hủy
                        </ActionsheetItemText>
                    </ActionsheetItem>
                </ActionsheetContent>
            </Actionsheet>
        </Box>
    );
}

const styles = StyleSheet.create({ 
    container: { flex: 1, backgroundColor: 'transparent' },
    artworkContainer: { width: '80%', aspectRatio: 1, position: 'absolute' },
    lyricsContainer: { width: '100%', height: '35%', position: 'absolute' },
    lyricsPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});