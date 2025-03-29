"use client";

import { motion } from "motion/react";
import { Upload, Cog, Brain, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: <Upload className="h-8 w-8 text-white" />,
    title: "Upload Your Data",
    description:
      "Upload your CSV datasets with our simple drag and drop interface.",
    color: "bg-primary",
  },
  {
    icon: <Cog className="h-8 w-8 text-white" />,
    title: "Preprocess Data",
    description:
      "Configure preprocessing options like handling missing values and encoding.",
    color: "bg-primary/90",
  },
  {
    icon: <Brain className="h-8 w-8 text-white" />,
    title: "Train Models",
    description:
      "Select your task type, model, and target column to train your ML model.",
    color: "bg-primary/80",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-white" />,
    title: "Visualize Results",
    description:
      "View model performance metrics and visualizations to evaluate your model.",
    color: "bg-primary/70",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 md:px-10 lg:px-20 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Our platform makes machine learning accessible to everyone in just a
            few simple steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/10 hidden md:block transform -translate-x-1/2"></div>

          <div className="space-y-16 md:space-y-0 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`md:flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } md:mb-24`}
              >
                <div
                  className={`md:w-1/2 p-6 ${
                    index % 2 === 0
                      ? "md:text-right md:pr-12"
                      : "md:text-left md:pl-12"
                  }`}
                >
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/70">{step.description}</p>
                </div>

                <div className="flex justify-center md:w-0">
                  <div
                    className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center z-10 border border-white/20`}
                  >
                    {step.icon}
                  </div>
                </div>

                <div className="md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
