// lib/searchCache.ts
const STORAGE_KEY = "searchCache";

type Cache = {
  [query: string]: string[]; // atau bisa juga: Product[] tergantung kebutuhan
};

export const loadCacheFromStorage = (): Cache => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("Failed to load cache from storage:", e);
    return {};
  }
};

export const saveCacheToStorage = (cache: Cache) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to save cache:", e);
  }
};
