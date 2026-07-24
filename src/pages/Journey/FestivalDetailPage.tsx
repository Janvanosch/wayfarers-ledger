import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./FestivalDetailPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Cover from "../../components/ui/Cover";
import FestivalForm from "./FestivalForm";
import JournalEntryForm from "./JournalEntryForm";
import JournalEntryCard from "./JournalEntryCard";

import type {
  Festival,
  FestivalFields,
  Gear,
  JournalEntry,
  JournalEntryFields,
} from "../../types/ledger";

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  if (start && end && start !== end) return `${start} – ${end}`;
  return start ?? end;
}

export default function FestivalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [festival, setFestival] = useState<Festival | "loading" | "not-found">(
    "loading",
  );
  const [gearItems, setGearItems] = useState<Gear[]>([]);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddEntryForm, setShowAddEntryForm] = useState(false);
  const [entryBusy, setEntryBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.ledger.festivals
      .get(id)
      .then((result) => setFestival(result ?? "not-found"));
    window.ledger.festivals.gearFor(id).then(setGearItems);
    window.ledger.journal.listForFestival(id).then(setEntries);
  }, [id]);

  async function handleUpdate(fields: FestivalFields) {
    if (!id) return;
    setBusy(true);
    const updated = await window.ledger.festivals.update(id, fields);
    setBusy(false);
    setFestival(updated);
    setEditing(false);
  }

  async function handleCreateEntry(fields: JournalEntryFields) {
    setEntryBusy(true);
    const created = await window.ledger.journal.create(fields);
    setEntryBusy(false);
    setShowAddEntryForm(false);
    setEntries((current) => [created, ...current]);
  }

  if (festival === "loading") {
    return (
      <Container>
        <Text muted>Loading…</Text>
      </Container>
    );
  }

  if (festival === "not-found") {
    return (
      <Container>
        <Text muted>This Festival could not be found.</Text>
      </Container>
    );
  }

  const dateRange = formatDateRange(festival.startDate, festival.endDate);

  return (
    <Container>
      <div className="festival-detail-page">
        <Button variant="ghost" onClick={() => navigate("/journey")}>
          ← Back to Journey
        </Button>

        {editing ? (
          <FestivalForm
            initial={festival}
            submitLabel="Save changes"
            busy={busy}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="festival-detail-hero">
              <Cover
                filename={festival.coverPhotoFilename}
                alt={festival.name}
              />
              <div className="festival-detail-hero-body">
                <Heading level={1}>{festival.name}</Heading>
                {dateRange && <Text muted>{dateRange}</Text>}
                {festival.location && <Text muted>{festival.location}</Text>}
                {festival.weather && <Text muted>{festival.weather}</Text>}
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </div>
            </div>

            {festival.notes && (
              <Stack gap={2}>
                <Heading level={3}>Notes</Heading>
                <Text>{festival.notes}</Text>
              </Stack>
            )}

            <Stack gap={3}>
              <Heading level={3}>Gear worn here</Heading>
              {gearItems.length === 0 ? (
                <Text muted>
                  No gear linked yet. Add this Festival from a piece of
                  Gear's "Seen at" section.
                </Text>
              ) : (
                <div className="photo-grid">
                  {gearItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/gear/${item.id}`}
                      className="photo-grid-item"
                    >
                      <div className="photo-card">
                        <Cover
                          filename={item.coverPhotoFilename}
                          alt={item.name}
                        />
                        <div className="photo-card-body">
                          <Text>{item.name}</Text>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Stack>

            <Stack gap={3}>
              <Stack direction="row" justify="between" align="center">
                <Heading level={3}>Memories</Heading>
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
                    lockedFestivalId={festival.id}
                    submitLabel="Save Entry"
                    busy={entryBusy}
                    onSubmit={handleCreateEntry}
                    onCancel={() => setShowAddEntryForm(false)}
                  />
                </Card>
              )}

              {entries.length === 0 && !showAddEntryForm ? (
                <Text muted>No memories written for this Festival yet.</Text>
              ) : (
                <Stack gap={3}>
                  {entries.map((entry) => (
                    <JournalEntryCard key={entry.id} entry={entry} />
                  ))}
                </Stack>
              )}
            </Stack>
          </>
        )}
      </div>
    </Container>
  );
}
