import "./Container.css";

import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return <div className="wl-container">{children}</div>;
}