import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "./GearForm.css";

import Stack from "../../components/ui/Stack";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";
import MakerPicker from "../../shared/components/MakerPicker";

import type { Gear, GearCategory, GearFields } from "../../types/ledger";

const CATEGORIES: GearCategory[] = [
  "Footwear",
  "Clothing",
  "Armour",
  "Accessories",
  "Weaponry",
  "Utilitarian",
  "Maintenance & Storage",
];

interface GearFormProps {
  initial?: Gear;
  submitLabel: string;
  busy: boolean;
  onSubmit: (fields: GearFields) => void;
  onCancel: () => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="gear-form-field">
      <Text size="sm" muted>
        {label}
      </Text>
      {children}
    </label>
  );
}

export default function GearForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: GearFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<GearCategory | "">(
    initial?.category ?? "",
  );
  const [material, setMaterial] = useState(initial?.material ?? "");
  const [weight, setWeight] = useState(initial?.weight ?? "");
  const [colour, setColour] = useState(initial?.colour ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [makerId, setMakerId] = useState<string | null>(initial?.makerId ?? null);
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
      setError("Give it a name first.");
      return;
    }

    setError(null);
    onSubmit({
      name: name.trim(),
      category: category || null,
      material: material.trim() || null,
      weight: weight.trim() || null,
      colour: colour.trim() || null,
      price: price.trim() || null,
      makerId,
      photoPath,
    });
  }

  return (
    <form className="gear-form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && <Text size="sm">{error}</Text>}

        <Field label="Name">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. William Lennon Boots"
            disabled={busy}
            autoFocus
          />
        </Field>

        <Field label="Category">
          <select
            className="wl-input"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as GearCategory | "")
            }
            disabled={busy}
          >
            <option value="">Not set yet</option>
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Maker">
          <MakerPicker value={makerId} onChange={setMakerId} disabled={busy} />
        </Field>

        <Button
          type="button"
          variant="secondary"
          onClick={handlePickPhoto}
          disabled={busy}
        >
          {photoLabel ? `Photo: ${photoLabel}` : "Add a photo"}
        </Button>

        <Stack direction="row" gap={4} wrap>
          <Field label="Material">
            <Input
              value={material}
              onChange={(event) => setMaterial(event.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label="Colour">
            <Input
              value={colour}
              onChange={(event) => setColour(event.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label="Weight">
            <Input
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label="Price">
            <Input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              disabled={busy}
            />
          </Field>
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
