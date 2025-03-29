/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
  BarChart2,
  PieChart,
  TrendingUp,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
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
import { getChartData } from "@/utils/model-utils";
import { motion } from "motion/react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function VisualizeStep() {
  const { modelResults, setActiveStep } = useML();

  if (Object.keys(modelResults).length === 0) {
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
          <CardTitle className="text-2xl text-white">
            Visualize Results
          </CardTitle>
          <CardDescription className="text-white/70">
            View and analyze your model performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {Object.entries(modelResults).map(
            ([filename, result]: [string, any], index) => (
              <motion.div
                key={filename}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="mb-8 last:mb-0 bg-secondary-100 rounded-lg border border-white/10 shadow-sm overflow-hidden"
              >
                <div className="bg-secondary-200 p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      {result.task_type === "classification" ? (
                        <PieChart className="h-5 w-5 text-primary" />
                      ) : result.task_type === "regression" ? (
                        <TrendingUp className="h-5 w-5 text-primary" />
                      ) : (
                        <BarChart2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {filename}
                      </h3>
                      <p className="text-sm text-white/50">
                        {result.task_type} model using {result.model_type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {result.error ? (
                    <div className="bg-red-900/30 text-red-300 p-4 rounded-md">
                      {result.error}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-secondary-200 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-white mb-3">
                          Model Performance Metrics
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(result.results || {}).map(
                            ([metric, value]: [string, any]) => (
                              <div
                                key={metric}
                                className="flex justify-between items-center"
                              >
                                <span className="text-sm font-medium text-white/70">
                                  {metric
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  :
                                </span>
                                <span className="text-sm font-mono bg-secondary-300 px-2 py-1 rounded border border-white/10 text-white">
                                  {value === null || typeof value !== "number"
                                    ? "N/A"
                                    : value.toFixed(4)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {result.feature_importance &&
                        result.feature_importance.length > 0 && (
                          <div className="bg-secondary-200 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-white mb-3">
                              Feature Importance
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                              {result.feature_importance.map(
                                (
                                  [feature, importance]: [string, number],
                                  i: number
                                ) => (
                                  <div key={i} className="flex flex-col">
                                    <div className="flex justify-between items-center mb-1">
                                      <span
                                        className="text-xs text-white/70 truncate max-w-[70%]"
                                        title={feature}
                                      >
                                        {feature}
                                      </span>
                                      <span className="text-xs font-mono text-white">
                                        {importance.toFixed(4)}
                                      </span>
                                    </div>
                                    <div className="w-full bg-secondary-300 rounded-full h-1.5">
                                      <div
                                        className="bg-primary h-1.5 rounded-full"
                                        style={{
                                          width: `${importance * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {!result.error && getChartData(result) && (
                    <div className="mt-6 bg-secondary-200 border border-white/10 rounded-lg p-4 h-64">
                      <Bar
                        data={getChartData(result)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                              labels: {
                                color: "rgba(255, 255, 255, 0.7)",
                              },
                            },
                            title: {
                              display: true,
                              text: `${result.task_type} Performance Metrics for ${result.model_type}`,
                              color: "rgba(255, 255, 255, 0.9)",
                              font: {
                                size: 14,
                                weight: "bold",
                              },
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 1.0,
                              ticks: {
                                color: "rgba(255, 255, 255, 0.7)",
                              },
                              grid: {
                                color: "rgba(255, 255, 255, 0.1)",
                              },
                            },
                            x: {
                              ticks: {
                                color: "rgba(255, 255, 255, 0.7)",
                              },
                              grid: {
                                display: false,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          )}

          <Alert className="bg-primary/10 border-primary/20 mt-6">
            <RefreshCw className="h-4 w-4 text-primary" />
            <AlertDescription className="text-white">
              You can retrain your models with different parameters or try new
              models to improve performance.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="px-6 py-4 bg-secondary-200 border-t border-white/10 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setActiveStep("train")}
            className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white font-medium"
          >
            Train Another Model
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-black font-semibold">
            Deploy Model <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
