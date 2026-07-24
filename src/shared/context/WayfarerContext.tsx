import { createContext, useContext } from "react";

import type { Wayfarer } from "../../types/ledger";

const WayfarerContext = createContext<Wayfarer | null>(null);

export const WayfarerProvider = WayfarerContext.Provider;

export function useWayfarer() {
  return useContext(WayfarerContext);
}
