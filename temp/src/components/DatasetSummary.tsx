/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useML } from "@/context/MLContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Table, LineChart, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "motion/react";

export function DatasetSummary() {
  const { summaries, insights, activeStep } = useML();
  const [showColumnInfo, setShowColumnInfo] = useState<Record<string, boolean>>(
    {}
  );

  if (Object.keys(summaries).length === 0 || activeStep === "upload") {
    return null;
  }

  const toggleColumnInfo = (filename: string) => {
    setShowColumnInfo((prev) => ({
      ...prev,
      [filename]: !prev[filename],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="mt-8 border border-white/10 bg-secondary-50 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-secondary-100 to-secondary-50 border-b border-white/10">
          <CardTitle className="text-2xl text-white">Dataset Summary</CardTitle>
          <CardDescription className="text-white/70">
            Overview of your uploaded datasets
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {Object.entries(summaries).map(
              ([filename, summary]: [string, any], fileIndex) => (
                <motion.div
                  key={filename}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * fileIndex }}
                  className="pb-6 border-b border-white/10 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">
                        {filename}
                      </h4>
                      <p className="text-sm text-white/50">
                        {summary.summary.rows} rows,{" "}
                        {summary.summary.columns.length} columns
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pl-12">
                    <div className="bg-secondary-100 p-4 rounded-lg border border-white/10 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <LineChart className="h-4 w-4 text-primary" />
                        <h5 className="text-sm font-medium text-white">
                          Suggested Analysis
                        </h5>
                      </div>
                      <ul className="text-sm space-y-2">
                        <li className="flex justify-between">
                          <span className="text-white/70">Task Type:</span>
                          <span className="font-medium text-white">
                            {summary.suggested_task_type}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-white/70">Target Column:</span>
                          <span className="font-medium text-white">
                            {summary.suggested_target_column || "None"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-white/70">
                            Missing Strategy:
                          </span>
                          <span className="font-medium text-white">
                            {summary.suggested_missing_strategy}
                          </span>
                        </li>
                      </ul>
                    </div>

                    {insights[filename] && (
                      <div className="bg-secondary-100 p-4 rounded-lg border border-white/10 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <h5 className="text-sm font-medium text-white">
                            AI Insights
                          </h5>
                        </div>
                        <div className="text-sm text-white/70">
                          {Array.isArray(insights[filename]) ? (
                            <ul className="space-y-1 list-disc pl-4">
                              {insights[filename].map((insight, i) => (
                                <li key={i}>{insight}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>{insights[filename]}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pl-12">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mb-4 border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
                      onClick={() => toggleColumnInfo(filename)}
                    >
                      <Table className="h-4 w-4" />
                      {showColumnInfo[filename]
                        ? "Hide Column Info"
                        : "View Column Info"}
                    </Button>

                    {showColumnInfo[filename] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 bg-secondary-100 p-4 rounded-lg border border-white/10 shadow-sm overflow-hidden"
                      >
                        <h5 className="text-sm font-medium text-white mb-3">
                          Column Information
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-secondary-200 border-b border-white/10">
                                <th className="text-left py-2 px-3 font-medium text-white">
                                  Column Name
                                </th>
                                <th className="text-left py-2 px-3 font-medium text-white">
                                  Data Type
                                </th>
                                <th className="text-left py-2 px-3 font-medium text-white">
                                  Missing Values
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {summary.summary.columns.map(
                                (column: string, colIndex: number) => (
                                  <tr
                                    key={column}
                                    className={`border-b last:border-0 ${
                                      colIndex % 2 === 0
                                        ? "bg-secondary-100"
                                        : "bg-secondary-200"
                                    }`}
                                  >
                                    <td className="py-2 px-3 text-white">
                                      {column}
                                    </td>
                                    <td className="py-2 px-3 text-white/70 font-mono text-xs">
                                      {summary.summary.data_types[column]}
                                    </td>
                                    <td className="py-2 px-3">
                                      {summary.summary.missing_values[
                                        column
                                      ] ? (
                                        <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded-full text-xs">
                                          {
                                            summary.summary.missing_values[
                                              column
                                            ]
                                          }
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-xs">
                                          0
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
