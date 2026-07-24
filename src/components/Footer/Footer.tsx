import "./Footer.css";

import { Link } from "react-router-dom";

import Text from "../ui/Text";
import Stack from "../ui/Stack";

export default function Footer() {
  return (
    <footer className="footer">
      <Stack direction="row" justify="between" align="center">
        <Text size="sm" muted>
          The Wayfarer's Ledger — v0.1.0
        </Text>
        <Link to="/recently-deleted">
          <Text size="sm" muted>
            Recently Deleted
          </Text>
        </Link>
      </Stack>
    </footer>
  );
}
