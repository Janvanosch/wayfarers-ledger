import "./Textarea.css";

import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...rest }: TextareaProps) {
  const classes = ["wl-textarea", className].filter(Boolean).join(" ");

  return <textarea className={classes} {...rest} />;
}
