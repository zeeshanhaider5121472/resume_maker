// app/PuterErrorHandler.tsx
"use client";

import { useEffect } from "react";

export default function PuterErrorHandler() {
  useEffect(() => {
    // Intercept Puter's background 401 errors to prevent Next.js overlay crash
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        event.reason.status === 401 &&
        event.reason.message === "Unauthorized"
      ) {
        // Prevent Next.js from showing the Runtime Error overlay
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null; // This component doesn't render anything on the screen
}
