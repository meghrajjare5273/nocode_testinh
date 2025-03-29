"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "Cases", href: "#cases" },
    { label: "About", href: "#about" },
    { label: "Contacts", href: "#contact" },
  ];

  return (
    <nav className="py-6 px-6 md:px-10 lg:px-20 fixed w-full z-50 bg-secondary/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full"></div>
              </div>
              <span className="ml-3 text-white font-medium">NoCodeAI</span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-white hover:text-primary transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/playground"
            className="ml-4 bg-white text-secondary hover:text-white transition-colors px-6 py-2 rounded-full text-sm font-medium hover:bg-secondary/75 "
          >
            Start Building
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-secondary absolute top-16 left-0 right-0 shadow-md py-4 px-6"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-white hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/playground"
              className="bg-white text-secondary hover:bg-primary hover:text-white transition-colors px-6 py-2 rounded-full text-sm font-medium text-center mt-2"
              onClick={() => setIsOpen(false)}
            >
              Start Bulding
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
