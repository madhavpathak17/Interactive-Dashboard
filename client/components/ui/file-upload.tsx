import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (file: File, data: any[]) => void;
  accept?: string;
  className?: string;
}

export function FileUpload({
  onFileUpload,
  accept = ".csv",
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().replace(/"/g, ""));
    const data = lines.slice(1).map((line) => {
      const values = line
        .split(",")
        .map((value) => value.trim().replace(/"/g, ""));
      return headers.reduce(
        (obj, header, index) => {
          obj[header] = values[index] || "";
          return obj;
        },
        {} as Record<string, string>,
      );
    });

    return data;
  };

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        setUploadedFile(file);
        onFileUpload(file, data);
      };
      reader.readAsText(file);
    },
    [onFileUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0].name.endsWith(".csv")) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        {uploadedFile ? (
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent/50">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed border-border rounded-lg p-4 sm:p-8 text-center transition-colors",
              isDragging && "border-primary bg-primary/5",
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">
              Upload CSV File
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 px-2">
              Drag and drop your student placement data CSV file here, or click
              to browse
            </p>
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
