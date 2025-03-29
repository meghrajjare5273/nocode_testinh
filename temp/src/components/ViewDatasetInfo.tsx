/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useML } from "@/context/MLContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "lucide-react";

export function ViewDatasetInfo() {
  const { summaries, activeStep } = useML();
  const [isOpen, setIsOpen] = useState(false);

  if (Object.keys(summaries).length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 mb-4"
      >
        <Table className="h-4 w-4" />
        {isOpen ? "Hide Dataset Information" : "View Dataset Information"}
      </Button>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Dataset Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(summaries).map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ([filename, summary]: [string, any]) => (
                  <div
                    key={filename}
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <h3 className="text-lg font-medium mb-3">{filename}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium">
                              Column Name
                            </th>
                            <th className="text-left py-2 px-3 font-medium">
                              Data Type
                            </th>
                            <th className="text-left py-2 px-3 font-medium">
                              Missing Values
                            </th>
                            <th className="text-left py-2 px-3 font-medium">
                              Unique Values
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary.summary.columns.map((column: string) => (
                            <tr key={column} className="border-b last:border-0">
                              <td className="py-2 px-3">{column}</td>
                              <td className="py-2 px-3">
                                {summary.summary.data_types[column]}
                              </td>
                              <td className="py-2 px-3">
                                {summary.summary.missing_values[column] || 0}
                              </td>
                              <td className="py-2 px-3">
                                {summary.summary.unique_values &&
                                summary.summary.unique_values[column]
                                  ? summary.summary.unique_values[column]
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
