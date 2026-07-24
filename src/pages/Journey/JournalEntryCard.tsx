import { Link } from "react-router-dom";
import "./JournalEntryCard.css";

import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import Cover from "../../components/ui/Cover";
import { formatDate } from "../../shared/utils/formatDate";

import type { JournalEntry } from "../../types/ledger";

interface JournalEntryCardProps {
  entry: JournalEntry;
  showFestival?: boolean;
}

export default function JournalEntryCard({
  entry,
  showFestival,
}: JournalEntryCardProps) {
  return (
    <Card>
      <Stack gap={3}>
        <Stack direction="row" justify="between" align="center">
          {entry.title ? (
            <Heading level={4}>{entry.title}</Heading>
          ) : (
            <Text muted>Untitled</Text>
          )}
          <Text size="sm" muted>
            {formatDate(entry.createdAt)}
          </Text>
        </Stack>

        {showFestival && entry.festivalId && entry.festivalName && (
          <Link to={`/festivals/${entry.festivalId}`}>
            <Text size="sm" muted>
              {entry.festivalName}
            </Text>
          </Link>
        )}

        <Text>{entry.body}</Text>

        {entry.photos.length > 0 && (
          <div className="journal-entry-card-photos">
            {entry.photos.map((photo) => (
              <Cover key={photo.id} filename={photo.filename} alt="" />
            ))}
          </div>
        )}

        {(entry.gear.length > 0 || entry.outfits.length > 0) && (
          <Stack direction="row" gap={3} wrap>
            {entry.gear.map((item) => (
              <Link key={item.id} to={`/gear/${item.id}`}>
                <Text size="sm" muted>
                  🎒 {item.name}
                </Text>
              </Link>
            ))}
            {entry.outfits.map((outfit) => (
              <Link key={outfit.id} to={`/outfits/${outfit.id}`}>
                <Text size="sm" muted>
                  🛡 {outfit.name}
                </Text>
              </Link>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
