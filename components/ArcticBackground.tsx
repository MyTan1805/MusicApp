// File: components/ArcticBackground.tsx

import React from 'react';
import { Box } from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

const ArcticBackground = () => {
  return (
    <Box style={StyleSheet.absoluteFill} bg="#000000">
      {/* Đốm màu 1 (Góc trên bên trái - Xanh lá) */}
      <Box position="absolute" top={-200} left={-200} width={400} height={400}>
        <LinearGradient
          colors={['rgba(124, 255, 103, 0.3)', 'rgba(124, 255, 103, 0)']}
          style={styles.gradientCircle}
        />
      </Box>

      {/* Đốm màu 2 (Góc trên bên phải - Tím) */}
      <Box position="absolute" top={-150} right={-150} width={500} height={500}>
        <LinearGradient
          colors={['rgba(82, 39, 255, 0.4)', 'rgba(82, 39, 255, 0)']}
          style={styles.gradientCircle}
        />
      </Box>

      {/* Đốm màu 3 (Góc dưới bên phải - Nâu cam) */}
      <Box position="absolute" bottom={-100} right={-250} width={450} height={450}>
        <LinearGradient
          colors={['rgba(255, 148, 180, 0.3)', 'rgba(255, 148, 180, 0)']}
          style={styles.gradientCircle}
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  gradientCircle: {
    flex: 1,
    borderRadius: 999, // Để tạo hình tròn
  },
});

export default ArcticBackground;