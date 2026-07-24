import { useEffect, useState } from "react";
import "./GearMultiPicker.css";

import Text from "../../components/ui/Text";
import Cover from "../../components/ui/Cover";

import type { Gear } from "../../types/ledger";

interface GearMultiPickerProps {
  selectedIds: Set<string>;
  onChange: (selectedIds: Set<string>) => void;
  disabled?: boolean;
}

export default function GearMultiPicker({
  selectedIds,
  onChange,
  disabled,
}: GearMultiPickerProps) {
  const [allGear, setAllGear] = useState<Gear[]>([]);

  useEffect(() => {
    window.ledger.gear.list().then(setAllGear);
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

  if (allGear.length === 0) {
    return <Text muted>No Gear in your Ledger yet — add some Gear first.</Text>;
  }

  return (
    <div className="gear-multi-picker">
      {allGear.map((item) => (
        <label key={item.id} className="gear-multi-picker-row">
          <input
            type="checkbox"
            checked={selectedIds.has(item.id)}
            onChange={() => toggle(item.id)}
            disabled={disabled}
          />
          <Cover filename={item.coverPhotoFilename} alt={item.name} />
          <Text size="sm">{item.name}</Text>
        </label>
      ))}
    </div>
  );
}
