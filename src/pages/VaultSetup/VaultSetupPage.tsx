import { useState } from "react";
import "./VaultSetupPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import type { LedgerStatus } from "../../types/ledger";

interface VaultSetupPageProps {
  onReady: (status: LedgerStatus) => void;
}

type Mode = "intro" | "name-entry";

export default function VaultSetupPage({ onReady }: VaultSetupPageProps) {
  const [mode, setMode] = useState<Mode>("intro");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChooseExisting() {
    setBusy(true);
    setError(null);
    const result = await window.ledger.vault.chooseExisting();
    setBusy(false);

    if (result.cancelled) return;
    if (!result.success) {
      setError(result.error ?? "Something went wrong opening that Vault.");
      return;
    }
    if (result.status) onReady(result.status);
  }

  async function handleCreateNew() {
    if (!name.trim()) {
      setError("Tell us what to call you first.");
      return;
    }

    setBusy(true);
    setError(null);
    const result = await window.ledger.vault.createNew(name.trim());
    setBusy(false);

    if (result.cancelled) return;
    if (!result.success) {
      setError(result.error ?? "Something went wrong creating your Vault.");
      return;
    }
    if (result.status) onReady(result.status);
  }

  return (
    <Container>
      <div className="vault-setup">
        <Heading level={1}>Every journey begins with a single entry.</Heading>

        <Text size="lg" muted>
          Before we begin, choose where your Wayfarer's Vault should live —
          the folder that will hold your Ledger and your photos. It stays on
          your own device, in a folder you choose, such as a Dropbox or
          OneDrive folder.
        </Text>

        {error && (
          <Card>
            <Text>{error}</Text>
          </Card>
        )}

        {mode === "intro" && (
          <Stack direction="row" gap={4} wrap>
            <Button
              variant="primary"
              disabled={busy}
              onClick={() => setMode("name-entry")}
            >
              Start my Journey
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={handleChooseExisting}
            >
              I already have a Vault
            </Button>
          </Stack>
        )}

        {mode === "name-entry" && (
          <Stack gap={4}>
            <Stack gap={2}>
              <label htmlFor="wayfarer-name">
                <Text size="sm" muted>
                  What should we call you?
                </Text>
              </label>
              <Input
                id="wayfarer-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                disabled={busy}
                autoFocus
              />
            </Stack>

            <Stack direction="row" gap={3}>
              <Button
                variant="primary"
                disabled={busy}
                onClick={handleCreateNew}
              >
                Choose a folder for my Vault
              </Button>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => setMode("intro")}
              >
                Back
              </Button>
            </Stack>
          </Stack>
        )}
      </div>
    </Container>
  );
}
