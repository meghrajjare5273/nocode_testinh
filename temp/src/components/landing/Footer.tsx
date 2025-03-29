"use client";

import Link from "next/link";
import { Linkedin, Instagram, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 px-6 md:px-10 lg:px-20 bg-secondary text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full"></div>
              </div>
              <div>
                <div className="text-xl font-bold">NoCode AI</div>
                <div className="text-sm text-gray-400">
                  Machine Learning
                  <br />
                  Made Simple
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm mb-4 text-white/70">Connect With Us</div>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin size={18} className="text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram size={18} className="text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter size={18} className="text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Github size={18} className="text-white" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="text-sm text-white/50 mb-4 md:mb-0">
            © {new Date().getFullYear()} Neural Nexus. All rights reserved.
          </div>

          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
