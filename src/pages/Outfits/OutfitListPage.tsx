import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OutfitListPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import OutfitForm from "./OutfitForm";

import type { Outfit, OutfitFields } from "../../types/ledger";

export default function OutfitListPage() {
  const [outfits, setOutfits] = useState<Outfit[] | "loading">("loading");
  const [showAddForm, setShowAddForm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.ledger.outfits.list().then(setOutfits);
  }, []);

  async function handleCreate(fields: OutfitFields) {
    setBusy(true);
    const created = await window.ledger.outfits.create(fields);
    setBusy(false);
    setShowAddForm(false);
    setOutfits((current) =>
      current === "loading" ? [created] : [created, ...current],
    );
  }

  return (
    <Container>
      <div className="outfit-list-page">
        <Stack direction="row" justify="between" align="center">
          <Heading level={1}>Outfits</Heading>
          {!showAddForm && (
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              + Add Outfit
            </Button>
          )}
        </Stack>

        {showAddForm && (
          <Card>
            <OutfitForm
              submitLabel="Add Outfit"
              busy={busy}
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </Card>
        )}

        {outfits === "loading" && <Text muted>Loading…</Text>}

        {outfits !== "loading" && outfits.length === 0 && !showAddForm && (
          <Card>
            <Text muted>
              No outfits yet. Every look starts with a single piece of Gear.
            </Text>
          </Card>
        )}

        {outfits !== "loading" && outfits.length > 0 && (
          <div className="photo-grid">
            {outfits.map((outfit) => (
              <Link
                key={outfit.id}
                to={`/outfits/${outfit.id}`}
                className="photo-grid-item"
              >
                <div className="photo-card">
                  <Cover
                    filename={outfit.coverPhotoFilename}
                    alt={outfit.name}
                  />
                  <div className="photo-card-body">
                    <Text>{outfit.name}</Text>
                    <Text size="sm" muted>
                      {outfit.currentVersion === 0
                        ? "No versions yet"
                        : `Version ${outfit.currentVersion}`}
                    </Text>
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
