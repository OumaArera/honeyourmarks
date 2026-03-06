import React from "react";
import Badge from "./Badge";


export default function LevelTag({ level }) {
  const map = {
    beginner: { label: "Beginner", color: "#059669" },
    intermediate: { label: "Inter.", color: "#0891B2" },
    expert: { label: "Expert", color: "#DC2626" },
    scout: { label: "Scout", color: "#059669" },
    explorer: { label: "Explorer", color: "#0891B2" },
    legend: { label: "Legend", color: "#DC2626" },
  };
  const { label, color } = map[level] || { label: level, color: "#718096" };
  return <Badge color={color}>{label}</Badge>;
}