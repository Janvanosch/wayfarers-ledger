export interface Wayfarer {
  id: string;
  name: string;
  journeyStarted: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LedgerStatus {
  ready: boolean;
  vaultPath: string | null;
  wayfarer: Wayfarer | null;
}

export interface VaultActionResult {
  success: boolean;
  cancelled?: boolean;
  error?: string;
  status?: LedgerStatus;
}

export interface LedgerApi {
  getStatus: () => Promise<LedgerStatus>;
  vault: {
    chooseExisting: () => Promise<VaultActionResult>;
    createNew: (wayfarerName: string) => Promise<VaultActionResult>;
  };
}

declare global {
  interface Window {
    ledger: LedgerApi;
  }
}
