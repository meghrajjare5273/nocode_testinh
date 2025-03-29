/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const industries = [
  {
    title: "Finance & Banking",
    image: "/placeholder.svg?height=300&width=400",
    description:
      "Leverage ML for risk assessment, fraud detection, and personalized financial recommendations.",
  },
  {
    title: "Healthcare & Biotech",
    image: "/placeholder.svg?height=300&width=400",
    description:
      "Accelerate medical research, improve diagnostics, and optimize patient care with AI.",
  },
  {
    title: "Retail & E-commerce",
    image: "/placeholder.svg?height=300&width=400",
    description:
      "Enhance customer experiences with personalized recommendations and demand forecasting.",
  },
  {
    title: "Manufacturing & Logistics",
    image: "/placeholder.svg?height=300&width=400",
    description:
      "Optimize supply chains, predict maintenance needs, and improve quality control.",
  },
];

export function Industries() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === industries.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? industries.length - 1 : prev - 1));
  };

  return (
    <section
      id="industries"
      className="py-24 px-6 md:px-10 lg:px-20 bg-gradient-to-b from-secondary to-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-bold text-white leading-tight">
              Industries
              <br />
              We Serve
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-lg">
              Our ML platform is designed to meet the unique needs of various
              industries, helping businesses across sectors harness the power of
              machine learning.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-1">
                {industries.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? "bg-primary" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          <div className="space-y-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: index === currentSlide ? 1 : 0,
                  y: index === currentSlide ? 0 : 20,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`bg-white/5 rounded-lg overflow-hidden border border-white/10 shadow-lg ${
                  index === currentSlide ? "block" : "hidden"
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <img
                    src={industry.image || "/placeholder.svg"}
                    alt={industry.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {industry.title}
                  </h3>
                  <p className="text-white/70">{industry.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
