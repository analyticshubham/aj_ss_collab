import type { Express, Request } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { PDFDocument } from "pdf-lib";
import { randomBytes } from "crypto";
import { existsSync, mkdirSync } from "fs";

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer
const upload = multer({
  dest: UPLOADS_DIR,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // POST /api/files/upload
  app.post(api.files.upload.path, upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const file = await storage.createFile({
        originalName: req.file.originalname,
        fileName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });
      
      res.status(201).json(file);
    } catch (err) {
      // Clean up uploaded file if DB insert fails
      await fs.unlink(req.file.path).catch(() => {});
      res.status(500).json({ message: "Failed to save file metadata" });
    }
  });

  // GET /api/files/:id
  app.get(api.files.get.path, async (req, res) => {
    const file = await storage.getFile(Number(req.params.id));
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json(file);
  });

  // GET /api/files/:id/download
  app.get(api.files.download.path, async (req, res) => {
    const file = await storage.getFile(Number(req.params.id));
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(UPLOADS_DIR, file.fileName);
    
    // Check if file exists on disk
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ message: "File not found on disk" });
    }

    res.download(filePath, file.originalName);
  });

  // POST /api/operations/merge
  app.post(api.operations.merge.path, async (req, res) => {
    try {
      const { fileIds } = api.operations.merge.input.parse(req.body);
      
      if (fileIds.length < 2) {
        return res.status(400).json({ message: "At least 2 files are required for merging" });
      }

      // Create new document
      const mergedPdf = await PDFDocument.create();

      // Process each file
      for (const id of fileIds) {
        const fileRecord = await storage.getFile(id);
        if (!fileRecord) {
          return res.status(404).json({ message: `File with ID ${id} not found` });
        }

        const filePath = path.join(UPLOADS_DIR, fileRecord.fileName);
        const fileBuffer = await fs.readFile(filePath);
        
        try {
          const pdf = await PDFDocument.load(fileBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (e) {
          return res.status(400).json({ message: `Failed to process PDF ${fileRecord.originalName}` });
        }
      }

      // Save merged file
      const pdfBytes = await mergedPdf.save();
      const fileName = randomBytes(16).toString("hex");
      const filePath = path.join(UPLOADS_DIR, fileName);
      
      await fs.writeFile(filePath, pdfBytes);

      const savedFile = await storage.createFile({
        originalName: "merged_document.pdf",
        fileName: fileName,
        mimeType: "application/pdf",
        size: pdfBytes.length,
      });

      res.status(200).json(savedFile);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error during merge" });
    }
  });

  // POST /api/operations/split
  app.post(api.operations.split.path, async (req, res) => {
    try {
      const { fileId, pageRange } = api.operations.split.input.parse(req.body);
      
      const fileRecord = await storage.getFile(fileId);
      if (!fileRecord) {
        return res.status(404).json({ message: "File not found" });
      }

      const filePath = path.join(UPLOADS_DIR, fileRecord.fileName);
      const fileBuffer = await fs.readFile(filePath);
      
      const sourcePdf = await PDFDocument.load(fileBuffer);
      const newPdf = await PDFDocument.create();
      const totalPages = sourcePdf.getPageCount();

      // Parse page range (e.g., "1-3, 5, 7-9")
      // Users input 1-based indices, we need 0-based
      const indicesToCopy = new Set<number>();
      
      const parts = pageRange.split(",").map(p => p.trim());
      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          if (isNaN(start) || isNaN(end)) continue;
          
          // Clamp and convert to 0-based
          const s = Math.max(1, Math.min(start, totalPages));
          const e = Math.max(1, Math.min(end, totalPages));
          
          for (let i = Math.min(s, e); i <= Math.max(s, e); i++) {
            indicesToCopy.add(i - 1);
          }
        } else {
          const pageNum = Number(part);
          if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            indicesToCopy.add(pageNum - 1);
          }
        }
      }

      const sortedIndices = Array.from(indicesToCopy).sort((a, b) => a - b);
      
      if (sortedIndices.length === 0) {
        return res.status(400).json({ message: "Invalid page range or no pages selected" });
      }

      const copiedPages = await newPdf.copyPages(sourcePdf, sortedIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      // Save split file
      const pdfBytes = await newPdf.save();
      const fileName = randomBytes(16).toString("hex");
      const outFilePath = path.join(UPLOADS_DIR, fileName);
      
      await fs.writeFile(outFilePath, pdfBytes);

      const savedFile = await storage.createFile({
        originalName: `split_${fileRecord.originalName}`,
        fileName: fileName,
        mimeType: "application/pdf",
        size: pdfBytes.length,
      });

      res.status(200).json(savedFile);

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error during split" });
    }
  });

  return httpServer;
}
