import "./QuickActions.css";

import { useNavigate } from "react-router-dom";

import Heading from "../../../components/ui/Heading";
import Stack from "../../../components/ui/Stack";
import Button from "../../../components/ui/Button";

const actions = [
  { label: "View Gear", icon: "🎒", to: "/gear" },
  { label: "Journey", icon: "🗺", to: "/journey" },
  { label: "Packing Lists", icon: "📦", to: null },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="quick-actions">
      <Heading level={3}>Quick Actions</Heading>

      <Stack direction="row" gap={3} wrap>
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="secondary"
            disabled={!action.to}
            onClick={() => action.to && navigate(action.to)}
          >
            {action.icon} {action.label}
          </Button>
        ))}
      </Stack>
    </section>
  );
}
