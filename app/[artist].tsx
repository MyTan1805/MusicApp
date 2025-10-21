// File: app/[artist].tsx

import React, { useMemo } from 'react';
import { Box, Heading, FlatList } from '@gluestack-ui/themed';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { usePlayer } from '../contexts/PlayerContext';
import { TRACKS, Track } from '../constants/tracks';
import SongItem from '../components/SongItem';
import MiniPlayer from '../components/MiniPlayer';

export default function ArtistDetailScreen() {
  const { artist } = useLocalSearchParams<{ artist: string }>();
  // decodeURIComponent để giải mã lại tên từ URL
  const artistName = useMemo(() => artist ? decodeURIComponent(artist) : '', [artist]);
  
  const { playTrack, currentTrack } = usePlayer();

  // Lọc ra danh sách các bài hát của ca sĩ này
  const artistTracks = useMemo(() => {
    return TRACKS.filter(track => track.artist === artistName);
  }, [artistName]);

  const handleSongPress = (track: Track) => {
    playTrack(track, artistTracks);
  };

  return (
    <Box flex={1} bg="$backgroundLight50">
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: artistName }} />
        <Box padding="$4">
          <Heading size="xl">{artistName}</Heading>
        </Box>

        <FlatList
          data={artistTracks}
          renderItem={({ item }) => {
            const track = item as Track;
            return <SongItem track={track} onPress={() => handleSongPress(track)} />;
          }}
          keyExtractor={(item) => (item as Track).id}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: currentTrack ? 80 : 20 }}
        />

        {currentTrack && <MiniPlayer />}
      </SafeAreaView>
    </Box>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });