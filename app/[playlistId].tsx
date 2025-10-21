// File: app/[playlistId].tsx

import React, { useMemo } from 'react';
import { Box, Heading, FlatList, Text } from '@gluestack-ui/themed';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { usePlayer } from '../contexts/PlayerContext';
import { TRACKS, Track } from '../constants/tracks';
import SongItem from '../components/SongItem';
import MiniPlayer from '../components/MiniPlayer';

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { playlistId } = useLocalSearchParams<{ playlistId: string }>(); // Lấy ID từ URL
  const { playlists, playTrack, currentTrack, removeTrackFromPlaylist  } = usePlayer();

  // Tìm playlist hiện tại từ danh sách playlists
  const currentPlaylist = useMemo(() => {
    return playlists.find(p => p.id === playlistId);
  }, [playlists, playlistId]);

  // Lọc ra danh sách bài hát đầy đủ (object Track) cho playlist này
  const playlistTracks = useMemo(() => {
    if (!currentPlaylist) return [];
    // Lọc TRACKS dựa trên mảng track ID của currentPlaylist
    return TRACKS.filter(track => currentPlaylist.tracks.includes(track.id));
  }, [currentPlaylist]);

  const handleSongPress = (track: Track) => {
    // Khi phát nhạc, playlist hiện tại chính là danh sách bài hát của playlist này
    playTrack(track, playlistTracks);
  };

  if (!currentPlaylist) {
    // Xử lý trường hợp không tìm thấy playlist (ví dụ: đã bị xóa)
    return (
      <SafeAreaView style={styles.container}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Text>Không tìm thấy playlist.</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <Box flex={1} bg="$backgroundLight50">
      <SafeAreaView style={styles.container}>
        {/* Sử dụng Stack.Screen để tùy chỉnh header */}
        <Stack.Screen 
          options={{ 
            title: currentPlaylist.name, // Hiển thị tên playlist trên header
            headerBackTitle: 'Back', // Chữ cho nút back trên iOS
          }} 
        />
        <Box padding="$4">
          <Heading size="xl">{currentPlaylist.name}</Heading>
        </Box>

        <FlatList
          data={playlistTracks}
          renderItem={({ item }) => {
            const track = item as Track;
            return (
                <SongItem 
                    track={track} 
                    onPress={() => handleSongPress(track)}
                    // Nhấn giữ để xóa
                    onLongPress={() => removeTrackFromPlaylist(currentPlaylist.id, track.id)}
                />
            );
          }}
          keyExtractor={(item) => (item as Track).id}
          ListEmptyComponent={
            <Box flex={1} alignItems="center" justifyContent="center" mt="$16">
              <Text>Playlist này chưa có bài hát nào.</Text>
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