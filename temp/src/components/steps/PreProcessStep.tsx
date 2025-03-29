/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
import { SlidersHorizontal, Tag, FileDown, BarChart2 } from "lucide-react";
import { preprocessData, getDownloadPreprocessedUrl } from "@/services/api";
import { motion } from "motion/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function PreProcessStep() {
  const {
    files,
    summaries,
    missingStrategy,
    setMissingStrategy,
    scaling,
    setScaling,
    encoding,
    setEncoding,
    targetColumn,
    setTargetColumn,
    suggestedMissingStrategies,
    setActiveStep,
    setError,
    isLoading,
    setIsLoading,
    setProgress,
    preprocessedFiles,
    setPreprocessedFiles,
  } = useML();

  // New state for column-specific selections
  const [columnSpecificMissing, setColumnSpecificMissing] = useState<
    Record<string, string>
  >({});
  const [columnSpecificEncoding, setColumnSpecificEncoding] = useState<
    Record<string, string>
  >({});
  const [applyAllMissing, setApplyAllMissing] = useState(true);
  const [applyAllEncoding, setApplyAllEncoding] = useState(true);
  const [selectedVizColumn, setSelectedVizColumn] = useState<string>("");

  useEffect(() => {
    if (Object.keys(suggestedMissingStrategies).length) {
      setMissingStrategy(Object.values(suggestedMissingStrategies)[0]);
    }
  }, [suggestedMissingStrategies, setMissingStrategy]);

  const isTargetEncodingMethod = encoding === "target" || encoding === "kfold";

  const handlePreprocess = async () => {
    if (files.length === 0) return setError("Please upload files first.");
    setIsLoading(true);
    setProgress(10);

    try {
      const data = await preprocessData(
        files,
        applyAllMissing ? missingStrategy : columnSpecificMissing,
        scaling,
        applyAllEncoding ? encoding : columnSpecificEncoding,
        targetColumn,
        setProgress
      );
      setPreprocessedFiles(data);
      setActiveStep("train");
    } catch (error: any) {
      console.error("Error preprocessing data:", error.message);
      setError(`Preprocessing failed: ${error.message}. Ensure backend is running.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPreprocessed = (filename: string) => {
    window.location.href = getDownloadPreprocessedUrl(filename);
  };

  // New function to generate chart data for a column
  const getColumnChartData = (column: string) => {
    if (!summaries || Object.keys(summaries).length === 0 || !column) return null;
    const summary = Object.values(summaries)[0].summary;
    const stats = summary.stats[column];
    const uniqueValues = summary.unique_values[column];

    if (summary.data_types[column].includes("float") || summary.data_types[column].includes("int")) {
      return {
        labels: ["Min", "25%", "Mean", "75%", "Max"],
        datasets: [
          {
            label: `${column} Distribution`,
            data: stats
              ? [stats.min, stats["25%"], stats.mean, stats["75%"], stats.max]
              : [],
            backgroundColor: "rgba(56, 189, 248, 0.8)",
            borderColor: "rgb(14, 165, 233)",
            borderWidth: 1,
          },
        ],
      };
    } else {
      return {
        labels: Array.from({ length: Math.min(uniqueValues, 10) }, (_, i) => `Value ${i + 1}`),
        datasets: [
          {
            label: `${column} Categories`,
            data: Array(uniqueValues).fill(1), // Placeholder; real data requires backend enhancement
            backgroundColor: "rgba(56, 189, 248, 0.8)",
            borderColor: "rgb(14, 165, 233)",
            borderWidth: 1,
          },
        ],
      };
    }
  };

  if (Object.keys(summaries).length === 0) {
    return null;
  }

  const allColumns = Object.values(summaries)
    .flatMap((s: any) => s.summary.columns)
    .filter((v: any, i: any, a: any) => a.indexOf(v) === i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-white/10 bg-secondary-50 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-secondary-100 to-secondary-50 border-b border-white/10">
          <CardTitle className="text-2xl text-white">Preprocess Data</CardTitle>
          <CardDescription className="text-white/70">
            Prepare your data by handling missing values and encoding features
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Missing Values Section */}
          <div className="bg-secondary-100 p-5 rounded-lg border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium text-white">Missing Values</h3>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="applyAllMissing"
                checked={applyAllMissing}
                onChange={(e) => setApplyAllMissing(e.target.checked)}
                className="w-4 h-4 text-primary border-white/30 rounded focus:ring-primary bg-secondary-200"
                disabled={isLoading}
              />
              <label htmlFor="applyAllMissing" className="ml-2 text-sm font-medium text-white">
                Apply to All Columns
              </label>
            </div>

            {applyAllMissing ? (
              <>
                <select
                  value={missingStrategy}
                  onChange={(e) => setMissingStrategy(e.target.value)}
                  className="w-full p-3 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  disabled={isLoading}
                >
                  <option className="bg-primary text-black" value="mean">Mean</option>
                  <option className="bg-primary text-black" value="median">Median</option>
                  <option className="bg-primary text-black" value="mode">Mode</option>
                  <option className="bg-primary text-black" value="drop">Drop</option>
                </select>
                <p className="text-xs text-white/50 mt-2">
                  {missingStrategy === "drop" && "Remove rows with missing values"}
                  {missingStrategy === "mean" && "Fill missing numeric values with column mean"}
                  {missingStrategy === "median" && "Fill missing numeric values with column median"}
                  {missingStrategy === "mode" && "Fill missing values with column mode"}
                </p>
              </>
            ) : (
              <div className="space-y-4">
                {allColumns.map((col: string) => (
                  <div key={col} className="flex items-center gap-2">
                    <span className="text-sm text-white/70 w-1/3 truncate">{col}</span>
                    <select
                      value={columnSpecificMissing[col] || "mean"}
                      onChange={(e) =>
                        setColumnSpecificMissing({
                          ...columnSpecificMissing,
                          [col]: e.target.value,
                        })
                      }
                      className="w-2/3 p-2 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                      disabled={isLoading}
                    >
                      <option className="bg-primary text-black" value="mean">Mean</option>
                      <option className="bg-primary text-black" value="median">Median</option>
                      <option className="bg-primary text-black" value="mode">Mode</option>
                      <option className="bg-primary text-black" value="drop">Drop</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scaling & Encoding Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary-100 p-5 rounded-lg border border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-white">Scaling & Encoding</h3>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="scaling"
                  checked={scaling}
                  onChange={(e) => setScaling(e.target.checked)}
                  className="w-4 h-4 text-primary border-white/30 rounded focus:ring-primary bg-secondary-200"
                  disabled={isLoading}
                />
                <label htmlFor="scaling" className="ml-2 text-sm font-medium text-white">
                  Enable Scaling
                </label>
              </div>
              <p className="text-xs text-white/50 mb-4">
                Standardize numeric features to have zero mean and unit variance
              </p>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="applyAllEncoding"
                  checked={applyAllEncoding}
                  onChange={(e) => setApplyAllEncoding(e.target.checked)}
                  className="w-4 h-4 text-primary border-white/30 rounded focus:ring-primary bg-secondary-200"
                  disabled={isLoading}
                />
                <label htmlFor="applyAllEncoding" className="ml-2 text-sm font-medium text-white">
                  Apply to All Columns
                </label>
              </div>

              {applyAllEncoding ? (
                <>
                  <select
                    value={encoding}
                    onChange={(e) => setEncoding(e.target.value)}
                    className="w-full p-3 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    disabled={isLoading}
                  >
                    <option className="bg-primary text-black" value="onehot">One-Hot Encoding</option>
                    <option className="bg-primary text-black" value="label">Label Encoding</option>
                    <option className="bg-primary text-black" value="target">Target Encoding</option>
                    <option className="bg-primary text-black" value="kfold">K-Fold Target Encoding</option>
                  </select>
                  <p className="text-xs text-white/50 mt-2">
                    {encoding === "target" && "Target encoding uses the target variable"}
                    {encoding === "kfold" && "K-Fold target encoding prevents data leakage"}
                    {encoding === "label" && "Label encoding converts categories to numbers"}
                    {encoding === "onehot" && "One-hot encoding creates binary columns"}
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  {allColumns.map((col: string) => (
                    <div key={col} className="flex items-center gap-2">
                      <span className="text-sm text-white/70 w-1/3 truncate">{col}</span>
                      <select
                        value={columnSpecificEncoding[col] || "onehot"}
                        onChange={(e) =>
                          setColumnSpecificEncoding({
                            ...columnSpecificEncoding,
                            [col]: e.target.value,
                          })
                        }
                        className="w-2/3 p-2 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                        disabled={isLoading}
                      >
                        <option className="bg-primary text-black" value="onehot">One-Hot</option>
                        <option className="bg-primary text-black" value="label">Label</option>
                        <option className="bg-primary text-black" value="target">Target</option>
                        <option className="bg-primary text-black" value="kfold">K-Fold</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {isTargetEncodingMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-secondary-100 p-5 rounded-lg border border-white/10 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-white">
                    Target Column (Required for {encoding === "target" ? "Target" : "K-Fold"} Encoding)
                  </h3>
                </div>

                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  className="w-full p-3 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  disabled={isLoading}
                >
                  <option value="">Select Target Column</option>
                  {allColumns.map((col: string) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </div>

          {/* New Visualization Section */}
          <div className="bg-secondary-100 p-5 rounded-lg border border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium text-white">Column Visualization</h3>
            </div>

            <select
              value={selectedVizColumn}
              onChange={(e) => setSelectedVizColumn(e.target.value)}
              className="w-full p-3 rounded-md border border-white/10 bg-secondary-200 text-white focus:border-primary focus:ring focus:ring-primary/20 transition-all mb-4"
              disabled={isLoading}
            >
              <option value="">Select Column to Visualize</option>
              {allColumns.map((col: string) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            {selectedVizColumn && getColumnChartData(selectedVizColumn) && (
              <div className="h-64">
                <Bar
                  data={getColumnChartData(selectedVizColumn)}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top", labels: { color: "rgba(255, 255, 255, 0.7)" } },
                      title: {
                        display: true,
                        text: `${selectedVizColumn} Distribution`,
                        color: "rgba(255, 255, 255, 0.9)",
                        font: { size: 14, weight: "bold" },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: "rgba(255, 255, 255, 0.7)" },
                        grid: { color: "rgba(255, 255, 255, 0.1)" },
                      },
                      x: {
                        ticks: { color: "rgba(255, 255, 255, 0.7)" },
                        grid: { display: false },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4 bg-secondary-200 border-t border-white/10 flex flex-col gap-4">
          <Button
            onClick={handlePreprocess}
            className="w-full bg-primary hover:bg-secondary/90 hover:text-white text-black font-semibold h-12 text-base border-2"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Preprocess Data"}
          </Button>

          {files.map((file: File) => (
            <Button
              key={file.name}
              variant="outline"
              onClick={() => handleDownloadPreprocessed(file.name)}
              className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground font-medium"
              disabled={isLoading}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Preprocessed {file.name}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
}