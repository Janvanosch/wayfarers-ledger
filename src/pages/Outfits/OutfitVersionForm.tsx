import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./OutfitVersionForm.css";

import Stack from "../../components/ui/Stack";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";
import Cover from "../../components/ui/Cover";

import type { Gear, OutfitVersionFields } from "../../types/ledger";

interface OutfitVersionFormProps {
  initialGearIds: string[];
  initialNotes: string | null;
  submitLabel: string;
  busy: boolean;
  onSubmit: (fields: OutfitVersionFields) => void;
  onCancel: () => void;
}

export default function OutfitVersionForm({
  initialGearIds,
  initialNotes,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: OutfitVersionFormProps) {
  const [allGear, setAllGear] = useState<Gear[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialGearIds),
  );
  const [notes, setNotes] = useState(initialNotes ?? "");

  useEffect(() => {
    window.ledger.gear.list().then(setAllGear);
  }, []);

  function toggle(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      gearIds: Array.from(selectedIds),
      notes: notes.trim() || null,
    });
  }

  return (
    <form className="outfit-version-form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Stack gap={2}>
          <Text size="sm" muted>
            Gear in this version
          </Text>

          {allGear.length === 0 ? (
            <Text muted>
              No Gear in your Ledger yet — add some Gear first.
            </Text>
          ) : (
            <div className="outfit-gear-picker">
              {allGear.map((item) => (
                <label key={item.id} className="outfit-gear-picker-row">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggle(item.id)}
                    disabled={busy}
                  />
                  <Cover filename={item.coverPhotoFilename} alt={item.name} />
                  <Text size="sm">{item.name}</Text>
                </label>
              ))}
            </div>
          )}
        </Stack>

        <label className="outfit-version-form-field">
          <Text size="sm" muted>
            Notes
          </Text>
          <Input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="What's different about this version?"
            disabled={busy}
          />
        </label>

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
