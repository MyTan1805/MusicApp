// File: app/[genre].tsx

import React, { useMemo } from 'react';
import { Box, Heading, FlatList } from '@gluestack-ui/themed';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { usePlayer } from '../contexts/PlayerContext';
import { TRACKS, Track } from '../constants/tracks';
import SongItem from '../components/SongItem';
import MiniPlayer from '../components/MiniPlayer';

export default function GenreDetailScreen() {
  const { genre } = useLocalSearchParams<{ genre: string }>();
  const genreName = useMemo(() => genre ? decodeURIComponent(genre) : '', [genre]);
  
  const { playTrack, currentTrack } = usePlayer();
  console.log('--- Genre Detail Screen Rendered ---');
  console.log('Genre from URL (decoded):', genreName);
  console.log('Searching in TRACKS:', TRACKS);

  const genreTracks = useMemo(() => {
    if (!genreName) return [];
    
    // So sánh không phân biệt hoa/thường để chắc chắn
    const results = TRACKS.filter(track => 
        track.genre?.toLowerCase() === genreName.toLowerCase()
    );

    console.log(`Found ${results.length} tracks for genre "${genreName}"`);
    return results;
  }, [genreName]);

  const handleSongPress = (track: Track) => {
    playTrack(track, genreTracks);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: genreName, headerTintColor: 'white' }} />
      <Box padding="$4">
        <Heading size="xl" color="white">{genreName}</Heading>
      </Box>

      <FlatList
        data={genreTracks}
        renderItem={({ item }) => {
          const track = item as Track;
          return <SongItem track={track} onPress={() => handleSongPress(track)} />;
        }}
        keyExtractor={(item) => (item as Track).id}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: currentTrack ? 160 : 80 }}
      />

      {currentTrack && <MiniPlayer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: 'transparent' } });