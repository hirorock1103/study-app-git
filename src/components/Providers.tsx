"use client";

import { createStore, Provider as JotaiProvider } from "jotai";

const store = createStore();

export default function Providers({ children }: { children: React.ReactNode }) {
  return <JotaiProvider store={store}>{children}</JotaiProvider>;
}
