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

const backendUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000";
  
  let cleanPath = url.startsWith("/") ? url.slice(1) : url;

  if (!cleanPath.startsWith("storage/")) {
     cleanPath = `storage/${cleanPath}`;
  }

  return `${backendUrl}/${cleanPath}`;
};
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
export const handleError = (error: unknown, defaultMsg: string = "Có lỗi xảy ra") => {
  console.error("Chi tiết lỗi:", error);

  const err = error as ApiError;

  const msg =
    err?.response?.data?.message || 
    err?.message ||                 
    defaultMsg;
  alert("" + msg);
};