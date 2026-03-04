import React from "react";

/** Brand logo mark — reused in Navbar + Footer */
export default function LogoMark({ size = 46 }) {
  return (
    <img
      src="/logo.png"
      alt="Hone Your Marks"
      width={size}
      height={size}
      className="shrink-0 object-contain"
      draggable={false}
    />
  );
}