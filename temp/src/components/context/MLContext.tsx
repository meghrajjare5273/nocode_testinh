// Update the MLContext to include targetColumn in the preprocessing step
"use client";

import type React from "react";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { FileWithPreview, DatasetSummary, ModelResult } from "@/types";

interface MLContextType {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;


  summaries: Record<string, DatasetSummary>;
  setSummaries: React.Dispatch<
    React.SetStateAction<Record<string, DatasetSummary>>
  >;


  insights: Record<string, string[]>;
  setInsights: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;


  targetColumn: string;
  setTargetColumn: React.Dispatch<React.SetStateAction<string>>;



  taskType: string;
  setTaskType: React.Dispatch<React.SetStateAction<string>>;


  modelType: string;
  setModelType: React.Dispatch<React.SetStateAction<string>>;


  modelResults: Record<string, ModelResult>;
  setModelResults: React.Dispatch<
    React.SetStateAction<Record<string, ModelResult>>>;
  
  
  missingStrategy: string;
  setMissingStrategy: React.Dispatch<React.SetStateAction<string>>;



  scaling: boolean;
  setScaling: React.Dispatch<React.SetStateAction<boolean>>;


  encoding: string;
  setEncoding: React.Dispatch<React.SetStateAction<string>>;


  suggestedMissingStrategies: Record<string, string>;
  setSuggestedMissingStrategies: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;



  suggestedTaskTypes: Record<string, string>;
  setSuggestedTaskTypes: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;


  suggestedTargetColumns: Record<string, string | null>;
  setSuggestedTargetColumns: React.Dispatch<
    React.SetStateAction<Record<string, string | null>>
  >;


  activeStep: string;
  setActiveStep: React.Dispatch<React.SetStateAction<string>>;

  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;


  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  
  preprocessedFiles: Record<string, string>;
  setPreprocessedFiles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const MLContext = createContext<MLContextType | undefined>(undefined);

export function MLProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [summaries, setSummaries] = useState<Record<string, DatasetSummary>>(
    {}
  );
  const [insights, setInsights] = useState<Record<string, string[]>>({});
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [taskType, setTaskType] = useState<string>("");
  const [modelType, setModelType] = useState<string>("");
  const [modelResults, setModelResults] = useState<Record<string, ModelResult>>(
    {}
  );
  const [missingStrategy, setMissingStrategy] = useState<string>("mean");
  const [scaling, setScaling] = useState<boolean>(true);
  const [encoding, setEncoding] = useState<string>("onehot");
  const [suggestedMissingStrategies, setSuggestedMissingStrategies] = useState<
    Record<string, string>
  >({});
  const [suggestedTaskTypes, setSuggestedTaskTypes] = useState<
    Record<string, string>
  >({});
  const [suggestedTargetColumns, setSuggestedTargetColumns] = useState<
    Record<string, string | null>
  >({});
  const [activeStep, setActiveStep] = useState<string>("upload");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [preprocessedFiles, setPreprocessedFiles] = useState<
    Record<string, string>
  >({});

  return (
    <MLContext.Provider
      value={{
        files,
        setFiles,
        summaries,
        setSummaries,
        insights,
        setInsights,
        targetColumn,
        preprocessedFiles,
        setPreprocessedFiles,
        setTargetColumn,
        taskType,
        setTaskType,
        modelType,
        setModelType,
        modelResults,
        setModelResults,
        missingStrategy,
        setMissingStrategy,
        scaling,
        setScaling,
        encoding,
        setEncoding,
        suggestedMissingStrategies,
        setSuggestedMissingStrategies,
        suggestedTaskTypes,
        setSuggestedTaskTypes,
        suggestedTargetColumns,
        setSuggestedTargetColumns,
        activeStep,
        setActiveStep,
        error,
        setError,
        isLoading,
        setIsLoading,
        progress,
        setProgress,
      }}
    >
      {children}
    </MLContext.Provider>
  );
}

export function useML() {
  const context = useContext(MLContext);
  if (context === undefined) {
    throw new Error("useML must be used within a MLProvider");
  }
  return context;
}
