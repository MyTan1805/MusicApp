// File: components/LyricsViewer.tsx

import React, { useEffect, useMemo, useRef } from 'react';
import { Box, Text } from '@gluestack-ui/themed';
import { FlatList } from 'react-native';
import { LyricLine } from '../constants/tracks';

interface LyricsViewerProps {
  lyrics: LyricLine[];
  position: number; // position hiện tại (tính bằng ms)
}

const LyricsViewer: React.FC<LyricsViewerProps> = ({ lyrics, position }) => {
  const flatListRef = useRef<FlatList>(null);
  
  const positionInSeconds = position / 1000;

  const currentLineIndex = useMemo(() => {
    let index = lyrics.findIndex(line => line.time > positionInSeconds);
    if (index === -1) {
      return lyrics.length - 1;
    }
    return Math.max(0, index - 1);
  }, [lyrics, positionInSeconds]);

  useEffect(() => {
    if (flatListRef.current && currentLineIndex >= 0 && lyrics.length > 0) {
      flatListRef.current.scrollToIndex({
        index: currentLineIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [currentLineIndex, lyrics]);

  // HÀM MỚI ĐỂ XỬ LÝ LỖI
  const handleScrollToIndexFailed = (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
  }) => {
      flatListRef.current?.scrollToOffset({
          offset: info.averageItemLength * info.index,
          animated: true,
      });
      setTimeout(() => {
          if (lyrics.length > 0 && currentLineIndex !== -1 && flatListRef.current) {
              flatListRef.current.scrollToIndex({ index: currentLineIndex, animated: true, viewPosition: 0.5 });
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
        // Đổi màu để phù hợp với nền tối
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
        // THÊM PROP onScrollToIndexFailed VÀO ĐÂY
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </Box>
  );
};

export default LyricsViewer;