import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Menggabungkan class Tailwind dengan resolusi konflik melalui twMerge & clsx
 * Wajib untuk komponen shadcn/ui
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
