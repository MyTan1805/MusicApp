// File: app/player.tsx

import React, { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { Box, VStack, Text, Image, HStack, Icon, Pressable } from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { ChevronDownIcon, SkipBackIcon, PlayIcon, PauseIcon, SkipForwardIcon, HeartIcon, ShuffleIcon, RepeatIcon, Repeat1Icon, Volume2Icon, VolumeXIcon, ShareIcon } from 'lucide-react-native';
import LyricsViewer from '../components/LyricsViewer';
import { usePlayer } from '../contexts/PlayerContext';
import { formatTime } from '../utils/formatTime';
import ArcticBackground from '../components/ArcticBackground';

export default function PlayerScreen() {
    const router = useRouter();
    const {
        currentTrack, isPlaying, position, duration, togglePlayPause, playNext, playPrevious,
        isSeeking, onSeek, onSeekComplete, isFavorite, toggleFavorite, isShuffle, toggleShuffle, 
        repeatMode, toggleRepeatMode, volume, setVolume,
    } = usePlayer();

    const [seekingPosition, setSeekingPosition] = useState(0);

    useEffect(() => {
        if (!isSeeking) { setSeekingPosition(position); }
    }, [position, isSeeking]);

    const handleSeek = (value: number) => {
        setSeekingPosition(value);
        onSeek(value);
    };
    
    const displayPosition = isSeeking ? seekingPosition : position;
      const handleShare = async () => {
    if (!currentTrack) return;

    try {
      const result = await Share.share({
        // Nội dung chính, sẽ được điền vào phần thân của tin nhắn, email, v.v.
        message: `Nghe thử bài hát "${currentTrack.title}" của ${currentTrack.artist} nhé!`,
        
        // (Tùy chọn) URL trỏ đến bài hát.
        // Hiện tại chúng ta chưa có link web, nên có thể để trống hoặc dùng link app.
        // url: 'https://yourapp.com/track/' + currentTrack.id,

        // (Tùy chọn cho iOS) Tiêu đề của nội dung chia sẻ.
        title: `Chia sẻ bài hát: ${currentTrack.title}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('Shared with activity type:', result.activityType);
        } else {
          // shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
    if (!currentTrack) { if (router.canGoBack()) { router.back(); } return null; }
    const RepeatIconComponent = () => repeatMode === 'one' ? Repeat1Icon : RepeatIcon;
    const isCurrentlyFavorite = isFavorite(currentTrack.id);

    const handleToggleShuffle = () => {
        console.log('Shuffle Toggled');
        toggleShuffle();
    };

    const handleToggleRepeat = () => {
        console.log('Repeat Toggled');
        toggleRepeatMode();
    };

    return (
        <Box flex={1}>
            {/* Đặt component nền ở dưới cùng */}
            <ArcticBackground />

            <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
                <Stack.Screen options={{ headerShown: false }} />
                <VStack flex={1} p="$4">
                    
                    <HStack justifyContent="space-between" alignItems="center">
                        <Pressable onPress={() => router.back()} p="$2">
                            <Icon as={ChevronDownIcon} size="xl" color="white" />
                        </Pressable>
                        <Text fontWeight="$medium" color="white">ĐANG PHÁT</Text>
                        <Pressable onPress={handleShare} p="$2">
                            <Icon as={ShareIcon} size="xl" color="white" />
                        </Pressable>
                    </HStack>

                    <VStack flex={1} justifyContent="center" space="lg">
                        {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                            <LyricsViewer lyrics={currentTrack.lyrics} position={position} />
                        ) : (
                            <Box px="$8">
                                <Image source={currentTrack.artwork} alt={currentTrack.title} w="100%" style={{ aspectRatio: 1 }} borderRadius={16} />
                            </Box>
                        )}
                        <HStack justifyContent="space-between" alignItems="center">
                            <VStack flex={1}>
                                <Text size="2xl" fontWeight="$bold" isTruncated color="white">{currentTrack.title}</Text>
                                <Text size="md" color="$trueGray400">{currentTrack.artist}</Text>
                            </VStack>
                            <Pressable onPress={() => toggleFavorite(currentTrack.id)} p="$2">
                                <Icon as={HeartIcon} size="xl" color={isCurrentlyFavorite ? '$rose500' : 'white'} fill={isCurrentlyFavorite ? '$rose500' : 'none'} />
                            </Pressable>
                        </HStack>
                    </VStack>

                    <VStack space="md">
                        <VStack>
                            <Slider
                                style={{ width: '100%', height: 40 }} value={displayPosition} minimumValue={0}
                                maximumValue={duration > 0 ? duration : 1} minimumTrackTintColor="white"
                                maximumTrackTintColor="rgba(255, 255, 255, 0.3)" thumbTintColor="white"
                                onValueChange={handleSeek} onSlidingComplete={onSeekComplete}
                            />
                            <HStack justifyContent="space-between">
                                <Text size="xs" color="white">{formatTime(displayPosition)}</Text>
                                <Text size="xs" color="white">{formatTime(duration)}</Text>
                            </HStack>
                        </VStack>

                        <HStack justifyContent="space-around" alignItems="center">
                            <Pressable onPress={toggleShuffle} p="$4">
                                <Icon as={ShuffleIcon} size="xl" w="$6" h="$6" color={isShuffle ? '$primary400' : 'white'} />
                            </Pressable>
                            <Pressable onPress={playPrevious} p="$4">
                                <Icon as={SkipBackIcon} size="xl" w="$8" h="$8" color="white" />
                            </Pressable>
                            <Pressable onPress={togglePlayPause} p="$4" bg="rgba(255,255,255,0.2)" borderRadius="$full">
                                <Icon as={isPlaying ? PauseIcon : PlayIcon} size="xl" w="$10" h="$10" color="white" />
                            </Pressable>
                            <Pressable onPress={playNext} p="$4">
                                <Icon as={SkipForwardIcon} size="xl" w="$8" h="$8" color="white" />
                            </Pressable>
                            <Pressable onPress={handleToggleRepeat} p="$4">
                                <Icon as={RepeatIconComponent()} size="xl" w="$6" h="$6" color={repeatMode !== 'off' ? '$primary400' : 'white'} />
                            </Pressable>
                        </HStack>
                        
                        <HStack space="sm" alignItems="center" px="$4">
                            <Icon as={VolumeXIcon} size="md" color="white" />
                            <Slider
                                style={{ flex: 1, height: 40 }} value={volume} minimumValue={0} maximumValue={1} step={0.05}
                                minimumTrackTintColor="white" maximumTrackTintColor="rgba(255, 255, 255, 0.3)" thumbTintColor="white"
                                onValueChange={setVolume}
                            />
                            <Icon as={Volume2Icon} size="md" color="white" />
                        </HStack>
                    </VStack>
                </VStack>
            </SafeAreaView>
        </Box>
    );
}