// File: app/artists.tsx

import React, { useMemo } from 'react';
import { Box, Heading, FlatList, Text, Pressable } from '@gluestack-ui/themed';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { TRACKS } from '../constants/tracks';

// Định nghĩa một kiểu cho Ca sĩ để dễ quản lý
interface Artist {
    name: string;
    trackCount: number;
}

export default function ArtistsScreen() {
    const router = useRouter();

    // Lấy danh sách ca sĩ và đếm số bài hát
    const artists = useMemo<Artist[]>(() => {
        const artistMap = new Map<string, number>();
        TRACKS.forEach(track => {
            artistMap.set(track.artist, (artistMap.get(track.artist) || 0) + 1);
        });
        
        // Chuyển Map thành mảng object
        return Array.from(artistMap, ([name, trackCount]) => ({ name, trackCount }))
                    .sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên
    }, []);

    const handleArtistPress = (artistName: string) => {
        router.push(`/${encodeURIComponent(artistName)}`);
    };

    return (
        <Box flex={1} bg="$backgroundLight50">
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: 'Ca sĩ' }} />
                <Box padding="$4">
                    <Heading size="xl">Tất cả ca sĩ</Heading>
                </Box>

                <FlatList
                    data={artists}
                    keyExtractor={(item) => (item as Artist).name}
                    renderItem={({ item }) => {
                        // ÉP KIỂU TƯỜNG MINH Ở ĐÂY
                        const artist = item as Artist;
                        return (
                            <Pressable 
                                onPress={() => handleArtistPress(artist.name)}
                                p="$4" 
                                borderBottomWidth={1} 
                                borderBottomColor="$trueGray200"
                            >
                                <Text fontWeight="$medium">{artist.name}</Text>
                                <Text size="sm" color="$textLight500">{artist.trackCount} bài hát</Text>
                            </Pressable>
                        );
                    }}
                />
            </SafeAreaView>
        </Box>
    );
}

const styles = StyleSheet.create({ container: { flex: 1 } });