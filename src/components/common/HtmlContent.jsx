import React from "react";



export default function HtmlContent({ html, className = "" }) {
  if (!html) return null;
  return (
    <div
      className={`prose-note ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}