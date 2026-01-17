import { z } from 'zod';
import { insertFileSchema, files, mergeRequestSchema, splitRequestSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  files: {
    upload: {
      method: 'POST' as const,
      path: '/api/files/upload',
      // input is multipart/form-data, not validated by Zod here directly
      responses: {
        201: z.custom<typeof files.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/files/:id',
      responses: {
        200: z.custom<typeof files.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    download: {
      method: 'GET' as const,
      path: '/api/files/:id/download',
      responses: {
        200: z.any(), // File stream
        404: errorSchemas.notFound,
      },
    }
  },
  operations: {
    merge: {
      method: 'POST' as const,
      path: '/api/operations/merge',
      input: mergeRequestSchema,
      responses: {
        200: z.custom<typeof files.$inferSelect>(), // Returns the new merged file record
        400: errorSchemas.validation,
      },
    },
    split: {
      method: 'POST' as const,
      path: '/api/operations/split',
      input: splitRequestSchema,
      responses: {
        200: z.custom<typeof files.$inferSelect>(), // Returns the new split file record
        400: errorSchemas.validation,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
