import { FileText, Trash2, GripVertical, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import type { File as FileRecord } from '@shared/schema';

interface FileListProps {
  files: (FileRecord & { id: number })[];
  onRemove: (id: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  canReorder?: boolean;
}

export function FileList({ files, onRemove, onMoveUp, onMoveDown, canReorder }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3 w-full">
      <AnimatePresence mode="popLayout">
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
          >
            {canReorder && (
              <div className="flex flex-col gap-1 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary"
                  onClick={() => onMoveUp?.(index)}
                  disabled={index === 0}
                >
                  <span className="sr-only">Move Up</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 5L5 1L9 5"/></svg>
                </Button>
                <div className="flex justify-center">
                  <GripVertical className="h-4 w-4" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary"
                  onClick={() => onMoveDown?.(index)}
                  disabled={index === files.length - 1}
                >
                  <span className="sr-only">Move Down</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1L5 5L1 1"/></svg>
                </Button>
              </div>
            )}
            
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate pr-4 text-foreground/90">{file.originalName}</h4>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.createdAt!).toLocaleDateString()}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(file.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function ResultCard({ file, onDownload, title }: { file: FileRecord, onDownload: () => void, title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/50 border border-primary/20 p-8 text-center"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-6 ring-8 ring-green-500/5">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your file <span className="font-semibold text-foreground">{file.originalName}</span> has been processed successfully.
      </p>
      
      <Button 
        size="lg" 
        onClick={onDownload}
        className="h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
      >
        <Download className="mr-2 h-5 w-5" />
        Download PDF
      </Button>
    </motion.div>
  )
}
