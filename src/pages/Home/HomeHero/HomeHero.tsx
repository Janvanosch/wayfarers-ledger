import "./HomeHero.css";

import Heading from "../../../components/ui/Heading";

export default function HomeHero() {
  return (
    <section className="home-hero">
      <Heading level={1}>Where to today, Wayfarer?</Heading>

      <p>Welcome back to your personal festival ledger.</p>
    </section>
  );
}