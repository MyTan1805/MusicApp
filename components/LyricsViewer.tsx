// File: components/LyricsViewer.tsx

import { Box, Text } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useRef } from 'react';
import { FlatList } from 'react-native';
import { LyricLine } from '../constants/tracks';

interface LyricsViewerProps {
  lyrics: LyricLine[];
  position: number; // position hiện tại (tính bằng ms)
  trackId: string;    // ID của bài hát hiện tại
}

const LyricsViewer: React.FC<LyricsViewerProps> = ({ lyrics, position, trackId }) => {
  const flatListRef = useRef<FlatList>(null);
  
  const positionInSeconds = position / 1000;

  const currentLineIndex = useMemo(() => {
    if (!lyrics || lyrics.length === 0) return -1;

    let index = lyrics.findIndex(line => line.time > positionInSeconds);
    if (index === -1) {
      return lyrics.length - 1;
    }
    return Math.max(0, index - 1);
  }, [lyrics, positionInSeconds]);


  // useEffect #1: Tự động cuộn về đầu khi bài hát thay đổi
  useEffect(() => {
    if (flatListRef.current) {
        // Cuộn về đầu danh sách một cách vô hình
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, [trackId]); // Chạy mỗi khi `trackId` thay đổi


  // useEffect #2: Cuộn theo lời bài hát đang phát
  useEffect(() => {
    if (
        flatListRef.current && 
        currentLineIndex >= 0 && 
        currentLineIndex < lyrics.length
    ) {
      flatListRef.current.scrollToIndex({
        index: currentLineIndex,
        animated: true,
        viewPosition: 0.5, // Cuộn đến giữa màn hình
      });
    }
  }, [currentLineIndex]); // Chỉ phụ thuộc vào `currentLineIndex`

  const handleScrollToIndexFailed = (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
  }) => {
      if (!flatListRef.current || info.index >= lyrics.length || info.index < 0) {
          return;
      }

      flatListRef.current.scrollToOffset({
          offset: info.averageItemLength * info.index,
          animated: true,
      });
      setTimeout(() => {
          if (flatListRef.current && info.index < lyrics.length) {
              flatListRef.current.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
          }
      }, 100);
  };

  const renderItem = ({ item, index }: { item: LyricLine, index: number }) => {
    const isActive = index === currentLineIndex;
    return (
      <Text
        py="$2"
        textAlign="center"
        fontSize={isActive ? '$xl' : '$lg'}
        fontWeight={isActive ? '$bold' : '$normal'}
        color={isActive ? 'white' : '$trueGray400'}
      >
        {item.text}
      </Text>
    );
  };
  
  return (
    <Box h={200} justifyContent="center">
      <FlatList
        ref={flatListRef}
        data={lyrics}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.time}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: '25%', paddingBottom: '25%' }}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </Box>
  );
};

export default LyricsViewer;