import "./Button.css";

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  const classes = ["wl-button", `wl-button-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...rest} />;
}
