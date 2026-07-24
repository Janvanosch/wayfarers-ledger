import "./HomePage.css";

import HomeHero from "./HomeHero/HomeHero";
import QuickActions from "./QuickActions/QuickActions";
import RecentJourney from "./RecentJourney/RecentJourney";

export default function HomePage() {
  return (
    <section className="home-page">
      <HomeHero />

      <QuickActions />

      <RecentJourney />
    </section>
  );
}