import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export const BACKEND_URL = "http://127.0.0.1:8000";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getFullImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://placehold.co/40x40/E0E0E0/000?text=Empty";
  
  if (path.startsWith("http") || path.startsWith("blob:")) {
    return path;
  }

  let cleanPath = path.startsWith("/") ? path.substring(1) : path;

  if (cleanPath.startsWith("uploads/")) {
      cleanPath = `storage/${cleanPath}`;
  }
  return `${BACKEND_URL}/${cleanPath}`;
};
