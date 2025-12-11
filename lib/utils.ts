// lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const backendUrl = "http://127.0.0.1:8000";
  
  let cleanPath = url.startsWith("/") ? url.slice(1) : url;

  if (!cleanPath.startsWith("storage/")) {
     cleanPath = `storage/${cleanPath}`;
  }

  return `${backendUrl}/${cleanPath}`;
};