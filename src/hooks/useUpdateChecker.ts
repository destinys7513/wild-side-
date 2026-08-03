import { useEffect } from "react";
import { refreshContentFromJSON, getContentVersion } from "@/lib/storage";

const APP_VERSION_KEY = "wildside_app_version";
const DATA_URL = "/data.json";

async function fetchDataVersion() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-cache" });
    if (!response.ok) return null;
    const data = await response.json();
    return data.version ?? null;
  } catch {
    return null;
  }
}

export function useUpdateChecker() {
  useEffect(() => {
    let mounted = true;

    async function checkForUpdates() {
      try {
        const fileVersion = await fetchDataVersion();
        if (!fileVersion || !mounted) return;

        const storedVersion = localStorage.getItem(APP_VERSION_KEY);

        if (!storedVersion) {
          localStorage.setItem(APP_VERSION_KEY, fileVersion);
          return;
        }

        if (fileVersion !== storedVersion) {
          console.log(`[UpdateChecker] New version detected: ${storedVersion} -> ${fileVersion}`);

          await refreshContentFromJSON();
          localStorage.removeItem("wildside_content");
          localStorage.setItem(APP_VERSION_KEY, fileVersion);

          if (mounted) {
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("[UpdateChecker] Error checking for updates:", error);
      }
    }

    checkForUpdates();

    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);
}

export function getCurrentVersion(): string | null {
  return localStorage.getItem(APP_VERSION_KEY);
}

export function forceUpdate() {
  refreshContentFromJSON()
    .then(() => {
      localStorage.removeItem("wildside_content");
      localStorage.setItem(APP_VERSION_KEY, getContentVersion());
      window.location.reload();
    })
    .catch(() => {
      window.location.reload();
    });
}
