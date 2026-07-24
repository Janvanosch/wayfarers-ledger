import "./Card.css";

import type { ReactNode } from "react";

interface CardProps {
  interactive?: boolean;
  children: ReactNode;
}

export default function Card({ interactive = false, children }: CardProps) {
  const className = [
    "wl-card",
    interactive ? "wl-card-interactive" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>{children}</div>;
}
