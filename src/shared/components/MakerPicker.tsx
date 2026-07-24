import { useEffect, useState } from "react";
import "./MakerPicker.css";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import type { Maker } from "../../types/ledger";

const NEW_MAKER_OPTION = "__new__";

interface MakerPickerProps {
  value: string | null;
  onChange: (makerId: string | null) => void;
  disabled?: boolean;
}

export default function MakerPicker({
  value,
  onChange,
  disabled,
}: MakerPickerProps) {
  const [makers, setMakers] = useState<Maker[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.ledger.makers.list().then(setMakers);
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    setBusy(true);
    const created = await window.ledger.makers.create({ name: newName.trim() });
    setBusy(false);
    setMakers((current) => [created, ...current]);
    onChange(created.id);
    setCreating(false);
    setNewName("");
  }

  if (creating) {
    return (
      <div className="maker-picker-creating">
        <Input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Maker's name"
          disabled={busy}
          autoFocus
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleCreate}
          disabled={busy || !newName.trim()}
        >
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCreating(false)}
          disabled={busy}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <select
      className="wl-input"
      value={value ?? ""}
      disabled={disabled}
      onChange={(event) => {
        if (event.target.value === NEW_MAKER_OPTION) {
          setCreating(true);
        } else {
          onChange(event.target.value || null);
        }
      }}
    >
      <option value="">Not set yet</option>
      {makers.map((maker) => (
        <option key={maker.id} value={maker.id}>
          {maker.name}
        </option>
      ))}
      <option value={NEW_MAKER_OPTION}>+ Add a new Maker…</option>
    </select>
  );
}
