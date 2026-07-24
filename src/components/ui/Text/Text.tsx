import "./Text.css";

import type { ReactNode } from "react";

interface TextProps {
  as?: "p" | "span";
  size?: "sm" | "md" | "lg";
  muted?: boolean;
  children: ReactNode;
}

export default function Text({
  as: Component = "p",
  size = "md",
  muted = false,
  children,
}: TextProps) {
  const className = [
    "wl-text",
    `wl-text-${size}`,
    muted ? "wl-text-muted" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={className}>{children}</Component>;
}
