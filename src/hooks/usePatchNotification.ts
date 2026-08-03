import { useState, useEffect } from "react";
import { fetchPatches } from "@/lib/content";

const STORAGE_KEY = "seenPatchVersion";

export function usePatchNotification() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [hasNewPatch, setHasNewPatch] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const version = await fetchLatestPatchVersion();
        setLatestVersion(version);
        const seenVersion = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        setHasNewPatch(version !== null && version !== seenVersion);
      } catch {
        setLatestVersion(null);
        setHasNewPatch(false);
      }
    }
    check();
    const interval = setInterval(check, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  function markAsSeen() {
    if (latestVersion) {
      localStorage.setItem(STORAGE_KEY, latestVersion);
      setHasNewPatch(false);
    }
  }

  return { hasNewPatch, latestVersion, markAsSeen };
}

async function fetchLatestPatchVersion(): Promise<string> {
  const patches = await fetchPatches();
  return patches[0]?.version ?? "0.0";
}