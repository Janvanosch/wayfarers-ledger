import "./AppShell.css";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import HomePage from "../pages/Home/HomePage";

export default function AppShell() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <HomePage />
      </main>

      <Footer />
    </div>
  );
}