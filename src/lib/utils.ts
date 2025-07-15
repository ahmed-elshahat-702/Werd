import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTo12Hour = (time: string) => {
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr);
  const minute = minuteStr.padStart(2, "0");
  const ampm = hour >= 12 ? "م" : "ص";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

export const convertToArabicNumber = (number: number | string) => {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return number
    .toString()
    .split("")
    .map((digit) => arabicNumbers[parseInt(digit)])
    .join("");
};
