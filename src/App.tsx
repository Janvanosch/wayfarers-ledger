import { useEffect, useState } from "react";
import "./App.css";

import AppShell from "./app/AppShell";
import VaultSetupPage from "./pages/VaultSetup/VaultSetupPage";
import { WayfarerProvider } from "./shared/context/WayfarerContext";
import Text from "./components/ui/Text";

import type { LedgerStatus } from "./types/ledger";

function App() {
  const [status, setStatus] = useState<LedgerStatus | "loading">("loading");

  useEffect(() => {
    window.ledger.getStatus().then(setStatus);
  }, []);

  if (status === "loading") {
    return (
      <div className="app-loading">
        <Text muted>Opening your Ledger…</Text>
      </div>
    );
  }

  if (!status.ready) {
    return <VaultSetupPage onReady={setStatus} />;
  }

  return (
    <WayfarerProvider value={status.wayfarer}>
      <AppShell />
    </WayfarerProvider>
  );
}

export default App;
