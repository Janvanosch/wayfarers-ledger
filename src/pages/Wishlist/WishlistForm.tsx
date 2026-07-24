import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "./WishlistForm.css";

import Stack from "../../components/ui/Stack";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";
import MakerPicker from "../../shared/components/MakerPicker";

import type { WishlistItem, WishlistItemFields } from "../../types/ledger";

interface WishlistFormProps {
  initial?: WishlistItem;
  submitLabel: string;
  busy: boolean;
  onSubmit: (fields: WishlistItemFields) => void;
  onCancel: () => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="wishlist-form-field">
      <Text size="sm" muted>
        {label}
      </Text>
      {children}
    </label>
  );
}

export default function WishlistForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: WishlistFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [makerId, setMakerId] = useState<string | null>(
    initial?.makerId ?? null,
  );
  const [isFavourite, setIsFavourite] = useState(initial?.isFavourite ?? false);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [photoLabel, setPhotoLabel] = useState<string | null>(null);
  const [fetchingImage, setFetchingImage] = useState(false);
  const [fetchImageError, setFetchImageError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePickPhoto() {
    const path = await window.ledger.photos.pickFile();
    if (path) {
      setPhotoPath(path);
      setPhotoLabel(path.split(/[\\/]/).pop() ?? path);
    }
  }

  async function handleFetchImageFromUrl() {
    if (!url.trim()) return;
    setFetchingImage(true);
    setFetchImageError(null);
    const result = await window.ledger.wishlist.fetchImageFromUrl(url.trim());
    setFetchingImage(false);

    if (!result.success || !result.photoPath) {
      setFetchImageError(result.error ?? "Couldn't find a photo at that link.");
      return;
    }
    setPhotoPath(result.photoPath);
    setPhotoLabel("Fetched from link");
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
      makerId,
      isFavourite,
      notes: notes.trim() || null,
      url: url.trim() || null,
      photoPath,
    });
  }

  return (
    <form className="wishlist-form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && <Text size="sm">{error}</Text>}

        <Field label="Name">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. A proper leather satchel"
            disabled={busy}
            autoFocus
          />
        </Field>

        <Field label="Link (optional)">
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://…"
            disabled={busy}
          />
        </Field>

        <Field label="Maker">
          <MakerPicker value={makerId} onChange={setMakerId} disabled={busy} />
        </Field>

        <Stack direction="row" gap={3} wrap>
          <Button
            type="button"
            variant="secondary"
            onClick={handlePickPhoto}
            disabled={busy}
          >
            {photoLabel ? `Photo: ${photoLabel}` : "Add a photo"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleFetchImageFromUrl}
            disabled={busy || fetchingImage || !url.trim()}
          >
            {fetchingImage ? "Fetching…" : "Fetch photo from link"}
          </Button>
        </Stack>
        {fetchImageError && <Text size="sm">{fetchImageError}</Text>}

        <label className="wishlist-form-favourite">
          <input
            type="checkbox"
            checked={isFavourite}
            onChange={(event) => setIsFavourite(event.target.checked)}
            disabled={busy}
          />
          <Text size="sm">Favourite</Text>
        </label>

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
