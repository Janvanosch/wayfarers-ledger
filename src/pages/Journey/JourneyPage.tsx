import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./JourneyPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import FestivalForm from "./FestivalForm";

import type { Festival, FestivalFields } from "../../types/ledger";

export default function JourneyPage() {
  const [festivals, setFestivals] = useState<Festival[] | "loading">(
    "loading",
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.ledger.festivals.list().then(setFestivals);
  }, []);

  async function handleCreate(fields: FestivalFields) {
    setBusy(true);
    const created = await window.ledger.festivals.create(fields);
    setBusy(false);
    setShowAddForm(false);
    setFestivals((current) =>
      current === "loading" ? [created] : [created, ...current],
    );
  }

  return (
    <Container>
      <div className="journey-page">
        <Stack gap={2}>
          <Heading level={1}>Journey</Heading>
          <Text muted>
            The chronological history of your Journey — festivals, memories,
            and everything in between.
          </Text>
        </Stack>

        <Stack direction="row" justify="between" align="center">
          <Heading level={3}>Festivals</Heading>
          {!showAddForm && (
            <Button variant="primary" onClick={() => setShowAddForm(true)}>
              + Add Festival
            </Button>
          )}
        </Stack>

        {showAddForm && (
          <Card>
            <FestivalForm
              submitLabel="Add Festival"
              busy={busy}
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </Card>
        )}

        {festivals === "loading" && <Text muted>Loading…</Text>}

        {festivals !== "loading" && festivals.length === 0 && !showAddForm && (
          <Card>
            <Text muted>Your next adventure has yet to be written.</Text>
          </Card>
        )}

        {festivals !== "loading" && festivals.length > 0 && (
          <div className="photo-grid">
            {festivals.map((festival) => (
              <Link
                key={festival.id}
                to={`/festivals/${festival.id}`}
                className="photo-grid-item"
              >
                <div className="photo-card">
                  <Cover
                    filename={festival.coverPhotoFilename}
                    alt={festival.name}
                  />
                  <div className="photo-card-body">
                    <Text>{festival.name}</Text>
                    {festival.startDate && (
                      <Text size="sm" muted>
                        {festival.startDate}
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
