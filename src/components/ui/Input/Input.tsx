import "./Input.css";

import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...rest }: InputProps) {
  const classes = ["wl-input", className].filter(Boolean).join(" ");

  return <input className={classes} {...rest} />;
}
