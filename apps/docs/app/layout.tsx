import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="kajo">
      <body>{children}</body>
    </html>
  );
}
