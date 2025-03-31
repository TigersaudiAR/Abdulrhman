import { 
  users, type User, type InsertUser,
  userSettings, type UserSettings, type InsertUserSettings,
  bookmarks, type Bookmark, type InsertBookmark,
  lastRead, type LastRead, type InsertLastRead
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// يتم تعديل الواجهة مع أي طرق CRUD قد تحتاجها
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User settings operations
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined>;
  
  // Bookmark operations
  getBookmarks(userId: number): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: number, userId: number): Promise<boolean>;
  
  // Last read operations
  getLastRead(userId: number): Promise<LastRead | undefined>;
  updateLastRead(lastReadData: InsertLastRead): Promise<LastRead>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userSettings: Map<number, UserSettings>;
  private bookmarks: Map<number, Bookmark>;
  private lastReads: Map<number, LastRead>;
  currentId: number;
  currentSettingsId: number;
  currentBookmarkId: number;
  currentLastReadId: number;

  constructor() {
    this.users = new Map();
    this.userSettings = new Map();
    this.bookmarks = new Map();
    this.lastReads = new Map();
    this.currentId = 1;
    this.currentSettingsId = 1;
    this.currentBookmarkId = 1;
    this.currentLastReadId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id, createdAt: new Date() } as User;
    this.users.set(id, user);
    return user;
  }

  // User settings operations
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      (settings) => settings.userId === userId,
    );
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const id = this.currentSettingsId++;
    const userSettings = { 
      ...settings, 
      id, 
      updatedAt: new Date(),
      // إضافة القيم الافتراضية للحقول التي قد تكون غير محددة
      reciter: settings.reciter || "ar.alafasy",
      translation: settings.translation || "ar.asad",
      fontSize: settings.fontSize || 3,
      showTranslation: settings.showTranslation !== undefined ? settings.showTranslation : true,
      autoPlayAudio: settings.autoPlayAudio !== undefined ? settings.autoPlayAudio : false,
      prayerMethod: settings.prayerMethod || 2,
      showNextPrayer: settings.showNextPrayer !== undefined ? settings.showNextPrayer : true,
      highlightCurrentVerse: settings.highlightCurrentVerse !== undefined ? settings.highlightCurrentVerse : true,
      autoSaveLastRead: settings.autoSaveLastRead !== undefined ? settings.autoSaveLastRead : true
    } as UserSettings;
    this.userSettings.set(id, userSettings);
    return userSettings;
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const existingSettings = await this.getUserSettings(userId);
    if (!existingSettings) return undefined;
    
    const updatedSettings: UserSettings = { 
      ...existingSettings, 
      ...settings, 
      updatedAt: new Date()
    };
    this.userSettings.set(existingSettings.id, updatedSettings);
    return updatedSettings;
  }

  // Bookmark operations
  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId,
    );
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const newBookmark = { 
      ...bookmark, 
      id, 
      timestamp: new Date(),
      note: bookmark.note || null
    } as Bookmark;
    this.bookmarks.set(id, newBookmark);
    return newBookmark;
  }

  async deleteBookmark(id: number, userId: number): Promise<boolean> {
    const bookmark = this.bookmarks.get(id);
    if (!bookmark || bookmark.userId !== userId) return false;
    return this.bookmarks.delete(id);
  }

  // Last read operations
  async getLastRead(userId: number): Promise<LastRead | undefined> {
    return Array.from(this.lastReads.values()).find(
      (lastRead) => lastRead.userId === userId,
    );
  }

  async updateLastRead(lastReadData: InsertLastRead): Promise<LastRead> {
    const existingLastRead = await this.getLastRead(lastReadData.userId);
    
    if (existingLastRead) {
      const updatedLastRead: LastRead = { 
        ...existingLastRead, 
        ...lastReadData, 
        timestamp: new Date()
      };
      this.lastReads.set(existingLastRead.id, updatedLastRead);
      return updatedLastRead;
    } else {
      const id = this.currentLastReadId++;
      const newLastRead: LastRead = { 
        ...lastReadData, 
        id, 
        timestamp: new Date()
      };
      this.lastReads.set(id, newLastRead);
      return newLastRead;
    }
  }
}

// فئة DbStorage الجديدة التي تستخدم PostgreSQL
export class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private static instance: DbStorage;
  private static clientInstance: ReturnType<typeof postgres>;

  constructor() {
    // تحسين أداء اتصال قاعدة البيانات باستخدام نمط Singleton
    if (!DbStorage.clientInstance) {
      // إنشاء اتصال بقاعدة البيانات باستخدام متغير البيئة DATABASE_URL
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
      }
      try {
        DbStorage.clientInstance = postgres(connectionString, { 
          connect_timeout: 10, // تقليل وقت الاتصال إلى 10 ثوانٍ
          idle_timeout: 20, // تقليل وقت الخمول
          max: 10, // تقييد عدد الاتصالات المتزامنة
        });
      } catch (error) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', error);
        throw error;
      }
    }
    this.db = drizzle(DbStorage.clientInstance);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // User settings operations
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const result = await this.db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const result = await this.db.insert(userSettings).values(settings).returning();
    return result[0];
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const existingSettings = await this.getUserSettings(userId);
    if (!existingSettings) return undefined;
    
    const result = await this.db.update(userSettings)
      .set({...settings, updatedAt: new Date()})
      .where(eq(userSettings.userId, userId))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }

  // Bookmark operations
  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return await this.db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const result = await this.db.insert(bookmarks).values(bookmark).returning();
    return result[0];
  }

  async deleteBookmark(id: number, userId: number): Promise<boolean> {
    const result = await this.db.delete(bookmarks)
      .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)))
      .returning();
    
    return result.length > 0;
  }

  // Last read operations
  async getLastRead(userId: number): Promise<LastRead | undefined> {
    const result = await this.db.select().from(lastRead).where(eq(lastRead.userId, userId));
    return result.length > 0 ? result[0] : undefined;
  }

  async updateLastRead(lastReadData: InsertLastRead): Promise<LastRead> {
    const existingLastRead = await this.getLastRead(lastReadData.userId);
    
    if (existingLastRead) {
      const result = await this.db.update(lastRead)
        .set({
          ...lastReadData,
          timestamp: new Date()
        })
        .where(eq(lastRead.userId, lastReadData.userId))
        .returning();
      
      return result[0];
    } else {
      const result = await this.db.insert(lastRead).values(lastReadData).returning();
      return result[0];
    }
  }
}

// استخدام DbStorage للتخزين الدائم في قاعدة البيانات PostgreSQL
export const storage: IStorage = new DbStorage();
