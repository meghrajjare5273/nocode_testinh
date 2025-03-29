/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useML } from "@/context/MLContext";
import { Upload, Cog, Brain, BarChart3, CheckCircle2 } from "lucide-react";
import type { Step } from "@/types";

export function Sidebar() {
  const { activeStep, setActiveStep, summaries } = useML();

  const steps: Step[] = [
    {
      id: "upload",
      label: "Upload Datasets",
      icon: (
        <Upload
          className="h-5 w-5"
          color={activeStep === "upload" ? "black" : "white"}
        />
      ),
    },
    {
      id: "preprocess",
      label: "Preprocess Data",
      icon: (
        <Cog
          className="h-5 w-5"
          color={activeStep === "preprocess" ? "black" : "white"}
        />
      ),
    },
    {
      id: "train",
      label: "Train Models",
      icon: (
        <Brain
          className="h-5 w-5"
          color={activeStep === "train" ? "black" : "white"}
        />
      ),
    },
    {
      id: "visualize",
      label: "Visualize Results",
      icon: (
        <BarChart3
          className="h-5 w-5"
          color={activeStep === "visualize" ? "black" : "white"}
        />
      ),
    },
  ];

  return (
    <div className="w-full lg:w-64 bg-secondary/80 backdrop-blur-sm border-r border-white/10 lg:min-h-screen">
      <div className="hidden lg:block p-6 border-b border-white/10">
        <div className="flex items-center mb-6">
          {/* <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center mr-2"> */}
          {/* <div className="w-6 h-6 bg-primary rounded-full"></div> */}
          {/* </div> */}
          <h1 className="text-2xl font-bold text-white">No Code</h1>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-3">
          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            const isCompleted =
              steps.findIndex((s) => s.id === activeStep) >
              steps.findIndex((s) => s.id === step.id);
            const isDisabled =
              steps.findIndex((s) => s.id === step.id) >
                steps.findIndex((s) => s.id === activeStep) &&
              !Object.keys(summaries).length;

            return (
              <li key={step.id}>
                <button
                  onClick={() => {
                    if (!isDisabled) {
                      setActiveStep(step.id);
                    }
                  }}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                    isActive
                      ? "bg-primary text-black shadow-md"
                      : isCompleted
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "hover:bg-white/5"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div
                    className={`rounded-full flex items-center justify-center ${
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-primary"
                        : "text-white/70"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className="font-medium">{step.label}</span>
                  {isCompleted && !isActive && (
                    <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
