import "./AppShell.css";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import AppRoutes from "./AppRoutes";

export default function AppShell() {
  return (
    <div className="app-shell">
      <Header />

<main>
  <AppRoutes />
</main>

      <Footer />
    </div>
  );
}