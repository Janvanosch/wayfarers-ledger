import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "./FestivalForm.css";

import Stack from "../../components/ui/Stack";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

import type { Festival, FestivalFields } from "../../types/ledger";

interface FestivalFormProps {
  initial?: Festival;
  submitLabel: string;
  busy: boolean;
  onSubmit: (fields: FestivalFields) => void;
  onCancel: () => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="festival-form-field">
      <Text size="sm" muted>
        {label}
      </Text>
      {children}
    </label>
  );
}

export default function FestivalForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: FestivalFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [weather, setWeather] = useState(initial?.weather ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
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
      setError("Give the Festival a name first.");
      return;
    }

    setError(null);
    onSubmit({
      name: name.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      location: location.trim() || null,
      weather: weather.trim() || null,
      notes: notes.trim() || null,
      photoPath,
    });
  }

  return (
    <form className="festival-form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && <Text size="sm">{error}</Text>}

        <Field label="Name">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Castlefest 2028"
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
          {photoLabel ? `Banner: ${photoLabel}` : "Add a banner photo"}
        </Button>

        <Stack direction="row" gap={4} wrap>
          <Field label="Start date">
            <Input
              type="date"
              value={startDate ?? ""}
              onChange={(event) => setStartDate(event.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label="End date">
            <Input
              type="date"
              value={endDate ?? ""}
              onChange={(event) => setEndDate(event.target.value)}
              disabled={busy}
            />
          </Field>
        </Stack>

        <Stack direction="row" gap={4} wrap>
          <Field label="Location">
            <Input
              value={location ?? ""}
              onChange={(event) => setLocation(event.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label="Weather">
            <Input
              value={weather ?? ""}
              onChange={(event) => setWeather(event.target.value)}
              placeholder="e.g. Sunny, a little muddy"
              disabled={busy}
            />
          </Field>
        </Stack>

        <Field label="Notes">
          <Input
            value={notes ?? ""}
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
