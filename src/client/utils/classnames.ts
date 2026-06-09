import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

