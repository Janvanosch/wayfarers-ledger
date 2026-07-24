import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./OutfitDetailPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";
import OutfitForm from "./OutfitForm";
import OutfitVersionForm from "./OutfitVersionForm";
import { formatDate } from "../../shared/utils/formatDate";

import type {
  Gear,
  Outfit,
  OutfitFields,
  OutfitVersion,
  OutfitVersionFields,
} from "../../types/ledger";

export default function OutfitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState<Outfit | "loading" | "not-found">(
    "loading",
  );
  const [currentGear, setCurrentGear] = useState<Gear[]>([]);
  const [versions, setVersions] = useState<OutfitVersion[]>([]);
  const [editingMeta, setEditingMeta] = useState(false);
  const [addingVersion, setAddingVersion] = useState(false);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!id) return;
    const [outfitResult, gearResult, versionsResult] = await Promise.all([
      window.ledger.outfits.get(id),
      window.ledger.outfits.currentGear(id),
      window.ledger.outfits.versions(id),
    ]);
    setOutfit(outfitResult ?? "not-found");
    setCurrentGear(gearResult);
    setVersions(versionsResult);
  }

  useEffect(() => {
    if (!id) return;
    window.ledger.outfits
      .get(id)
      .then((result) => setOutfit(result ?? "not-found"));
    window.ledger.outfits.currentGear(id).then(setCurrentGear);
    window.ledger.outfits.versions(id).then(setVersions);
  }, [id]);

  async function handleUpdateMeta(fields: OutfitFields) {
    if (!id) return;
    setBusy(true);
    await window.ledger.outfits.update(id, fields);
    setBusy(false);
    setEditingMeta(false);
    refresh();
  }

  async function handleCreateVersion(fields: OutfitVersionFields) {
    if (!id) return;
    setBusy(true);
    await window.ledger.outfits.createVersion(id, fields);
    setBusy(false);
    setAddingVersion(false);
    refresh();
  }

  if (outfit === "loading") {
    return (
      <Container>
        <Text muted>Loading…</Text>
      </Container>
    );
  }

  if (outfit === "not-found") {
    return (
      <Container>
        <Text muted>This Outfit could not be found.</Text>
      </Container>
    );
  }

  const latestVersion = versions[0] ?? null;
  const pastVersions = versions.slice(1);

  return (
    <Container>
      <div className="outfit-detail-page">
        <Button variant="ghost" onClick={() => navigate("/outfits")}>
          ← Back to Outfits
        </Button>

        {editingMeta ? (
          <OutfitForm
            initial={outfit}
            submitLabel="Save changes"
            busy={busy}
            onSubmit={handleUpdateMeta}
            onCancel={() => setEditingMeta(false)}
          />
        ) : (
          <div className="outfit-detail-hero">
            <Cover filename={outfit.coverPhotoFilename} alt={outfit.name} />
            <div className="outfit-detail-hero-body">
              <Heading level={1}>{outfit.name}</Heading>
              <Text muted>
                {outfit.currentVersion === 0
                  ? "No versions yet"
                  : `Version ${outfit.currentVersion}`}
              </Text>
              <Button variant="secondary" onClick={() => setEditingMeta(true)}>
                Edit
              </Button>
            </div>
          </div>
        )}

        {addingVersion ? (
          <Card>
            <OutfitVersionForm
              initialGearIds={currentGear.map((item) => item.id)}
              initialNotes={latestVersion?.notes ?? null}
              submitLabel={
                outfit.currentVersion === 0
                  ? "Save as Version 1"
                  : `Save as Version ${outfit.currentVersion + 1}`
              }
              busy={busy}
              onSubmit={handleCreateVersion}
              onCancel={() => setAddingVersion(false)}
            />
          </Card>
        ) : (
          !editingMeta && (
            <Stack gap={3}>
              <Stack direction="row" justify="between" align="center">
                <Heading level={3}>Current Gear</Heading>
                <Button
                  variant="secondary"
                  onClick={() => setAddingVersion(true)}
                >
                  + New Version
                </Button>
              </Stack>

              {currentGear.length === 0 ? (
                <Card>
                  <Text muted>
                    This Outfit doesn't have any Gear yet. Start a version to
                    add some.
                  </Text>
                </Card>
              ) : (
                <div className="photo-grid">
                  {currentGear.map((item) => (
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
          )
        )}

        {pastVersions.length > 0 && !editingMeta && !addingVersion && (
          <Stack gap={3}>
            <Heading level={3}>Version History</Heading>
            <Stack gap={3}>
              {pastVersions.map((version) => (
                <Card key={version.id}>
                  <Stack gap={2}>
                    <Stack direction="row" justify="between" align="center">
                      <Text>Version {version.version}</Text>
                      <Text size="sm" muted>
                        {formatDate(version.createdAt)}
                      </Text>
                    </Stack>
                    {version.notes && <Text size="sm">{version.notes}</Text>}
                    <Text size="sm" muted>
                      {version.gear.length === 0
                        ? "No gear in this version"
                        : version.gear.map((item) => item.name).join(", ")}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        )}
      </div>
    </Container>
  );
}
