import "./RecentJourney.css";

import Heading from "../../../components/ui/Heading";
import Card from "../../../components/ui/Card";
import Text from "../../../components/ui/Text";

export default function RecentJourney() {
  return (
    <section className="recent-journey">
      <Heading level={3}>Recent Journey</Heading>

      <Card>
        <Text muted>
          No journeys recorded yet. Every journey begins with a single entry.
        </Text>
      </Card>
    </section>
  );
}