import "./HomePage.css";

import Container from "../../components/ui/Container";

import HomeHero from "./HomeHero/HomeHero";
import QuickActions from "./QuickActions/QuickActions";
import RecentJourney from "./RecentJourney/RecentJourney";

export default function HomePage() {
  return (
    <Container>
      <section className="home-page">
        <HomeHero />

        <QuickActions />

        <RecentJourney />
      </section>
    </Container>
  );
}