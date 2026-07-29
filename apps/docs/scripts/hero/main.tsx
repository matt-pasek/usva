import { createRoot } from "react-dom/client";
import { HeroStill } from "@/components/hero/hero-still";
import "./hero.css";

const theme = new URLSearchParams(location.search).get("theme") ?? "kajo";
document.documentElement.dataset.theme = theme;

const host = document.getElementById("root");
if (!host) throw new Error("hero harness: #root is missing");

createRoot(host).render(<HeroStill />);
