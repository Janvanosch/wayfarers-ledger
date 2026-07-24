import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "./OutfitForm.css";

import Stack from "../../components/ui/Stack";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

import type { Outfit, OutfitFields } from "../../types/ledger";

interface OutfitFormProps {
  initial?: Outfit;
  submitLabel: string;
  busy: boolean;
  onSubmit: (fields: OutfitFields) => void;
  onCancel: () => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="outfit-form-field">
      <Text size="sm" muted>
        {label}
      </Text>
      {children}
    </label>
  );
}

export default function OutfitForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: OutfitFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [photoLabel, setPhotoLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePickPhoto() {
    const path = await window.ledger.photos.pickFile();
    if (path) {
      setPhotoPath(path);
      setPhotoLabel(path.split(/[\\/]/).pop() ?? path);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Give the Outfit a name first.");
      return;
    }

    setError(null);
    onSubmit({ name: name.trim(), photoPath });
  }

  return (
    <form className="outfit-form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && <Text size="sm">{error}</Text>}

        <Field label="Name">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Veteran Knight"
            disabled={busy}
            autoFocus
          />
        </Field>

        <Button
          type="button"
          variant="secondary"
          onClick={handlePickPhoto}
          disabled={busy}
        >
          {photoLabel ? `Cover: ${photoLabel}` : "Add a cover photo"}
        </Button>

        <Stack direction="row" gap={3}>
          <Button type="submit" variant="primary" disabled={busy}>
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
