// File: app/(tabs)/favorites.tsx

import { Box, Button, ButtonText, FlatList, Heading, Icon, Text } from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PlayIcon } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import MiniPlayer from '../../components/MiniPlayer';
import SongItem from '../../components/SongItem';
import { TRACKS, Track } from '../../constants/tracks';
import { usePlayer } from '../../contexts/PlayerContext';

export default function FavoritesScreen() {
  const { favorites, playTrack, currentTrack } = usePlayer();
  const router = useRouter();

  const favoriteTracks = useMemo(() => {
    return TRACKS.filter(track => favorites.includes(track.id));
  }, [favorites]);

  const handlePlayAll = () => {
    if (favoriteTracks.length > 0) {
      // Phát bài đầu tiên, và đặt playlist là toàn bộ danh sách yêu thích
      playTrack(favoriteTracks[0], favoriteTracks);
    }
  };
  
  const handleSongPress = (track: Track) => {
      playTrack(track, favoriteTracks);
      router.push('/player');
  };

  // Component Header cho FlatList
  const ListHeader = () => (
    <Box p="$4">
      <Heading size="2xl" color="white">Yêu thích</Heading>
      {favoriteTracks.length > 0 && (
        <Text color="$trueGray400" size="sm">{favoriteTracks.length} bài hát</Text>
      )}

      {favoriteTracks.length > 0 && (
        <Button 
          onPress={handlePlayAll}
          bg="$green500" 
          borderRadius="$full" 
          w={150} 
          alignSelf="center" 
          mt="$6"
        >
          <Icon as={PlayIcon} color="black" fill="black" mr="$2" />
          <ButtonText color="black" fontWeight="$bold">Phát tất cả</ButtonText>
        </Button>
      )}
    </Box>
  );

  return (
    <LinearGradient colors={['#434343', '#000000']} locations={[0, 0.25]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={favoriteTracks}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => {
            const track = item as Track;
            return <SongItem track={track} onPress={() => handleSongPress(track)} />;
          }}
          keyExtractor={(item) => (item as Track).id}
          ListEmptyComponent={
            <Box flex={1} alignItems="center" justifyContent="center" mt="$16">
              <Text color="white">Chạm vào trái tim cạnh một bài hát</Text>
              <Text color="$trueGray400">để thêm vào đây.</Text>
            </Box>
          }
          contentContainerStyle={{ 
            paddingBottom: currentTrack ? 160 : 80,
            flexGrow: 1
          }}
        />
        {currentTrack && <MiniPlayer />}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: 'transparent' } });