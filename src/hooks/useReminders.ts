import { useEffect, useRef } from "react";
import { Task } from "../types/user";

export const useReminders = (tasks: Task[]) => {
  // Store sent notifications to avoid duplicate alerts for the same time window
  const sentNotifications = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request permission on mount
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      // Clear old notifications history every hour to prevent memory leaks? 
      // Or just simplistic: clear if day changed. 
      // For now simple set management.

      tasks.forEach((task) => {
        if (task.done) return;

        // Check Deadline
        if (task.deadline) {
          const deadline = new Date(task.deadline);
          const diff = deadline.getTime() - now.getTime();
          // Alert if within 5 minutes and not passed significantly
          if (diff > 0 && diff <= 5 * 60 * 1000) {
            const key = `${task.id}-deadline-${deadline.toISOString()}`;
            if (!sentNotifications.current.has(key)) {
              new Notification(`Example Task Due Soon: ${task.name}`, {
                body: `Deadline at ${deadline.toLocaleTimeString()}`,
                icon: "/pwa-192x192.png", // Assuming icon exists, or use default
              });
              sentNotifications.current.add(key);
            }
          }
        }

        // Check Time Blocks
        if (task.timeBlocks) {
          task.timeBlocks.forEach((block) => {
             const start = new Date(block.start);
             const diff = start.getTime() - now.getTime();
             if (diff > 0 && diff <= 5 * 60 * 1000) {
                 const key = `${task.id}-block-${start.toISOString()}`;
                 if (!sentNotifications.current.has(key)) {
                     new Notification(`Upcoming Work Block: ${task.name}`, {
                         body: `Starting at ${start.toLocaleTimeString()}: ${block.label || "Work Session"}`,
                     });
                     sentNotifications.current.add(key);
                 }
             }
          });
        }
      });
    };

    // Check every minute
    const intervalId = setInterval(checkReminders, 60000);
    // Initial check
    checkReminders();

    return () => clearInterval(intervalId);
  }, [tasks]);
};
