import "./HomeHero.css";

import Heading from "../../../components/ui/Heading";
import Text from "../../../components/ui/Text";

export default function HomeHero() {
  return (
    <section className="home-hero">
      <Heading level={1}>Where to today, Wayfarer?</Heading>

      <Text size="lg" muted>
        Welcome back to your personal festival ledger.
      </Text>
    </section>
  );
}