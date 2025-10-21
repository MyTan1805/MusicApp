// File: app/history.tsx

import React, { useMemo } from 'react';
import { Box, Heading, FlatList, Text } from '@gluestack-ui/themed';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { usePlayer } from '../contexts/PlayerContext';
import { TRACKS, Track } from '../constants/tracks';
import SongItem from '../components/SongItem';
import MiniPlayer from '../components/MiniPlayer';

export default function HistoryScreen() {
  const { history, playTrack, currentTrack } = usePlayer();

  // Chuyển đổi mảng ID trong history thành mảng các object Track đầy đủ
  // Đồng thời giữ nguyên thứ tự của history (bài nghe gần nhất ở trên cùng)
  const historyTracks = useMemo(() => {
    // Tạo một map để tra cứu track object bằng ID cho nhanh
    const tracksMap = new Map(TRACKS.map(track => [track.id, track]));
    // Map qua mảng history và lấy ra track object tương ứng
    return history.map(trackId => tracksMap.get(trackId)).filter(Boolean) as Track[];
  }, [history]);

  const handleSongPress = (track: Track) => {
    // Khi phát nhạc từ History, playlist sẽ chính là danh sách History
    playTrack(track, historyTracks);
  };

  return (
    <Box flex={1} bg="$backgroundLight50">
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Lịch sử' }} />
        <Box padding="$4">
          <Heading size="xl">Lịch sử nghe nhạc</Heading>
        </Box>

        <FlatList
          data={historyTracks}
          renderItem={({ item }) => {
            const track = item as Track;
            return <SongItem track={track} onPress={() => handleSongPress(track)} />;
          }}
          keyExtractor={(item, index) => `${(item as Track).id}-${index}`}
          ListEmptyComponent={
            <Box flex={1} alignItems="center" justifyContent="center" mt="$16">
              <Text>Lịch sử nghe nhạc của bạn trống.</Text>
            </Box>
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: currentTrack ? 80 : 20 }}
        />

        {currentTrack && <MiniPlayer />}
      </SafeAreaView>
    </Box>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });