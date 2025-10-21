// File: components/MiniPlayer.tsx

import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from '../app/(tabs)/_layout';
import { usePlayer } from '../contexts/PlayerContext';
import { COLORS } from '../styles/colors';

const MiniPlayer = () => {
    const router = useRouter();
    const {
        currentTrack, isPlaying, togglePlayPause, position, duration,
        isSeeking, onSeek, onSeekComplete, playNext, playPrevious
    } = usePlayer();
    
    const miniPlayerBottomPosition = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN + 10;
    const [seekingPosition, setSeekingPosition] = useState(0);
  
    useEffect(() => {
        if (!isSeeking) { setSeekingPosition(position); }
    }, [position, isSeeking]);

    if (!currentTrack) { return null; }

    const handleSeek = (value: number) => {
        setSeekingPosition(value);
        onSeek(value);
    };
  
    const displayPosition = isSeeking ? seekingPosition : position;

    const openPlayerScreen = () => router.push('/player');

    return (
        <View style={[styles.outerContainer, { bottom: miniPlayerBottomPosition }]}>
            <View style={styles.innerContainer}>
                <Pressable onPress={openPlayerScreen} style={styles.artworkPressable}>
                    <Image 
                        source={currentTrack.artwork} 
                        alt={currentTrack.title} 
                        style={styles.artwork}
                    />
                </Pressable>

                <View style={styles.infoAndSliderContainer}>
                    <Pressable onPress={openPlayerScreen}>
                        <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
                        <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
                    </Pressable>
                    <Slider
                        style={styles.slider}
                        value={displayPosition}
                        minimumValue={0}
                        maximumValue={duration > 0 ? duration : 1}
                        minimumTrackTintColor={COLORS.white}
                        maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                        thumbTintColor="transparent"
                        onValueChange={handleSeek}
                        onSlidingComplete={onSeekComplete}
                    />
                </View>

                <View style={styles.controlsContainer}>
                    <Pressable onPress={playPrevious} style={styles.controlButton}>
                        <SkipBackIcon size={22} color={COLORS.white} />
                    </Pressable>
                    <Pressable onPress={togglePlayPause} style={styles.controlButton}>
                        <View style={styles.playPauseBackground}>
                            {isPlaying ? <PauseIcon size={22} color={COLORS.white} /> : <PlayIcon size={22} color={COLORS.white} />}
                        </View>
                    </Pressable>
                    <Pressable onPress={playNext} style={styles.controlButton}>
                        <SkipForwardIcon size={22} color={COLORS.white} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(28, 28, 28, 0.9)',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    artworkPressable: {
        // Just holds the image
    },
    artwork: {
        width: 52,
        height: 52,
        borderRadius: 24,
    },
    infoAndSliderContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    artist: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    slider: {
        width: '100%',
        height: 10,
        marginTop: 4,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButton: {
        padding: 4,
    },
    playPauseBackground: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 999,
        padding: 8,
    }
});

export default MiniPlayer;