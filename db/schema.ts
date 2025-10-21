import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tracksTable = sqliteTable('tracks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  duration: integer('duration'),
  lyrics: text('lyrics'),
  genre: text('genre'),
});