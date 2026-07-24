import "./Header.css";

import { Link } from "react-router-dom";

import Heading from "../ui/Heading";

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-home-link">
        <Heading level={2}>The Wayfarer's Ledger</Heading>
      </Link>
    </header>
  );
}
