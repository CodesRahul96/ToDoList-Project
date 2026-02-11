import { useEffect } from "react";

export const FirebaseDebugger = () => {
  useEffect(() => {
    console.group("Firebase Environment Debugger");
    console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY ? "EXISTS" : "MISSING");
    console.log("VITE_FIREBASE_API_KEY Value (partial):", import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 7) + "...");
    console.groupEnd();
  }, []);

  return null;
};
