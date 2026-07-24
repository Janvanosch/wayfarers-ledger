import "./MultiPhotoPicker.css";

import Stack from "../../components/ui/Stack";
import Button from "../../components/ui/Button";

interface MultiPhotoPickerProps {
  paths: string[];
  onChange: (paths: string[]) => void;
  disabled?: boolean;
}

export default function MultiPhotoPicker({
  paths,
  onChange,
  disabled,
}: MultiPhotoPickerProps) {
  async function handleAdd() {
    const path = await window.ledger.photos.pickFile();
    if (path) onChange([...paths, path]);
  }

  function handleRemove(index: number) {
    onChange(paths.filter((_, i) => i !== index));
  }

  return (
    <Stack gap={2}>
      {paths.length > 0 && (
        <div className="multi-photo-picker-list">
          {paths.map((path, index) => (
            <span key={`${path}-${index}`} className="multi-photo-picker-chip">
              {path.split(/[\\/]/).pop()}
              <button
                type="button"
                className="multi-photo-picker-remove"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                aria-label="Remove photo"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <Button type="button" variant="secondary" onClick={handleAdd} disabled={disabled}>
        + Add Photo
      </Button>
    </Stack>
  );
}
