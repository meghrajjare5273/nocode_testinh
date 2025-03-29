"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Linkedin, Instagram, Twitter, Youtube } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 bg-secondary text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full border border-white/10"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full border border-white/10"></div>
      </div>

      <div className="container mx-auto px-6 md:px-10 lg:px-20 z-10 py-20">
        <div className="border-t border-white/20 pt-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              NoCode AI & ML
              <br />
              Model Builder
            </h1>
            <div className="mt-4 text-right">
              <span className="text-sm">
                by <b>Neural Nexus</b>
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center border-t border-white/20 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center"
          >
            <div>
              <p className="text-lg text-white/80">
                &quot;Upgrade your Future with the power of AI
                <br />
                and Machine Learning.&quot;
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-start"
          >
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mt-6">
              <br />
            </h2>
          </motion.div>
        </div>
      </div>

      <div className="bg-primary py-16 px-6 md:px-10 lg:px-20 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex gap-4 mb-6">
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center"
                >
                  <Linkedin size={18} className="text-black" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center"
                >
                  <Instagram size={18} className="text-black" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center"
                >
                  <Twitter size={18} className="text-black" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center"
                >
                  <Youtube size={18} className="text-black" />
                </Link>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-black">
                We Create Astounding Products
                <br />
                Powered By Machine Learning
                <br />
                And Data Analysis.
              </h3>
            </div>
            <Link href="/playground" className="group">
              <div className="flex items-center">
                <div className="bg-black text-white px-6 py-3 rounded-full mr-2">
                  CONTACT US
                </div>
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L13 6M19 12L13 18"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
