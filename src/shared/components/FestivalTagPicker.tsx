import { useEffect, useState } from "react";
import "./FestivalTagPicker.css";

import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import type { Festival } from "../../types/ledger";

const NEW_FESTIVAL_OPTION = "__new__";

interface FestivalTagPickerProps {
  gearId: string;
}

export default function FestivalTagPicker({ gearId }: FestivalTagPickerProps) {
  const [allFestivals, setAllFestivals] = useState<Festival[]>([]);
  const [linked, setLinked] = useState<Festival[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.ledger.festivals.list().then(setAllFestivals);
    window.ledger.gear.festivalsFor(gearId).then(setLinked);
  }, [gearId]);

  const linkedIds = new Set(linked.map((festival) => festival.id));
  const available = allFestivals.filter(
    (festival) => !linkedIds.has(festival.id),
  );

  async function handleLink(festivalId: string) {
    setBusy(true);
    await window.ledger.gear.linkFestival(gearId, festivalId);
    const festival = allFestivals.find((item) => item.id === festivalId);
    if (festival) setLinked((current) => [...current, festival]);
    setBusy(false);
  }

  async function handleUnlink(festivalId: string) {
    setBusy(true);
    await window.ledger.gear.unlinkFestival(gearId, festivalId);
    setLinked((current) => current.filter((item) => item.id !== festivalId));
    setBusy(false);
  }

  async function handleCreateAndLink() {
    if (!newName.trim()) return;
    setBusy(true);
    const created = await window.ledger.festivals.create({
      name: newName.trim(),
    });
    await window.ledger.gear.linkFestival(gearId, created.id);
    setAllFestivals((current) => [created, ...current]);
    setLinked((current) => [...current, created]);
    setBusy(false);
    setCreating(false);
    setNewName("");
  }

  return (
    <div className="festival-tag-picker">
      <div className="festival-tag-list">
        {linked.map((festival) => (
          <span key={festival.id} className="festival-tag">
            {festival.name}
            <button
              type="button"
              className="festival-tag-remove"
              onClick={() => handleUnlink(festival.id)}
              disabled={busy}
              aria-label={`Remove ${festival.name}`}
            >
              ×
            </button>
          </span>
        ))}
        {linked.length === 0 && (
          <Text size="sm" muted>
            Not seen at any Festival yet.
          </Text>
        )}
      </div>

      {creating ? (
        <div className="festival-tag-creating">
          <Input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Festival name"
            disabled={busy}
            autoFocus
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleCreateAndLink}
            disabled={busy || !newName.trim()}
          >
            Add
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
      ) : (
        <select
          className="wl-input"
          value=""
          disabled={busy}
          onChange={(event) => {
            if (event.target.value === NEW_FESTIVAL_OPTION) {
              setCreating(true);
            } else if (event.target.value) {
              handleLink(event.target.value);
            }
          }}
        >
          <option value="">+ Add a Festival…</option>
          {available.map((festival) => (
            <option key={festival.id} value={festival.id}>
              {festival.name}
            </option>
          ))}
          <option value={NEW_FESTIVAL_OPTION}>+ Add a new Festival…</option>
        </select>
      )}
    </div>
  );
}
