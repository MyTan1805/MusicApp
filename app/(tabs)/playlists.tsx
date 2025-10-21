// File: app/(tabs)/playlists.tsx

import React, { useState } from 'react';
import {
  Box, Heading, FlatList, Text, Pressable, Icon, Button, ButtonText,
  AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, 
  AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Input, InputField
} from '@gluestack-ui/themed';
import { SafeAreaView, StyleSheet } from 'react-native';
import { PlusIcon, XIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { usePlayer } from '../../contexts/PlayerContext';
import { Playlist } from '../../contexts/PlayerContext'; // Import interface
import MiniPlayer from '../../components/MiniPlayer';

// Component để hiển thị một item playlist
const PlaylistItem = ({ playlist }: { playlist: Playlist }) => {
    const router = useRouter(); // <-- Sử dụng hook

    const navigateToDetail = () => {
        // Điều hướng đến route động, truyền playlist.id
        router.push(`/${playlist.id}`);
    };
  return (
    <Pressable
      onPress={navigateToDetail}
      p="$4"
      borderBottomWidth={1}
      borderBottomColor="$trueGray200"
    >
      <Text fontWeight="$medium">{playlist.name}</Text>
      <Text size="sm" color="$textLight500">{playlist.tracks.length} bài hát</Text>
    </Pressable>
  );
};

export default function PlaylistsScreen() {
  const { playlists, createPlaylist, currentTrack } = usePlayer();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setShowAlertDialog(false);
    }
  };

  return (
    <Box flex={1} bg="$backgroundLight50">
      <SafeAreaView style={styles.container}>
        <Box padding="$4" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Heading size="xl">Playlists</Heading>
          <Button size="sm" action="primary" onPress={() => setShowAlertDialog(true)}>
            <Icon as={PlusIcon} color="white" mr="$2" />
            <ButtonText>Tạo mới</ButtonText>
          </Button>
        </Box>

        <FlatList
          data={playlists}
          renderItem={({ item }) => <PlaylistItem playlist={item as Playlist} />}
          keyExtractor={(item) => (item as Playlist).id}
          ListEmptyComponent={
            <Box flex={1} alignItems="center" justifyContent="center" mt="$16">
              <Text>Chưa có playlist nào.</Text>
            </Box>
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: currentTrack ? 80 : 20 }}
        />

        {currentTrack && <MiniPlayer />}
      </SafeAreaView>

      {/* Dialog để tạo playlist mới */}
      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => {
          setShowAlertDialog(false);
          setNewPlaylistName('');
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Tạo Playlist Mới</Heading>
            <AlertDialogCloseButton>
              <Icon as={XIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Input>
              <InputField
                placeholder="Tên playlist..."
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
              />
            </Input>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" action="secondary" onPress={() => setShowAlertDialog(false)} mr="$3">
              <ButtonText>Hủy</ButtonText>
            </Button>
            <Button action="primary" onPress={handleCreatePlaylist}>
              <ButtonText>Tạo</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });