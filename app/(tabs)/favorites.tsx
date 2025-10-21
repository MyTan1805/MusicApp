// File: app/(tabs)/favorites.tsx

import React, { useMemo } from 'react';
import { Box, Heading, FlatList, Text } from '@gluestack-ui/themed';
import { SafeAreaView, StyleSheet } from 'react-native';

import { usePlayer } from '../../contexts/PlayerContext';
import { TRACKS, Track } from '../../constants/tracks';
import SongItem from '../../components/SongItem';
import MiniPlayer from '../../components/MiniPlayer';

export default function FavoritesScreen() {
  const { favorites, playTrack, currentTrack } = usePlayer();

  // Lọc ra danh sách các bài hát yêu thích đầy đủ (object Track)
  // useMemo giúp tối ưu, chỉ tính toán lại khi `favorites` hoặc `TRACKS` thay đổi
  const favoriteTracks = useMemo(() => {
    return TRACKS.filter(track => favorites.includes(track.id));
  }, [favorites]);

  // Hàm xử lý khi nhấn vào bài hát trong danh sách yêu thích
  const handleSongPress = (track: Track) => {
    // Quan trọng: Truyền vào `favoriteTracks` làm playlist hiện tại
    playTrack(track, favoriteTracks);
  };

  return (
      <SafeAreaView style={styles.container}>
        <Box padding="$4">
          <Heading size="xl" color="white">Yêu thích</Heading>
        </Box>

        <FlatList
          data={favoriteTracks}
          renderItem={({ item }) => {
            // Sử dụng type assertion `as Track`
            const track = item as Track; 
            return (
              <SongItem track={track} onPress={() => handleSongPress(track)} />
            );
          }}
          keyExtractor={(item) => {
            // Tương tự, cũng cần assert kiểu ở đây
            const track = item as Track;
            return track.id;
          }}
          ListEmptyComponent={
            <Box flex={1} alignItems="center" justifyContent="center" mt="$16">
              <Text color="white">Chưa có bài hát yêu thích nào.</Text>
            </Box>
          }
          contentContainerStyle={{ 
            paddingBottom: currentTrack ? 80 : 20,
            flexGrow: 1
          }}
        />

        {currentTrack && <MiniPlayer />}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});