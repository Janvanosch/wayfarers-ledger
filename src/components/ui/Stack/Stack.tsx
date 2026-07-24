import "./Stack.css";

import type { CSSProperties, ReactNode } from "react";

type SpaceKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Alignment = "start" | "center" | "end" | "stretch";
type Justification = "start" | "center" | "end" | "between";

interface StackProps {
  direction?: "row" | "column";
  gap?: SpaceKey;
  align?: Alignment;
  justify?: Justification;
  wrap?: boolean;
  children: ReactNode;
}

export default function Stack({
  direction = "column",
  gap = 4,
  align,
  justify,
  wrap = false,
  children,
}: StackProps) {
  const className = [
    "wl-stack",
    `wl-stack-${direction}`,
    align ? `wl-stack-align-${align}` : "",
    justify ? `wl-stack-justify-${justify}` : "",
    wrap ? "wl-stack-wrap" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style = { "--stack-gap": `var(--space-${gap})` } as CSSProperties;

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
