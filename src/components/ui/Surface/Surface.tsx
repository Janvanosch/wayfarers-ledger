import "./Surface.css";

import type { CSSProperties, ReactNode } from "react";

type SpaceKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface SurfaceProps {
  padding?: SpaceKey;
  children: ReactNode;
}

export default function Surface({ padding = 5, children }: SurfaceProps) {
  const style = { padding: `var(--space-${padding})` } as CSSProperties;

  return (
    <div className="wl-surface" style={style}>
      {children}
    </div>
  );
}
