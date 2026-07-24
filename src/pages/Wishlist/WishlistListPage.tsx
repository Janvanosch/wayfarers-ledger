import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./WishlistListPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import WishlistForm from "./WishlistForm";

import type { WishlistItem, WishlistItemFields } from "../../types/ledger";

export default function WishlistListPage() {
  const [items, setItems] = useState<WishlistItem[] | "loading">("loading");
  const [showAddForm, setShowAddForm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.ledger.wishlist.list().then(setItems);
  }, []);

  async function handleCreate(fields: WishlistItemFields) {
    setBusy(true);
    const created = await window.ledger.wishlist.create(fields);
    setBusy(false);
    setShowAddForm(false);
    setItems((current) =>
      current === "loading" ? [created] : [created, ...current],
    );
  }

  return (
    <Container>
      <div className="wishlist-list-page">
        <Stack direction="row" justify="between" align="center">
          <Heading level={1}>Wishlist</Heading>
          {!showAddForm && (
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              + Add to Wishlist
            </Button>
          )}
        </Stack>

        <Text muted>
          Ideas for future Gear — remembering possibilities, not managing
          priorities.
        </Text>

        {showAddForm && (
          <Card>
            <WishlistForm
              submitLabel="Add to Wishlist"
              busy={busy}
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </Card>
        )}

        {items === "loading" && <Text muted>Loading…</Text>}

        {items !== "loading" && items.length === 0 && !showAddForm && (
          <Card>
            <Text muted>
              Nothing here yet. What are you dreaming of for next season?
            </Text>
          </Card>
        )}

        {items !== "loading" && items.length > 0 && (
          <div className="photo-grid">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/wishlist/${item.id}`}
                className="photo-grid-item"
              >
                <div className="photo-card">
                  <Cover filename={item.coverPhotoFilename} alt={item.name} />
                  <div className="photo-card-body">
                    <Text>
                      {item.isFavourite ? "★ " : ""}
                      {item.name}
                    </Text>
                    {item.makerName && (
                      <Text size="sm" muted>
                        {item.makerName}
                      </Text>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
