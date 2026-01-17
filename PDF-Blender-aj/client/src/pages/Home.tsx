import { useState } from 'react';
import { useUploadFile, useMergeFiles, useSplitFile, getDownloadUrl } from '@/hooks/use-files';
import { FileUploader } from '@/components/FileUploader';
import { FileList, ResultCard } from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Merge, Scissors, ArrowRight, RefreshCw } from 'lucide-react';
import type { File as FileRecord } from '@shared/schema';
import { motion } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState("merge");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <header className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
              <Merge className="h-5 w-5 text-primary-foreground transform rotate-45" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">PDF<span className="text-primary">Master</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>v1.0.0</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent pb-1">
              Process your PDFs <br/> with precision
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Securely merge multiple files or extract specific pages instantly. 
              No installation required.
            </p>
          </div>

          <Tabs defaultValue="merge" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-2xl h-14">
                <TabsTrigger 
                  value="merge" 
                  className="rounded-xl text-base font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg"
                >
                  <Merge className="w-4 h-4 mr-2" />
                  Merge PDFs
                </TabsTrigger>
                <TabsTrigger 
                  value="split" 
                  className="rounded-xl text-base font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Split PDF
                </TabsTrigger>
              </TabsList>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TabsContent value="merge" className="mt-0">
                <MergeView />
              </TabsContent>
              <TabsContent value="split" className="mt-0">
                <SplitView />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function MergeView() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const { toast } = useToast();
  
  const upload = useUploadFile();
  const merge = useMergeFiles();
  
  const handleFilesSelected = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const result = await upload.mutateAsync(file);
        setFiles(prev => [...prev, result]);
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: `Could not upload ${file.name}.`,
          variant: "destructive"
        });
      }
    }
  };

  const handleRemove = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const handleMerge = async () => {
    try {
      const result = await merge.mutateAsync({
        fileIds: files.map(f => f.id)
      });
      // Show result view or toast
      setFiles([]); // Clear input
      
      // Store result temporarily to show download card
      setMergedResult(result);
    } catch (error) {
      toast({
        title: "Merge Failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const [mergedResult, setMergedResult] = useState<FileRecord | null>(null);

  const reset = () => {
    setMergedResult(null);
    setFiles([]);
  };

  if (mergedResult) {
    return (
      <div className="flex flex-col items-center">
        <ResultCard 
          title="Files Merged Successfully!"
          file={mergedResult} 
          onDownload={() => window.open(getDownloadUrl(mergedResult.id), '_blank')} 
        />
        <Button variant="ghost" className="mt-8" onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-sm ring-1 ring-border/50">
      <CardHeader>
        <CardTitle>Merge PDF Files</CardTitle>
        <CardDescription>Combine multiple PDF files into one single document.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <FileUploader 
          onFilesSelected={handleFilesSelected} 
          isUploading={upload.isPending}
          multiple={true}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {files.length > 0 ? `${files.length} Files Selected` : "No files selected"}
            </h3>
            {files.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-xs">
                Clear All
              </Button>
            )}
          </div>
          
          <FileList 
            files={files} 
            onRemove={handleRemove}
            onMoveUp={(i) => handleMove(i, 'up')}
            onMoveDown={(i) => handleMove(i, 'down')}
            canReorder
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button 
            size="lg" 
            onClick={handleMerge}
            disabled={files.length < 2 || merge.isPending}
            className="w-full sm:w-auto"
          >
            {merge.isPending ? (
              <>Processing...</>
            ) : (
              <>
                Merge Files <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SplitView() {
  const [file, setFile] = useState<FileRecord | null>(null);
  const [pageRange, setPageRange] = useState("");
  const { toast } = useToast();
  
  const upload = useUploadFile();
  const split = useSplitFile();
  
  const handleFileSelected = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        const result = await upload.mutateAsync(acceptedFiles[0]);
        setFile(result);
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Could not upload file.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    
    try {
      const result = await split.mutateAsync({
        fileId: file.id,
        pageRange
      });
      setFile(null);
      setPageRange("");
      setSplitResult(result);
    } catch (error) {
      toast({
        title: "Split Failed",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const [splitResult, setSplitResult] = useState<FileRecord | null>(null);

  const reset = () => {
    setSplitResult(null);
    setFile(null);
    setPageRange("");
  };

  if (splitResult) {
    return (
      <div className="flex flex-col items-center">
        <ResultCard 
          title="Pages Extracted Successfully!"
          file={splitResult} 
          onDownload={() => window.open(getDownloadUrl(splitResult.id), '_blank')} 
        />
        <Button variant="ghost" className="mt-8" onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-sm ring-1 ring-border/50">
      <CardHeader>
        <CardTitle>Split PDF File</CardTitle>
        <CardDescription>Extract pages from your PDF document by range.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {!file ? (
          <FileUploader 
            onFilesSelected={handleFileSelected} 
            isUploading={upload.isPending}
            multiple={false}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
               <FileList 
                files={[file]} 
                onRemove={() => setFile(null)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Page Range to Extract
              </label>
              <Input
                placeholder="e.g. 1-5, 8, 11-13"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="h-12 text-lg font-mono placeholder:font-sans"
              />
              <p className="text-sm text-muted-foreground">
                Enter page numbers and/or ranges separated by commas.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button 
            size="lg" 
            onClick={handleSplit}
            disabled={!file || !pageRange || split.isPending}
            className="w-full sm:w-auto"
          >
            {split.isPending ? (
              <>Processing...</>
            ) : (
              <>
                Extract Pages <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
