import { useEffect, useState } from "react";
import "./RecentJourney.css";

import Heading from "../../../components/ui/Heading";
import Card from "../../../components/ui/Card";
import Text from "../../../components/ui/Text";
import TimelineList from "../../../shared/components/TimelineList";

import type { TimelineEvent } from "../../../types/ledger";

export default function RecentJourney() {
  const [events, setEvents] = useState<TimelineEvent[] | "loading">(
    "loading",
  );

  useEffect(() => {
    window.ledger.timeline.list(5).then(setEvents);
  }, []);

  return (
    <section className="recent-journey">
      <Heading level={3}>Recent Journey</Heading>

      {events !== "loading" && events.length > 0 ? (
        <Card>
          <TimelineList events={events} />
        </Card>
      ) : (
        <Card>
          <Text muted>
            No journeys recorded yet. Every journey begins with a single entry.
          </Text>
        </Card>
      )}
    </section>
  );
}
