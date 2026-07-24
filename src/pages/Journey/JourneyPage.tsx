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
import JournalEntryForm from "./JournalEntryForm";
import JournalEntryCard from "./JournalEntryCard";

import type {
  Festival,
  FestivalFields,
  JournalEntry,
  JournalEntryFields,
} from "../../types/ledger";

export default function JourneyPage() {
  const [festivals, setFestivals] = useState<Festival[] | "loading">(
    "loading",
  );
  const [showAddFestivalForm, setShowAddFestivalForm] = useState(false);
  const [festivalBusy, setFestivalBusy] = useState(false);

  const [entries, setEntries] = useState<JournalEntry[] | "loading">(
    "loading",
  );
  const [showAddEntryForm, setShowAddEntryForm] = useState(false);
  const [entryBusy, setEntryBusy] = useState(false);

  useEffect(() => {
    window.ledger.festivals.list().then(setFestivals);
    window.ledger.journal.list().then(setEntries);
  }, []);

  async function handleCreateFestival(fields: FestivalFields) {
    setFestivalBusy(true);
    const created = await window.ledger.festivals.create(fields);
    setFestivalBusy(false);
    setShowAddFestivalForm(false);
    setFestivals((current) =>
      current === "loading" ? [created] : [created, ...current],
    );
  }

  async function handleCreateEntry(fields: JournalEntryFields) {
    setEntryBusy(true);
    const created = await window.ledger.journal.create(fields);
    setEntryBusy(false);
    setShowAddEntryForm(false);
    setEntries((current) =>
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
          {!showAddFestivalForm && (
            <Button
              variant="primary"
              onClick={() => setShowAddFestivalForm(true)}
            >
              + Add Festival
            </Button>
          )}
        </Stack>

        {showAddFestivalForm && (
          <Card>
            <FestivalForm
              submitLabel="Add Festival"
              busy={festivalBusy}
              onSubmit={handleCreateFestival}
              onCancel={() => setShowAddFestivalForm(false)}
            />
          </Card>
        )}

        {festivals === "loading" && <Text muted>Loading…</Text>}

        {festivals !== "loading" &&
          festivals.length === 0 &&
          !showAddFestivalForm && (
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

        <Stack direction="row" justify="between" align="center">
          <Heading level={3}>Journal</Heading>
          {!showAddEntryForm && (
            <Button
              variant="primary"
              onClick={() => setShowAddEntryForm(true)}
            >
              + Add Entry
            </Button>
          )}
        </Stack>

        {showAddEntryForm && (
          <Card>
            <JournalEntryForm
              submitLabel="Save Entry"
              busy={entryBusy}
              onSubmit={handleCreateEntry}
              onCancel={() => setShowAddEntryForm(false)}
            />
          </Card>
        )}

        {entries === "loading" && <Text muted>Loading…</Text>}

        {entries !== "loading" && entries.length === 0 && !showAddEntryForm && (
          <Card>
            <Text muted>
              Nothing written yet. Every journey begins with a single entry.
            </Text>
          </Card>
        )}

        {entries !== "loading" && entries.length > 0 && (
          <Stack gap={3}>
            {entries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} showFestival />
            ))}
          </Stack>
        )}
      </div>
    </Container>
  );
}
