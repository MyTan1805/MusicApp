// File: app/[playlistId].tsx

import { Box, Button, ButtonText, FlatList, Heading, Icon, Spinner, Text, VStack } from '@gluestack-ui/themed';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PlayIcon } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import MiniPlayer from '../../components/MiniPlayer';
import SongItem from '../../components/SongItem';
import { TRACKS, Track } from '../../constants/tracks';
import { Playlist, usePlayer } from '../../contexts/PlayerContext'; // Import thêm Playlist

export default function PlaylistDetailScreen() {
  const { playlistId } = useLocalSearchParams<{ playlistId: string }>();
  const { playlists, playTrack, currentTrack, removeTrackFromPlaylist } = usePlayer();
  const router = useRouter();
  
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null | undefined>(undefined);

  useEffect(() => {
    if (playlists.length > 0 && playlistId) {
      const foundPlaylist = playlists.find(p => p.id === playlistId);
      setCurrentPlaylist(foundPlaylist || null);
    }
  }, [playlists, playlistId]);

  const playlistTracks = useMemo(() => {
    if (!currentPlaylist) return [];
    const tracksMap = new Map(TRACKS.map(t => [t.id, t]));
    return currentPlaylist.tracks
      .map(trackId => tracksMap.get(trackId))
      .filter(Boolean) as Track[];
  }, [currentPlaylist]);

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks);
    }
  };

  const handleSongPress = (track: Track) => {
      playTrack(track, playlistTracks);
      router.push('/player');
  };

  // --- CÁC TRẠNG THÁI RENDER ---

  // 1. Đang chờ dữ liệu
  if (currentPlaylist === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="white" />
        </Box>
      </SafeAreaView>
    );
  }

  // 2. Không tìm thấy playlist
  if (currentPlaylist === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Lỗi", headerTintColor: 'white' }} />
        <Box flex={1} alignItems="center" justifyContent="center">
          <Heading color="white">Không tìm thấy playlist</Heading>
          <Text color="$trueGray400">Có thể nó đã bị xóa.</Text>
        </Box>
      </SafeAreaView>
    );
  }
  
  // 3. Render giao diện chính
  const ListHeader = () => (
    <Box p="$4">
      <Heading size="2xl" color="white" bold>{currentPlaylist.name}</Heading>
      {playlistTracks.length > 0 && (
        <Text color="$trueGray400" size="sm">{playlistTracks.length} bài hát</Text>
      )}
      {playlistTracks.length > 0 && (
        <Button onPress={handlePlayAll} bg="$green500" borderRadius="$full" w={150} alignSelf="center" mt="$6">
          <Icon as={PlayIcon} color="black" fill="black" mr="$2" />
          <ButtonText color="black" fontWeight="$bold">Phát tất cả</ButtonText>
        </Button>
      )}
    </Box>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: currentPlaylist.name,
          headerTintColor: 'white',
        }} 
      />
      
      <FlatList
        data={playlistTracks}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => {
          const track = item as Track;
          return (
            <SongItem 
              track={track} 
              onPress={() => handleSongPress(track)}
              onLongPress={() => removeTrackFromPlaylist(currentPlaylist.id, track.id)}
            />
          );
        }}
        keyExtractor={(item) => (item as Track).id}
        ListEmptyComponent={
          <VStack flex={1} space="md" alignItems="center" justifyContent="center" mt="$16">
            <Heading color="white" size="lg">Playlist này trống</Heading>
            <Text color="$trueGray400">Nhấn giữ một bài hát để thêm vào đây.</Text>
          </VStack>
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: currentTrack ? 160 : 80 }}
      />

      {currentTrack && <MiniPlayer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: 'transparent' } });