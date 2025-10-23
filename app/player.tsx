// File: app/player.tsx

import {
    Actionsheet,
    Box,
    HStack, Icon,
    Image,
    Pressable,
    Text,
    VStack
} from '@gluestack-ui/themed';
import Slider from '@react-native-community/slider';
import { Stack, useRouter } from 'expo-router';
import {
    ChevronDownIcon,
    HeartIcon,
    MoreHorizontalIcon,
    PauseIcon,
    PlayIcon,
    Repeat1Icon,
    RepeatIcon,
    ShuffleIcon,
    SkipBackIcon,
    SkipForwardIcon,
    Volume2Icon,
    VolumeXIcon
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Share, StyleSheet, UIManager } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    const {
        currentTrack, isPlaying, position, duration, togglePlayPause, playNext, playPrevious,
        isSeeking, onSeek, onSeekComplete, isFavorite, toggleFavorite, isShuffle, toggleShuffle, 
        repeatMode, toggleRepeatMode, volume, setVolume, isDownloaded, downloadTrack, deleteDownload,
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
            await Share.share({
                message: `Nghe thử bài hát "${currentTrack.title}" của ${currentTrack.artist} nhé!`,
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
    if (!currentTrack) { if (router.canGoBack()) router.back(); return null; }
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
                        <Pressable onPress={() => router.back()} p="$2"><Icon as={ChevronDownIcon} size="xl" color="white" /></Pressable>
                        <Pressable onPress={toggleViewMode}>
                            <Text color="white" fontWeight="$medium">{viewMode === 'artwork' ? 'Now Playing' : 'Lyrics'}</Text>
                        </Pressable>
                        <Pressable onPress={() => setShowOptionsMenu(true)} p="$2"><Icon as={MoreHorizontalIcon} size="xl" color="white" /></Pressable>
                    </HStack>

                    {/* Nội dung chính */}
                    <VStack flex={1} justifyContent="center" alignItems="center">
                        <Animated.View style={[styles.artworkContainer, artworkStyle]}>
                            <Pressable style={{ flex: 1 }} onPress={toggleViewMode}>
                                <Image source={currentTrack.artwork} alt={currentTrack.title} size="full" borderRadius={999}/>
                            </Pressable>
                        </Animated.View>
                        
                        <Animated.View style={[styles.lyricsContainer, lyricsStyle]}>
                             {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                                <Pressable style={{ flex: 1 }} onPress={toggleViewMode}>
                                    <LyricsViewer lyrics={currentTrack.lyrics} position={position} />
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
                {/* ... Actionsheet content không đổi ... */}
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