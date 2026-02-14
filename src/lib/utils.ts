import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// mediaUrl prefixes relative storage paths with the API base URL so images served
// by the backend (e.g. "/storage/posters/...") become full URLs in the browser.
export function mediaUrl(p?: string): string {
  if (!p) return "";
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const API = import.meta.env.VITE_API_URL || "";
  // If the path points to backend storage, prefix it with the API URL so
  // the browser requests the file from the backend file server.
  if (p.startsWith("/storage/")) return `${API}${p}`;
  // For other absolute paths (like "/placeholder.svg") treat them as
  // frontend-local assets and return the path as-is so the dev server
  // serves them from the frontend app.
  if (p.startsWith("/")) return p;
  // For relative paths, assume they live on the API server.
  return `${API}/${p}`;
}
