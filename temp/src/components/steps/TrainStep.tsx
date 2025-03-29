/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useML } from "@/context/MLContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileDown,
  Brain,
  Target,
  List,
  Info,
  AlertTriangle,
} from "lucide-react";
import { getDownloadModelUrl, trainModelWithPreprocessed } from "@/services/api";
import { getAvailableModels } from "@/utils/model-utils";
import { motion } from "motion/react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TrainStep() {
  const {
    files,
    summaries,
    targetColumn,
    setTargetColumn,
    taskType,
    setTaskType,
    modelType,
    setModelType,
    modelResults,
    setModelResults,
    suggestedTaskTypes,
    suggestedTargetColumns,
    setActiveStep,
    setError,
    isLoading,
    setIsLoading,
    setProgress,
    preprocessedFiles,
  } = useML();

  // Set default model type when task type changes
  useEffect(() => {
    if (taskType) {
      const availableModels = getAvailableModels(taskType);
      if (availableModels.length > 0) {
        setModelType(availableModels[0].key);
      } else {
        setModelType("");
      }
    }
  }, [taskType, setModelType]);

  useEffect(() => {
    if (Object.keys(suggestedTaskTypes).length)
      setTaskType(Object.values(suggestedTaskTypes)[0] as string);
    if (Object.keys(suggestedTargetColumns).length)
      setTargetColumn(
        (Object.values(suggestedTargetColumns)[0] as string) || ""
      );
  }, [
    suggestedTaskTypes,
    suggestedTargetColumns,
    setTaskType,
    setTargetColumn,
  ]);

  const handleTrain = async () => {
    if (!Object.keys(preprocessedFiles).length)
      return setError("Please preprocess data first.");
    setIsLoading(true);
    setProgress(10);

    try {
      const preprocessedFilenames = Object.values(preprocessedFiles);
      const data = await trainModelWithPreprocessed(
        preprocessedFilenames,
        targetColumn,
        taskType,
        modelType,
        setProgress
      );
      setModelResults(data);
      setActiveStep("visualize");
    } catch (error: any) {
      console.error("Error training models:", error.message);
      setError(
        `Training failed: ${
          error.response?.data?.error || error.message
        }. Ensure backend is running.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadModel = (filename: string) => {
    window.location.href = getDownloadModelUrl(filename);
  };

  if (Object.keys(summaries).length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-white/10 bg-secondary-50 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-secondary-100 to-secondary-50 border-b border-white/10">
          <CardTitle className="text-2xl text-white">Train Models</CardTitle>
          <CardDescription className="text-white/70">
            Configure and train machine learning models on your data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <Alert className="bg-primary/10 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-white">
              We&apos;ve pre-selected models based on your data. Select the task
              type and model to continue.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary-100 p-5 rounded-lg border border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-white">ML Task Type</h3>
              </div>

              {suggestedTaskTypes &&
                Object.values(suggestedTaskTypes).length > 0 && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      Suggested: {Object.values(suggestedTaskTypes).join(", ")}
                    </span>
                  </div>
                )}

              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full p-3 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                disabled={isLoading}
              >
                <option className="bg-primary text-black" value="">
                  Select Task Type
                </option>
                <option
                  className="bg-primary text-black"
                  value="classification"
                >
                  Classification
                </option>
                <option className="bg-primary text-black" value="regression">
                  Regression
                </option>
                <option className="bg-primary text-black" value="clustering">
                  Clustering
                </option>
              </select>
              <p className="mt-2 text-xs text-white/50">
                {taskType === "classification" &&
                  "Predict a category or class from input features"}
                {taskType === "regression" &&
                  "Predict a continuous numerical value from input features"}
                {taskType === "clustering" &&
                  "Group similar data points together based on features"}
                {!taskType &&
                  "Choose the type of machine learning task to perform"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-100 p-5 rounded-lg border border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-white">Target Column</h3>
              </div>

              {suggestedTargetColumns &&
                Object.values(suggestedTargetColumns).filter((v) => v).length >
                  0 && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      Suggested:{" "}
                      {Object.values(suggestedTargetColumns)
                        .filter((v) => v)
                        .join(", ") || "None"}
                    </span>
                  </div>
                )}

              <select
                value={targetColumn}
                onChange={(e) => setTargetColumn(e.target.value)}
                className="w-full p-3 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                disabled={isLoading}
              >
                <option className="bg-primary text-black" value="">
                  None (Unsupervised)
                </option>
                {Object.values(summaries)
                  .flatMap((s: any) => s.summary.columns)
                  .filter((v: any, i: any, a: any) => a.indexOf(v) === i)
                  .map((col: string) => (
                    <option
                      className="bg-primary text-black"
                      key={col}
                      value={col}
                    >
                      {col}
                    </option>
                  ))}
              </select>
              <p className="mt-2 text-xs text-white/50">
                {targetColumn
                  ? "The column your model will learn to predict"
                  : "Select 'None' for unsupervised learning like clustering"}
              </p>
            </motion.div>
          </div>

          {taskType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-secondary-100 p-5 rounded-lg border border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <List className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-white">Model Type</h3>
              </div>

              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full p-3 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                disabled={isLoading}
              >
                {getAvailableModels(taskType).map((model) => (
                  <option
                    className="bg-primary text-black"
                    key={model.key}
                    value={model.key}
                  >
                    {model.display}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-white/50">
                Different model types have different strengths and weaknesses
              </p>
            </motion.div>
          )}

          {!taskType && (
            <Alert className="bg-secondary-200 border-yellow-600/30">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-white/70">
                Please select a task type to continue
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="px-6 py-4 bg-secondary-200 border-t border-white/10 flex flex-col gap-4">
          <Button
            onClick={handleTrain}
            className="w-full bg-primary hover:bg-secondary/90 hover:text-white text-black border-2 font-semibold h-12 text-base"
            disabled={isLoading || !taskType}
          >
            {isLoading ? "Training..." : "Start Training"}
          </Button>

          {Object.keys(modelResults).length > 0 &&
            files.map((file) => (
              <Button
                key={file.name}
                variant="outline"
                onClick={() => handleDownloadModel(file.name)}
                className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground font-medium"
                disabled={isLoading}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Download Model {file.name}
              </Button>
            ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
