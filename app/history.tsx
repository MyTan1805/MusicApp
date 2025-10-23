// File: app/history.tsx

import { Box, FlatList, Heading, Text, VStack } from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient'; // 1. Import Gradient
import { Stack, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import MiniPlayer from '../components/MiniPlayer';
import SongItem from '../components/SongItem';
import { TRACKS, Track } from '../constants/tracks';
import { usePlayer } from '../contexts/PlayerContext';

export default function HistoryScreen() {
  const { history, playTrack, currentTrack } = usePlayer();
  const router = useRouter();

  const historyTracks = useMemo(() => {
    const tracksMap = new Map(TRACKS.map(track => [track.id, track]));
    return history.map(trackId => tracksMap.get(trackId)).filter(Boolean) as Track[];
  }, [history]);

  const handleSongPress = (track: Track) => {
      playTrack(track, historyTracks);
      router.push('/player');
  };

  // 2. TẠO HÀM MỚI: PHÁT TẤT CẢ
  const handlePlayAll = () => {
    if (historyTracks.length > 0) {
      playTrack(historyTracks[0], historyTracks);
    }
  };

  // 3. TẠO COMPONENT HEADER CHO FLATLIST
  const ListHeader = () => (
    <Box p="$4" pt="$16">
      <Heading size="2xl" color="white" bold>
        Lịch sử nghe nhạc
      </Heading>
      
      {historyTracks.length > 0 && (
        <Text color="$trueGray400" size="sm">{historyTracks.length} bài hát</Text>
      )}

    </Box>
  );
 
  return (
    // 4. BỌC TRONG LINEARGRADIENT
    <LinearGradient colors={['#434343', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Lịch sử', 
            headerShown: false // Ẩn header để tự custom
          }} 
        />
        
        <FlatList
          data={historyTracks}
          ListHeaderComponent={ListHeader} // 5. SỬ DỤNG HEADER MỚI
          renderItem={({ item }) => {
            const track = item as Track;
            return <SongItem track={track} onPress={() => handleSongPress(track)} />;
          }}
          keyExtractor={(item, index) => `${(item as Track).id}-${index}`}
          ListEmptyComponent={
            // 6. CẢI THIỆN THÔNG BÁO TRỐNG
            <VStack flex={1} space="md" alignItems="center" justifyContent="center" mt="$16">
              <Heading color="white">Chưa có gì ở đây</Heading>
              <Text color="$trueGray400">Hãy bắt đầu nghe một bài hát.</Text>
            </VStack>
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: currentTrack ? 160 : 80 }}
        />

        {currentTrack && <MiniPlayer />}
      </SafeAreaView>
    </LinearGradient>
  );
}

// 7. LÀM TRONG SUỐT SAFEAREAVIEW
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: 'transparent' } });