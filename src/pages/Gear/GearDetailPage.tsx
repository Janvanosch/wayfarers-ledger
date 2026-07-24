import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./GearDetailPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import GearForm from "./GearForm";

import type { Gear, GearFields } from "../../types/ledger";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={1}>
      <Text size="sm" muted>
        {label}
      </Text>
      <Text>{value}</Text>
    </Stack>
  );
}

export default function GearDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Gear | "loading" | "not-found">("loading");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.ledger.gear.get(id).then((result) => setItem(result ?? "not-found"));
  }, [id]);

  async function handleUpdate(fields: GearFields) {
    if (!id) return;
    setBusy(true);
    const updated = await window.ledger.gear.update(id, fields);
    setBusy(false);
    setItem(updated);
    setEditing(false);
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
        <Text muted>This piece of Gear could not be found.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <div className="gear-detail-page">
        <Button variant="ghost" onClick={() => navigate("/gear")}>
          ← Back to Gear
        </Button>

        {editing ? (
          <GearForm
            initial={item}
            submitLabel="Save changes"
            busy={busy}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="gear-detail-hero">
              <Cover filename={item.coverPhotoFilename} alt={item.name} />
              <div className="gear-detail-hero-body">
                <Heading level={1}>{item.name}</Heading>
                {item.category && <Text muted>{item.category}</Text>}
                {item.makerId && item.makerName && (
                  <Link to={`/makers/${item.makerId}`}>
                    <Text muted>{item.makerName}</Text>
                  </Link>
                )}
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </div>
            </div>

            {(item.material || item.weight || item.colour || item.price) && (
              <Stack gap={3}>
                <Heading level={3}>Technical Details</Heading>
                <Stack direction="row" gap={6} wrap>
                  {item.material && (
                    <DetailField label="Material" value={item.material} />
                  )}
                  {item.colour && (
                    <DetailField label="Colour" value={item.colour} />
                  )}
                  {item.weight && (
                    <DetailField label="Weight" value={item.weight} />
                  )}
                  {item.price && (
                    <DetailField label="Price" value={item.price} />
                  )}
                </Stack>
              </Stack>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
