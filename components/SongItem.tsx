// File: components/SongItem.tsx

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Track } from '../constants/tracks';

const COLORS = { textSecondary: '#b3b3b3' };

interface SongItemProps {
  track: Track;
  onPress: () => void;
  onLongPress?: () => void;
  downloadComponent?: React.ReactNode;
}

const SongItem: React.FC<SongItemProps> = ({ track, onPress, onLongPress, downloadComponent }) => {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.container}>
      <Image source={track.artwork} style={styles.artwork} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
      </View>
      {downloadComponent && <View>{downloadComponent}</View>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 },
    artwork: { width: 50, height: 50, borderRadius: 6, marginRight: 12 },
    infoContainer: { flex: 1 },
    title: { color: 'white', fontSize: 16, fontWeight: '500' },
    artist: { color: COLORS.textSecondary, fontSize: 14 },
});

export default SongItem;