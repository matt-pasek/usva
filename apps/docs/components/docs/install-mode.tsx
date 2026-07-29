"use client";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type InstallMode = "install" | "copy";

const STORAGE_KEY = "usva-install-mode";

interface InstallModeContextValue {
  mode: InstallMode;
  setMode: (mode: InstallMode) => void;
}

const InstallModeContext = createContext<InstallModeContextValue | null>(null);

const isMode = (value: unknown): value is InstallMode =>
  value === "install" || value === "copy";

export function InstallModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<InstallMode>("install");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isMode(stored)) setModeState(stored);
    } catch {
      /* private mode; the default stands */
    }
  }, []);

  const setMode = (next: InstallMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode; the choice lives for the session */
    }
  };

  return (
    <InstallModeContext.Provider value={{ mode, setMode }}>
      {children}
    </InstallModeContext.Provider>
  );
}

export function useInstallMode(): InstallModeContextValue {
  const context = useContext(InstallModeContext);
  if (!context) {
    throw new Error(
      "useInstallMode must be used inside an InstallModeProvider",
    );
  }
  return context;
}
