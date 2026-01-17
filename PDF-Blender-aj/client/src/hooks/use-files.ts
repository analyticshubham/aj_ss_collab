import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type MergeRequest, type SplitRequest } from "@shared/routes";

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(api.files.upload.path, {
        method: api.files.upload.method,
        body: formData,
        // No Content-Type header needed, browser sets it for FormData
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.files.upload.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Upload failed');
      }

      return api.files.upload.responses[201].parse(await res.json());
    },
  });
}

export function useMergeFiles() {
  return useMutation({
    mutationFn: async (data: MergeRequest) => {
      const validated = api.operations.merge.input.parse(data);
      const res = await fetch(api.operations.merge.path, {
        method: api.operations.merge.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.operations.merge.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Merge failed');
      }

      return api.operations.merge.responses[200].parse(await res.json());
    },
  });
}

export function useSplitFile() {
  return useMutation({
    mutationFn: async (data: SplitRequest) => {
      const validated = api.operations.split.input.parse(data);
      const res = await fetch(api.operations.split.path, {
        method: api.operations.split.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.operations.split.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Split failed');
      }

      return api.operations.split.responses[200].parse(await res.json());
    },
  });
}

export function getDownloadUrl(id: number) {
  return buildUrl(api.files.download.path, { id });
}
