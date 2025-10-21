// File: components/SuggestionCarousel.tsx

import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Track } from '../constants/tracks';

const COLORS = { textSecondary: '#b3b3b3' };

interface SuggestionCarouselProps {
  title: string;
  tracks: Track[];
  onTrackPress: (track: Track) => void;
}

const SuggestionCarousel: React.FC<SuggestionCarouselProps> = ({ title, tracks, onTrackPress }) => {
  if (tracks.length === 0) return null;

  const renderTrackItem = ({ item }: { item: Track }) => (
    <Pressable onPress={() => onTrackPress(item)} style={styles.carouselItem}>
      <Image source={item.artwork} style={styles.carouselImage} />
      <Text style={styles.carouselTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.carouselArtist} numberOfLines={1}>{item.artist}</Text>
    </Pressable>
  );

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.carouselHeader}>{title}</Text>
      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    carouselContainer: { marginVertical: 16 },
    carouselHeader: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 12, paddingHorizontal: 16 },
    carouselItem: { width: 140, marginRight: 16 },
    carouselImage: { width: '100%', height: 140, borderRadius: 8, marginBottom: 8 },
    carouselTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    carouselArtist: { color: COLORS.textSecondary, fontSize: 12 },
});

export default SuggestionCarousel;