import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "./JournalEntryForm.css";

import Stack from "../../components/ui/Stack";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";
import GearMultiPicker from "../../shared/components/GearMultiPicker";
import OutfitMultiPicker from "../../shared/components/OutfitMultiPicker";
import MultiPhotoPicker from "../../shared/components/MultiPhotoPicker";

import type { Festival, JournalEntry, JournalEntryFields } from "../../types/ledger";

interface JournalEntryFormProps {
  initial?: JournalEntry;
  lockedFestivalId?: string;
  submitLabel: string;
  busy: boolean;
  onSubmit: (fields: JournalEntryFields) => void;
  onCancel: () => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="journal-entry-form-field">
      <Text size="sm" muted>
        {label}
      </Text>
      {children}
    </label>
  );
}

export default function JournalEntryForm({
  initial,
  lockedFestivalId,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: JournalEntryFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [festivalId, setFestivalId] = useState(
    lockedFestivalId ?? initial?.festivalId ?? "",
  );
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [gearIds, setGearIds] = useState<Set<string>>(
    new Set(initial?.gear.map((item) => item.id) ?? []),
  );
  const [outfitIds, setOutfitIds] = useState<Set<string>>(
    new Set(initial?.outfits.map((item) => item.id) ?? []),
  );
  const [photoPaths, setPhotoPaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lockedFestivalId) {
      window.ledger.festivals.list().then(setFestivals);
    }
  }, [lockedFestivalId]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) {
      setError("Write something first.");
      return;
    }

    setError(null);
    onSubmit({
      title: title.trim() || null,
      body: body.trim(),
      festivalId: festivalId || null,
      gearIds: Array.from(gearIds),
      outfitIds: Array.from(outfitIds),
      photoPaths,
    });
  }

  return (
    <form className="journal-entry-form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && <Text size="sm">{error}</Text>}

        <Field label="Title (optional)">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Rain at Castlefest"
            disabled={busy}
            autoFocus
          />
        </Field>

        <Field label="What happened?">
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write freely — this is your memory, not a report."
            disabled={busy}
          />
        </Field>

        {!lockedFestivalId && (
          <Field label="Festival (optional)">
            <select
              className="wl-input"
              value={festivalId}
              onChange={(event) => setFestivalId(event.target.value)}
              disabled={busy}
            >
              <option value="">Not tied to a Festival</option>
              {festivals.map((festival) => (
                <option key={festival.id} value={festival.id}>
                  {festival.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Stack gap={2}>
          <Text size="sm" muted>
            Photos
          </Text>
          <MultiPhotoPicker
            paths={photoPaths}
            onChange={setPhotoPaths}
            disabled={busy}
          />
          {initial && initial.photos.length > 0 && (
            <Text size="sm" muted>
              {initial.photos.length} photo(s) already attached.
            </Text>
          )}
        </Stack>

        <Stack gap={2}>
          <Text size="sm" muted>
            Gear in this memory
          </Text>
          <GearMultiPicker
            selectedIds={gearIds}
            onChange={setGearIds}
            disabled={busy}
          />
        </Stack>

        <Stack gap={2}>
          <Text size="sm" muted>
            Outfits in this memory
          </Text>
          <OutfitMultiPicker
            selectedIds={outfitIds}
            onChange={setOutfitIds}
            disabled={busy}
          />
        </Stack>

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
