import "./Cover.css";

interface CoverProps {
  filename: string | null;
  alt: string;
}

export default function Cover({ filename, alt }: CoverProps) {
  if (!filename) {
    return <div className="wl-cover wl-cover-empty" aria-hidden="true" />;
  }

  return (
    <img className="wl-cover" src={`wl-vault://photos/${filename}`} alt={alt} />
  );
}
