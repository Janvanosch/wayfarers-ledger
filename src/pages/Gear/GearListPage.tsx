import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GearListPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import GearForm from "./GearForm";

import type { Gear, GearFields } from "../../types/ledger";

export default function GearListPage() {
  const [gearItems, setGearItems] = useState<Gear[] | "loading">("loading");
  const [showAddForm, setShowAddForm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.ledger.gear.list().then(setGearItems);
  }, []);

  async function handleCreate(fields: GearFields) {
    setBusy(true);
    const created = await window.ledger.gear.create(fields);
    setBusy(false);
    setShowAddForm(false);
    setGearItems((current) =>
      current === "loading" ? [created] : [created, ...current],
    );
  }

  return (
    <Container>
      <div className="gear-list-page">
        <Stack direction="row" justify="between" align="center">
          <Heading level={1}>Gear</Heading>
          {!showAddForm && (
            <Stack direction="row" gap={3}>
              <Link to="/makers">
                <Button variant="ghost">Makers</Button>
              </Link>
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                + Add Gear
              </Button>
            </Stack>
          )}
        </Stack>

        {showAddForm && (
          <Card>
            <GearForm
              submitLabel="Add to my Gear"
              busy={busy}
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </Card>
        )}

        {gearItems === "loading" && <Text muted>Loading your gear…</Text>}

        {gearItems !== "loading" && gearItems.length === 0 && !showAddForm && (
          <Card>
            <Text muted>
              Your Ledger is empty. Every journey begins with a single entry.
            </Text>
          </Card>
        )}

        {gearItems !== "loading" && gearItems.length > 0 && (
          <div className="photo-grid">
            {gearItems.map((item) => (
              <Link
                key={item.id}
                to={`/gear/${item.id}`}
                className="photo-grid-item"
              >
                <div className="photo-card">
                  <Cover filename={item.coverPhotoFilename} alt={item.name} />
                  <div className="photo-card-body">
                    <Text>{item.name}</Text>
                    {item.category && (
                      <Text size="sm" muted>
                        {item.category}
                      </Text>
                    )}
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
