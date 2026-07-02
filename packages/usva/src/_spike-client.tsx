"use client";
import { useState } from "react";
export function Spike() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
