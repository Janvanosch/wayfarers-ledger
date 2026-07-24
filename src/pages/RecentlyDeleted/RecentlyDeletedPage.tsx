import { useEffect, useState } from "react";
import "./RecentlyDeletedPage.css";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Cover from "../../components/ui/Cover";

import type { RecentlyDeleted } from "../../types/ledger";

export default function RecentlyDeletedPage() {
  const [data, setData] = useState<RecentlyDeleted | "loading">("loading");

  async function refresh() {
    const result = await window.ledger.recentlyDeleted.list();
    setData(result);
  }

  useEffect(() => {
    window.ledger.recentlyDeleted.list().then(setData);
  }, []);

  async function handleRestoreGear(id: string) {
    await window.ledger.gear.restore(id);
    refresh();
  }

  async function handleRestoreMaker(id: string) {
    await window.ledger.makers.restore(id);
    refresh();
  }

  async function handleRestoreWishlist(id: string) {
    await window.ledger.wishlist.restore(id);
    refresh();
  }

  if (data === "loading") {
    return (
      <Container>
        <Text muted>Loading…</Text>
      </Container>
    );
  }

  const isEmpty =
    data.gear.length === 0 &&
    data.makers.length === 0 &&
    data.wishlist.length === 0;

  return (
    <Container>
      <div className="recently-deleted-page">
        <Stack gap={2}>
          <Heading level={1}>Recently Deleted</Heading>
          <Text muted>
            Nothing is gone for good. Restore anything deleted by mistake.
          </Text>
        </Stack>

        {isEmpty && (
          <Card>
            <Text muted>Nothing here right now.</Text>
          </Card>
        )}

        {data.gear.length > 0 && (
          <Stack gap={3}>
            <Heading level={3}>Gear</Heading>
            <div className="photo-grid">
              {data.gear.map((item) => (
                <div key={item.id} className="photo-card">
                  <Cover filename={item.coverPhotoFilename} alt={item.name} />
                  <div className="photo-card-body">
                    <Text>{item.name}</Text>
                    <Button
                      variant="secondary"
                      onClick={() => handleRestoreGear(item.id)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Stack>
        )}

        {data.makers.length > 0 && (
          <Stack gap={3}>
            <Heading level={3}>Makers</Heading>
            <div className="photo-grid">
              {data.makers.map((maker) => (
                <div key={maker.id} className="photo-card">
                  <Cover
                    filename={maker.logoPhotoFilename}
                    alt={maker.name}
                  />
                  <div className="photo-card-body">
                    <Text>{maker.name}</Text>
                    <Button
                      variant="secondary"
                      onClick={() => handleRestoreMaker(maker.id)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Stack>
        )}

        {data.wishlist.length > 0 && (
          <Stack gap={3}>
            <Heading level={3}>Wishlist</Heading>
            <div className="photo-grid">
              {data.wishlist.map((item) => (
                <div key={item.id} className="photo-card">
                  <Cover filename={item.coverPhotoFilename} alt={item.name} />
                  <div className="photo-card-body">
                    <Text>{item.name}</Text>
                    <Button
                      variant="secondary"
                      onClick={() => handleRestoreWishlist(item.id)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Stack>
        )}
      </div>
    </Container>
  );
}
