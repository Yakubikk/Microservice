'use client';

import React, { useEffect, useState } from "react";

interface LoadingWithProgressProps {
  message?: string;
}

export const LoadingWithProgress: React.FC<LoadingWithProgressProps> = ({ message = "Загрузка..." }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed h-screen w-full flex flex-col items-center justify-center space-y-4 p-6">
      <div className="w-64 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};
