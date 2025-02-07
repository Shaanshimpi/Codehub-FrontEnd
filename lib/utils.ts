import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const disableScroll = () => {
  document.body.style.position = "fixed";
  document.body.style.top = `-${window.scrollY}px`;
};

export const enableScroll = () => {
  document.body.style.position = "";
  document.body.style.top = "";
};
