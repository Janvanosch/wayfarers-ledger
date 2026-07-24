import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MakerListPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import MakerForm from "./MakerForm";

import type { Maker, MakerFields } from "../../types/ledger";

export default function MakerListPage() {
  const [makers, setMakers] = useState<Maker[] | "loading">("loading");
  const [showAddForm, setShowAddForm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.ledger.makers.list().then(setMakers);
  }, []);

  async function handleCreate(fields: MakerFields) {
    setBusy(true);
    const created = await window.ledger.makers.create(fields);
    setBusy(false);
    setShowAddForm(false);
    setMakers((current) =>
      current === "loading" ? [created] : [created, ...current],
    );
  }

  return (
    <Container>
      <div className="maker-list-page">
        <Stack direction="row" justify="between" align="center">
          <Heading level={1}>Makers</Heading>
          {!showAddForm && (
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              + Add Maker
            </Button>
          )}
        </Stack>

        {showAddForm && (
          <Card>
            <MakerForm
              submitLabel="Add Maker"
              busy={busy}
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </Card>
        )}

        {makers === "loading" && <Text muted>Loading…</Text>}

        {makers !== "loading" && makers.length === 0 && !showAddForm && (
          <Card>
            <Text muted>
              No Makers yet. Every craftsperson behind your gear deserves a
              page of their own.
            </Text>
          </Card>
        )}

        {makers !== "loading" && makers.length > 0 && (
          <div className="photo-grid">
            {makers.map((maker) => (
              <Link
                key={maker.id}
                to={`/makers/${maker.id}`}
                className="photo-grid-item"
              >
                <div className="photo-card">
                  <Cover filename={maker.logoPhotoFilename} alt={maker.name} />
                  <div className="photo-card-body">
                    <Text>{maker.name}</Text>
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
