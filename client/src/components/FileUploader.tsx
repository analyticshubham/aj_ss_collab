import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  multiple?: boolean;
  className?: string;
  accept?: Record<string, string[]>;
}

export function FileUploader({ 
  onFilesSelected, 
  isUploading, 
  multiple = true,
  className,
  accept = { 'application/pdf': ['.pdf'] }
}: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesSelected,
    accept,
    multiple,
    disabled: isUploading
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-border p-10 transition-all duration-300",
        "hover:border-primary/50 hover:bg-primary/5",
        isDragActive && "border-primary bg-primary/10 scale-[1.01]",
        isUploading && "pointer-events-none opacity-60",
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full bg-secondary transition-all group-hover:bg-primary/10 group-hover:scale-110",
          isDragActive && "bg-primary/20 scale-110"
        )}>
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          ) : (
            <Upload className="h-10 w-10 text-primary transition-colors" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {isUploading ? "Uploading..." : isDragActive ? "Drop files here" : "Drag & drop files"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {multiple ? "Or click to select multiple PDF files" : "Or click to select a PDF file"}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] flex items-center justify-center"
          >
            <div className="bg-background/80 backdrop-blur-md rounded-xl p-4 shadow-xl border border-primary/20">
              <p className="font-bold text-primary flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Drop to upload
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
