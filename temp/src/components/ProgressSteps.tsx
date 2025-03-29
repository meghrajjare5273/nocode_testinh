"use client";

import { useML } from "@/context/MLContext";
import { Upload, Cog, Brain, BarChart3 } from "lucide-react";
import type { Step } from "@/types";
import { motion } from "motion/react";

export function ProgressSteps() {
  const { activeStep } = useML();

  const steps: Step[] = [
    {
      id: "upload",
      label: "Upload Datasets",
      icon: (
        <Upload
          className="h-5 w-5"
          color={activeStep === "upload" ? "black" : "grey"}
        />
      ),
    },
    {
      id: "preprocess",
      label: "Preprocess Data",
      icon: (
        <Cog
          className="h-5 w-5"
          color={activeStep === "preprocess" ? "black" : "grey"}
        />
      ),
    },
    {
      id: "train",
      label: "Train Models",
      icon: (
        <Brain
          className="h-5 w-5"
          color={activeStep === "train" ? "black" : "grey"}
        />
      ),
    },
    {
      id: "visualize",
      label: "Visualize Results",
      icon: (
        <BarChart3
          className="h-5 w-5"
          color={activeStep === "visualize" ? "black" : "grey"}
        />
      ),
    },
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = steps.findIndex((s) => s.id === activeStep) >= index;
          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: isActive ? 1.05 : 1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {step.icon}
              </motion.div>
              <span
                className={`text-xs mt-2 hidden sm:block font-medium ${
                  isActive ? "text-primary" : "text-white/50"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{
            width: `${
              (steps.findIndex((s) => s.id === activeStep) /
                (steps.length - 1)) *
              100
            }%`,
          }}
          transition={{ duration: 0.5 }}
          className="absolute h-full bg-primary"
        />
      </div>
    </div>
  );
}
