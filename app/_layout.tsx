// File: app/_layout.tsx

import { Box, GluestackUIProvider, Text } from "@gluestack-ui/themed";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import React, { Suspense } from 'react';
import { TRACKS } from "../constants/tracks";
import { PlayerProvider } from "../contexts/PlayerContext";
import { config } from "../gluestack-ui.config";

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  
  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE tracks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        duration INTEGER,
        lyrics TEXT,
        genre TEXT
      );
    `);
    
    console.log("Seeding initial tracks...");
    const statement = await db.prepareAsync(
      'INSERT INTO tracks (id, title, artist, duration, genre, lyrics) VALUES (?, ?, ?, ?, ?, ?)'
    );
    try {
      // Bây giờ, 'TRACKS' đã được nhận diện
      for (const track of TRACKS) { 
        await statement.executeAsync(
          track.id,
          track.title,
          track.artist,
          track.duration,
          track.genre ?? null,
          track.lyrics ? JSON.stringify(track.lyrics) : null
        );
      }
      console.log("Seeding complete!");
    } finally {
      await statement.finalizeAsync();
    }
  }
  
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

// Component nội dung chính, chỉ render khi DB đã sẵn sàng
function AppContent() {
  return (
    <PlayerProvider>
      <Box flex={1}>
        <LinearGradient
          colors={['#434343', '#000000']}
          locations={[0, 0.2]}
          style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Box>
    </PlayerProvider>
  );
}

export default function RootLayout() {
  return (
    // 1. GluestackProvider bao bọc tất cả
    <GluestackUIProvider config={config}>
      {/* 2. Suspense để xử lý loading */}
      <Suspense fallback={
        <Box flex={1} justifyContent="center" alignItems="center" bg="black">
          <Text color="white">Đang tải dữ liệu...</Text>
        </Box>
      }>
        {/* 3. SQLiteProvider để khởi tạo DB */}
        <SQLiteProvider databaseName="music.db" onInit={migrateDbIfNeeded} useSuspense>
          {/* 4. Nội dung ứng dụng chính */}
          <AppContent />
        </SQLiteProvider>
      </Suspense>
    </GluestackUIProvider>
  );
}