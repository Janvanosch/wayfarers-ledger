import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./MakerDetailPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import MakerForm from "./MakerForm";

import type { Gear, Maker, MakerFields } from "../../types/ledger";

export default function MakerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [maker, setMaker] = useState<Maker | "loading" | "not-found">(
    "loading",
  );
  const [gearItems, setGearItems] = useState<Gear[]>([]);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.ledger.makers.get(id).then((result) => setMaker(result ?? "not-found"));
    window.ledger.makers.gearFor(id).then(setGearItems);
  }, [id]);

  async function handleUpdate(fields: MakerFields) {
    if (!id) return;
    setBusy(true);
    const updated = await window.ledger.makers.update(id, fields);
    setBusy(false);
    setMaker(updated);
    setEditing(false);
  }

  async function handleDelete() {
    if (!id) return;
    const confirmed = window.confirm(
      "Delete this Maker? You can restore it later from Recently Deleted.",
    );
    if (!confirmed) return;

    await window.ledger.makers.delete(id);
    navigate("/makers");
  }

  if (maker === "loading") {
    return (
      <Container>
        <Text muted>Loading…</Text>
      </Container>
    );
  }

  if (maker === "not-found") {
    return (
      <Container>
        <Text muted>This Maker could not be found.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <div className="maker-detail-page">
        <Button variant="ghost" onClick={() => navigate("/makers")}>
          ← Back to Makers
        </Button>

        {editing ? (
          <MakerForm
            initial={maker}
            submitLabel="Save changes"
            busy={busy}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="maker-detail-hero">
              <Cover filename={maker.logoPhotoFilename} alt={maker.name} />
              <div className="maker-detail-hero-body">
                <Heading level={1}>{maker.name}</Heading>
                {maker.website && (
                  <Text muted>
                    <a href={maker.website} target="_blank" rel="noreferrer">
                      {maker.website}
                    </a>
                  </Text>
                )}
                {maker.instagram && <Text muted>{maker.instagram}</Text>}
                {maker.notes && <Text>{maker.notes}</Text>}
                <Stack direction="row" gap={3}>
                  <Button variant="secondary" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={handleDelete}>
                    Delete
                  </Button>
                </Stack>
              </div>
            </div>

            <Stack gap={3}>
              <Heading level={3}>Gear from {maker.name}</Heading>
              {gearItems.length === 0 ? (
                <Text muted>Nothing from this Maker yet.</Text>
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
          </>
        )}
      </div>
    </Container>
  );
}
