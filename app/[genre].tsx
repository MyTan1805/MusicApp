// File: app/[genre].tsx

import { Box, FlatList, Heading } from '@gluestack-ui/themed';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import MiniPlayer from '../components/MiniPlayer';
import SongItem from '../components/SongItem';
import { TRACKS, Track } from '../constants/tracks';
import { usePlayer } from '../contexts/PlayerContext';

export default function GenreDetailScreen() {
  const { genre } = useLocalSearchParams<{ genre: string }>();
  const router = useRouter();
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
      router.push('/player');
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