import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "./MakerForm.css";

import Stack from "../../components/ui/Stack";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

import type { Maker, MakerFields } from "../../types/ledger";

interface MakerFormProps {
  initial?: Maker;
  submitLabel: string;
  busy: boolean;
  onSubmit: (fields: MakerFields) => void;
  onCancel: () => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="maker-form-field">
      <Text size="sm" muted>
        {label}
      </Text>
      {children}
    </label>
  );
}

export default function MakerForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: MakerFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [instagram, setInstagram] = useState(initial?.instagram ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [logoPhotoPath, setLogoPhotoPath] = useState<string | null>(null);
  const [logoLabel, setLogoLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePickLogo() {
    const path = await window.ledger.photos.pickFile();
    if (path) {
      setLogoPhotoPath(path);
      setLogoLabel(path.split(/[\\/]/).pop() ?? path);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Give the Maker a name first.");
      return;
    }

    setError(null);
    onSubmit({
      name: name.trim(),
      website: website.trim() || null,
      instagram: instagram.trim() || null,
      notes: notes.trim() || null,
      logoPhotoPath,
    });
  }

  return (
    <form className="maker-form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && <Text size="sm">{error}</Text>}

        <Field label="Name">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. William Lennon"
            disabled={busy}
            autoFocus
          />
        </Field>

        <Button
          type="button"
          variant="secondary"
          onClick={handlePickLogo}
          disabled={busy}
        >
          {logoLabel ? `Logo: ${logoLabel}` : "Add a logo or photo"}
        </Button>

        <Stack direction="row" gap={4} wrap>
          <Field label="Website">
            <Input
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://…"
              disabled={busy}
            />
          </Field>
          <Field label="Instagram">
            <Input
              value={instagram}
              onChange={(event) => setInstagram(event.target.value)}
              placeholder="@…"
              disabled={busy}
            />
          </Field>
        </Stack>

        <Field label="Notes">
          <Input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={busy}
          />
        </Field>

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
