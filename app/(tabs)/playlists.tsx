// File: app/(tabs)/playlists.tsx

import {
  AlertDialog, AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button, ButtonText,
  FlatList,
  Heading,
  Icon,
  Input, InputField,
  Pressable,
  Text,
  VStack
} from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PlusIcon, XIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import MiniPlayer from '../../components/MiniPlayer';
import { Playlist, usePlayer } from '../../contexts/PlayerContext';

// Component để hiển thị một item playlist (đã đổi màu)
const PlaylistItem = ({ playlist }: { playlist: Playlist }) => {
    const router = useRouter();

    const navigateToDetail = () => {
      router.push(`/playlist/${playlist.id}`);
    };

    return (
        <Pressable
            onPress={navigateToDetail}
            px="$4"
            py="$3"
            borderBottomWidth={1}
            borderBottomColor="rgba(255, 255, 255, 0.1)" // Viền mờ
        >
            <Text fontWeight="$medium" color="white" size="lg">{playlist.name}</Text>
            <Text size="sm" color="$trueGray400">{playlist.tracks.length} bài hát</Text>
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
    <LinearGradient colors={['#434343', '#000000']} locations={[0, 0.25]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Box padding="$4" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Heading size="2xl" color="white">Playlists</Heading>
          <Button size="sm" bg="$white" borderRadius="$full" onPress={() => setShowAlertDialog(true)}>
            <Icon as={PlusIcon} color="black" mr="$2" />
            <ButtonText color="black" fontWeight="$bold">Tạo mới</ButtonText>
          </Button>
        </Box>

        <FlatList
          data={playlists}
          renderItem={({ item }) => <PlaylistItem playlist={item as Playlist} />}
          keyExtractor={(item) => (item as Playlist).id}
          ListEmptyComponent={
            <VStack flex={1} space="md" alignItems="center" justifyContent="center" mt="$16">
              <Heading color="white">Tạo playlist đầu tiên</Heading>
              <Text color="$trueGray400">Lưu lại những bài hát yêu thích của bạn.</Text>
            </VStack>
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: currentTrack ? 160 : 80 }}
        />
        
        {currentTrack && <MiniPlayer />}
      </SafeAreaView>

      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => {
          setShowAlertDialog(false);
          setNewPlaylistName('');
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent bg="$blueGray900">
          <AlertDialogHeader borderBottomWidth={0}>
            <Heading size="lg" color="white">Playlist mới</Heading>
            <AlertDialogCloseButton>
              <Icon as={XIcon} color="white" />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Input>
              <InputField
                placeholder="Đặt tên cho playlist..."
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                color="white"
                placeholderTextColor="$trueGray400"
                autoFocus={true}
              />
            </Input>
          </AlertDialogBody>
          <AlertDialogFooter borderTopWidth={0}>
            <Button variant="link" action="secondary" onPress={() => setShowAlertDialog(false)} mr="$3">
              <ButtonText color="$trueGray400">Hủy</ButtonText>
            </Button>
            <Button bg="$white" borderRadius="$full" onPress={handleCreatePlaylist}>
              <ButtonText color="black" fontWeight="$bold">Tạo</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: 'transparent' } });