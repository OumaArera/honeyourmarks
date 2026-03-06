import { useMemo } from "react";


export default function WordCount({ html }) {
  const count = useMemo(() => {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text ? text.split(" ").length : 0;
  }, [html]);
  return (
    <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.2)" }}>
      {count} {count === 1 ? "word" : "words"}
    </span>
  );
}