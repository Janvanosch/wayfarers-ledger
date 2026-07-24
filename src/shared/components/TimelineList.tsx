import { Link } from "react-router-dom";
import "./TimelineList.css";

import Text from "../../components/ui/Text";
import Stack from "../../components/ui/Stack";
import { formatDate } from "../utils/formatDate";

import type { TimelineEvent } from "../../types/ledger";

function relatedPath(
  relatedType: string | null,
  relatedId: string | null,
): string | null {
  if (!relatedType || !relatedId) return null;
  switch (relatedType) {
    case "gear":
      return `/gear/${relatedId}`;
    case "festival":
      return `/festivals/${relatedId}`;
    case "outfit":
      return `/outfits/${relatedId}`;
    default:
      return null;
  }
}

interface TimelineListProps {
  events: TimelineEvent[];
}

export default function TimelineList({ events }: TimelineListProps) {
  return (
    <Stack gap={1}>
      {events.map((event) => {
        const path = relatedPath(event.relatedType, event.relatedId);
        const row = (
          <Stack direction="row" justify="between" align="center">
            <Text>{event.title}</Text>
            <Text size="sm" muted>
              {formatDate(event.occurredAt)}
            </Text>
          </Stack>
        );

        return (
          <div key={event.id} className="timeline-list-row">
            {path ? <Link to={path}>{row}</Link> : row}
          </div>
        );
      })}
    </Stack>
  );
}
