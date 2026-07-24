import "./QuickActions.css";

import Heading from "../../../components/ui/Heading";
import Stack from "../../../components/ui/Stack";
import Button from "../../../components/ui/Button";

const actions = [
  { label: "View Gear", icon: "🎒" },
  { label: "Packing Lists", icon: "📦" },
  { label: "Festivals", icon: "🗺" },
];

export default function QuickActions() {
  return (
    <section className="quick-actions">
      <Heading level={3}>Quick Actions</Heading>

      <Stack direction="row" gap={3} wrap>
        {actions.map((action) => (
          <Button key={action.label} variant="secondary">
            {action.icon} {action.label}
          </Button>
        ))}
      </Stack>
    </section>
  );
}