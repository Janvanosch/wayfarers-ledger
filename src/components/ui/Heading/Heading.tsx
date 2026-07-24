import "./Heading.css";

import type { ReactNode } from "react";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}

export default function Heading({
  level = 1,
  children,
}: HeadingProps) {
  switch (level) {
    case 1:
      return <h1 className="wl-heading wl-heading-1">{children}</h1>;
    case 2:
      return <h2 className="wl-heading wl-heading-2">{children}</h2>;
    case 3:
      return <h3 className="wl-heading wl-heading-3">{children}</h3>;
    case 4:
      return <h4 className="wl-heading wl-heading-4">{children}</h4>;
    case 5:
      return <h5 className="wl-heading wl-heading-5">{children}</h5>;
    case 6:
      return <h6 className="wl-heading wl-heading-6">{children}</h6>;
  }
}