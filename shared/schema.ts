import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// جدول المستخدمين
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// جدول إعدادات المستخدم
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reciter: text("reciter").default("ar.alafasy"),
  translation: text("translation").default("ar.asad"),
  fontSize: integer("font_size").default(3),
  showTranslation: boolean("show_translation").default(true),
  autoPlayAudio: boolean("auto_play_audio").default(false),
  prayerMethod: integer("prayer_method").default(2),
  showNextPrayer: boolean("show_next_prayer").default(true),
  highlightCurrentVerse: boolean("highlight_current_verse").default(true),
  autoSaveLastRead: boolean("auto_save_last_read").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  userId: true,
  reciter: true,
  translation: true,
  fontSize: true,
  showTranslation: true,
  autoPlayAudio: true,
  prayerMethod: true,
  showNextPrayer: true,
  highlightCurrentVerse: true,
  autoSaveLastRead: true,
});

// جدول الإشارات المرجعية
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  pageNumber: integer("page_number").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  note: text("note"),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).pick({
  userId: true,
  surahNumber: true,
  ayahNumber: true,
  pageNumber: true,
  note: true,
});

// جدول آخر قراءة
export const lastRead = pgTable("last_read", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  pageNumber: integer("page_number").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertLastReadSchema = createInsertSchema(lastRead).pick({
  userId: true,
  surahNumber: true,
  ayahNumber: true,
  pageNumber: true,
});

// أنواع للاستخدام
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

export type InsertLastRead = z.infer<typeof insertLastReadSchema>;
export type LastRead = typeof lastRead.$inferSelect;
