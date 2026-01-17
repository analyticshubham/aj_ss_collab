import { files, type File, type InsertFile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createFile(file: InsertFile): Promise<File>;
  getFile(id: number): Promise<File | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createFile(insertFile: InsertFile): Promise<File> {
    if (!db) throw new Error("Database not connected");
    const [file] = await db.insert(files).values(insertFile).returning();
    return file;
  }

  async getFile(id: number): Promise<File | undefined> {
    if (!db) throw new Error("Database not connected");
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }
}

export const storage = new DatabaseStorage();
