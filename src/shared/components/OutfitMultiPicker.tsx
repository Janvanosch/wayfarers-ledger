import { useEffect, useState } from "react";
import "./OutfitMultiPicker.css";

import Text from "../../components/ui/Text";
import Cover from "../../components/ui/Cover";

import type { Outfit } from "../../types/ledger";

interface OutfitMultiPickerProps {
  selectedIds: Set<string>;
  onChange: (selectedIds: Set<string>) => void;
  disabled?: boolean;
}

export default function OutfitMultiPicker({
  selectedIds,
  onChange,
  disabled,
}: OutfitMultiPickerProps) {
  const [allOutfits, setAllOutfits] = useState<Outfit[]>([]);

  useEffect(() => {
    window.ledger.outfits.list().then(setAllOutfits);
  }, []);

  function toggle(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange(next);
  }

  if (allOutfits.length === 0) {
    return <Text muted>No Outfits in your Ledger yet.</Text>;
  }

  return (
    <div className="outfit-multi-picker">
      {allOutfits.map((outfit) => (
        <label key={outfit.id} className="outfit-multi-picker-row">
          <input
            type="checkbox"
            checked={selectedIds.has(outfit.id)}
            onChange={() => toggle(outfit.id)}
            disabled={disabled}
          />
          <Cover filename={outfit.coverPhotoFilename} alt={outfit.name} />
          <Text size="sm">{outfit.name}</Text>
        </label>
      ))}
    </div>
  );
}
