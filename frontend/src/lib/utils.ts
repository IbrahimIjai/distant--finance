import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAddress } from "viem";

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, characters = 4): string {
  try {
    const parsed = getAddress(address);
    return `${parsed.substring(0, characters + 2)}...${parsed.substring(
      42 - characters
    )}`;
  } catch {
    throw `Invalid 'address' parameter '${address}'.`;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slice = (address: string) => {
  const account = address?.toLowerCase();
  return `${account?.slice(0, 5)}...${account?.slice(38, 42)}`;
};
export function isExpired(timestamp: number) {
  const now = Date.now() / 1000;
  const timeDiff = timestamp - now;
  if (timeDiff <= 0) {
    return true;
  }
  return false;
}
