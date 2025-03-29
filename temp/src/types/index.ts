import type React from "react";
export interface FileWithPreview extends File {
  preview?: string;
}

export interface DataSummary {
  columns: string[];
  rows: number;
  data_types: Record<string, string>;
  missing_values: Record<string, number>;
}

export interface DatasetSummary {
  summary: DataSummary;
  insights: string[];
  suggested_task_type: string;
  suggested_target_column: string | null;
  suggested_missing_strategy: string;
}

export interface ModelResult {
  task_type: string;
  model_type: string;
  results: Record<string, number>;
  feature_importance?: [string, number][];
  error?: string;
}

export interface ModelOption {
  display: string;
  key: string;
}

export interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
}
