import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./WishlistDetailPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import WishlistForm from "./WishlistForm";

import type { WishlistItem, WishlistItemFields } from "../../types/ledger";

export default function WishlistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<WishlistItem | "loading" | "not-found">(
    "loading",
  );
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.ledger.wishlist
      .get(id)
      .then((result) => setItem(result ?? "not-found"));
  }, [id]);

  async function handleUpdate(fields: WishlistItemFields) {
    if (!id) return;
    setBusy(true);
    const updated = await window.ledger.wishlist.update(id, fields);
    setBusy(false);
    setItem(updated);
    setEditing(false);
  }

  async function handleConvert() {
    if (!id) return;
    const confirmed = window.confirm(
      "Convert this to a real Gear item? It will move out of your Wishlist.",
    );
    if (!confirmed) return;

    setBusy(true);
    const created = await window.ledger.wishlist.convertToGear(id);
    setBusy(false);
    navigate(`/gear/${created.id}`);
  }

  async function handleDelete() {
    if (!id) return;
    const confirmed = window.confirm(
      "Delete this Wishlist item? You can restore it later from Recently Deleted.",
    );
    if (!confirmed) return;

    await window.ledger.wishlist.delete(id);
    navigate("/wishlist");
  }

  if (item === "loading") {
    return (
      <Container>
        <Text muted>Loading…</Text>
      </Container>
    );
  }

  if (item === "not-found") {
    return (
      <Container>
        <Text muted>This Wishlist item could not be found.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <div className="wishlist-detail-page">
        <Button variant="ghost" onClick={() => navigate("/wishlist")}>
          ← Back to Wishlist
        </Button>

        {editing ? (
          <WishlistForm
            initial={item}
            submitLabel="Save changes"
            busy={busy}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="wishlist-detail-hero">
            <Cover filename={item.coverPhotoFilename} alt={item.name} />
            <div className="wishlist-detail-hero-body">
              <Heading level={1}>
                {item.isFavourite ? "★ " : ""}
                {item.name}
              </Heading>
              {item.makerId && item.makerName && (
                <Link to={`/makers/${item.makerId}`}>
                  <Text muted>{item.makerName}</Text>
                </Link>
              )}
              {item.url && (
                <a href={item.url} target="_blank" rel="noreferrer">
                  <Text muted>{item.url}</Text>
                </a>
              )}
              {item.notes && <Text>{item.notes}</Text>}
              <Stack direction="row" gap={3}>
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConvert}
                  disabled={busy}
                >
                  ✨ Convert to Gear
                </Button>
                <Button variant="ghost" onClick={handleDelete} disabled={busy}>
                  Delete
                </Button>
              </Stack>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
