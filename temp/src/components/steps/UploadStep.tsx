/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useRef, useState } from "react";
import { useML } from "@/context/MLContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadIcon, File } from "lucide-react";
import { uploadFiles } from "@/services/api";
import { ViewDatasetInfo } from "@/components/ViewDatasetInfo";
import { motion } from "motion/react";

export function UploadStep() {
  const {
    files,
    setFiles,
    setSummaries,
    setInsights,
    setSuggestedMissingStrategies,
    setSuggestedTaskTypes,
    setSuggestedTargetColumns,
    setActiveStep,
    setError,
    isLoading,
    setIsLoading,
    setProgress,
  } = useML();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length) {
      setFiles(selectedFiles);
      await handleUploadFiles(selectedFiles);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) {
      setFiles(droppedFiles);
      await handleUploadFiles(droppedFiles);
    }
  };

  const handleUploadFiles = async (filesToUpload: File[]) => {
    setIsLoading(true);
    setProgress(10);
    try {
      const data = await uploadFiles(filesToUpload, setProgress);
      setSummaries(data);
      setInsights(
        Object.fromEntries(
          Object.entries(data).map(([k, v]: [string, any]) => [k, v.insights])
        )
      );
      setSuggestedMissingStrategies(
        Object.fromEntries(
          Object.entries(data).map(([k, v]: [string, any]) => [
            k,
            v.suggested_missing_strategy,
          ])
        )
      );
      setSuggestedTaskTypes(
        Object.fromEntries(
          Object.entries(data).map(([k, v]: [string, any]) => [
            k,
            v.suggested_task_type,
          ])
        )
      );
      setSuggestedTargetColumns(
        Object.fromEntries(
          Object.entries(data).map(([k, v]: [string, any]) => [
            k,
            v.suggested_target_column,
          ])
        )
      );
      setActiveStep("preprocess");
    } catch (error: any) {
      console.error("Error uploading files:", error.message);
      setError(
        "Failed to upload files. Ensure the backend is running on http://127.0.0.1:8000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <>
      <ViewDatasetInfo />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-white/10 bg-secondary-50 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-secondary-100 to-secondary-50 border-b border-white/10">
            <CardTitle className="text-2xl text-white">
              Upload Datasets
            </CardTitle>
            <CardDescription className="text-white/70">
              Upload your CSV files to begin the ML training process
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : isLoading
                  ? "opacity-50 pointer-events-none"
                  : "border-white/20 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <UploadIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  Drag & Drop Files
                </h3>
                <p className="text-sm text-white/70 max-w-xs">
                  Drag and drop your CSV files here, or click to browse your
                  files
                </p>
                <input
                  type="file"
                  accept=".csv"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="bg-primary hover:bg-secondary/90 hover:text-white text-black "
                >
                  Select Files
                </Button>
              </div>
            </div>

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <h4 className="font-medium mb-3 text-white">Selected Files:</h4>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-secondary-100 rounded-md border border-white/10 shadow-sm"
                    >
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <File className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-white">
                          {file.name}
                        </div>
                        <div className="text-xs text-white/50">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
