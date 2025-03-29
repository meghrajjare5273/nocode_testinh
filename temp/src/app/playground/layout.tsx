import type React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PlaygroundLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-secondary text-white">
      <div className="bg-secondary/90 backdrop-blur-sm p-4 shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          {/* <div className="flex items-center justify-center flex-1"> */}
          {/* <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center mr-2"> */}
          {/* <div className="w-4 h-4 bg-primary rounded-full"></div> */}
          {/* </div> */}
          {/* <h1 className="text-xl font-bold text-white">ML Platform</h1> */}
          {/* </div> */}
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>
      {children}
    </div>
  );
}
