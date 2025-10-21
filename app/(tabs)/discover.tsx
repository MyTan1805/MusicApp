// File: app/(tabs)/discover.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { ClockIcon, SearchIcon, XIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MiniPlayer from '../../components/MiniPlayer';
import SongItem from '../../components/SongItem';
import { TRACKS, Track } from '../../constants/tracks';
import { usePlayer } from '../../contexts/PlayerContext';
import { COLORS } from '../../styles/colors';

const genres = ['Pop', 'Rock', 'Acoustic', 'EDM', 'Rap', 'Chill', 'Indie'];
const recentSearches = ['Sơn Tùng M-TP', 'Hoàng Thùy Linh', 'Nhạc Việt Remix'];

export default function DiscoverScreen() {
  const router = useRouter();
  const { currentTrack, playTrack } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenrePress = (genre: string) => {
    const path = `/${encodeURIComponent(genre)}`;
    router.push(path as Href);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return TRACKS.filter(track =>
      track.title.toLowerCase().includes(lowercasedQuery) ||
      track.artist.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  const renderDiscoveryView = () => (
    <ScrollView>
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>Thể loại phổ biến</Text>
        <View style={styles.genreGrid}>
          {genres.map((genre) => (
            <Pressable key={genre} style={styles.genreCard} onPress={() => handleGenrePress(genre)}>
              <Text style={styles.genreText}>{genre}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>Tìm kiếm gần đây</Text>
        <View>
          {recentSearches.map((term, index) => (
            <View key={index} style={styles.recentSearchItem}>
              <View style={styles.recentSearchLeft}>
                <ClockIcon color={COLORS.textMuted} size={18} />
                <Text style={styles.recentSearchText}>{term}</Text>
              </View>
              <Pressable onPress={() => console.log('Remove', term)}>
                <XIcon color={COLORS.textMuted} size={18} />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderResultsView = () => (
    <FlatList
      data={searchResults}
      keyExtractor={(item) => (item as Track).id}
      renderItem={({ item }) => {
        const track = item as Track;
        return <SongItem track={track} onPress={() => playTrack(track, searchResults)} />;
      }}
      ListHeaderComponent={<Text style={[styles.heading, { paddingHorizontal: 16 }]}>Kết quả</Text>}
      contentContainerStyle={{ paddingBottom: currentTrack ? 160 : 80 }}
    />
  );

  return (
    <LinearGradient colors={['#434343', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Tìm kiếm</Text>
          <View style={styles.inputContainer}>
            <SearchIcon size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              placeholder="Bạn muốn nghe gì?"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.inputField}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {searchQuery.trim() === '' ? renderDiscoveryView() : renderResultsView()}
        </View>
        {currentTrack && <MiniPlayer />}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { padding: 16, },
  screenTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.white, marginBottom: 16, },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.backgroundSecondary, borderRadius: 999, paddingHorizontal: 16, },
  searchIcon: { marginRight: 8, },
  inputField: { flex: 1, height: 48, color: COLORS.white, fontSize: 16, },
  sectionContainer: { padding: 16, },
  heading: { color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginBottom: 12, },
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
  genreCard: { width: '48%', marginBottom: 12, backgroundColor: '#374151', padding: 16, borderRadius: 8, height: 80, justifyContent: 'center', },
  genreText: { color: COLORS.white, fontWeight: 'bold', },
  recentSearchItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#2d3748', borderRadius: 8, marginBottom: 8, },
  recentSearchLeft: { flexDirection: 'row', alignItems: 'center', },
  recentSearchText: { color: COLORS.white, marginLeft: 12, },
});