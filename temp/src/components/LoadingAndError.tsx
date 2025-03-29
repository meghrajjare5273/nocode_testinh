"use client";

import { useML } from "@/context/MLContext";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { motion } from "motion/react";

export function LoadingAndError() {
  const { isLoading, progress, error, setError } = useML();

  return (
    <>
      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-white/70">Processing...</p>
            <span className="text-sm font-medium text-primary">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10">
            <div className="h-full bg-primary transition-all" />
          </Progress>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6"
        >
          <Alert
            variant="destructive"
            className="border-red-800 bg-red-900/50 text-white"
          >
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-200">Error</AlertTitle>
            <AlertDescription className="text-red-200">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="ml-2 mt-2 border-red-700 hover:bg-red-800 text-red-200"
              >
                Dismiss
                <X className="ml-1 h-3 w-3" />
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </>
  );
}
