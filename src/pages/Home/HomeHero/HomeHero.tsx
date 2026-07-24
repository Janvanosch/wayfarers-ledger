import "./HomeHero.css";

import Heading from "../../../components/ui/Heading";
import Text from "../../../components/ui/Text";
import { useWayfarer } from "../../../shared/context/WayfarerContext";

export default function HomeHero() {
  const wayfarer = useWayfarer();

  return (
    <section className="home-hero">
      <Heading level={1}>Where to today, Wayfarer?</Heading>

      <Text size="lg" muted>
        {wayfarer
          ? `Welcome back, ${wayfarer.name}.`
          : "Welcome back to your personal festival ledger."}
      </Text>
    </section>
  );
}