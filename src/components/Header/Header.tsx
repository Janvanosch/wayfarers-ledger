import "./Header.css";

import Heading from "../ui/Heading";

export default function Header() {
  return (
    <header className="header">
      <Heading level={2}>The Wayfarer's Ledger</Heading>
    </header>
  );
}