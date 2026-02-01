'use client'
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

if (typeof window !== "undefined") {
  window.onerror = function (msg, url, line, col, error) {
    document.body.innerHTML = `
      <pre style="
        padding:16px;
        background:#0f172a;
        color:#ff4d4f;
        white-space:pre-wrap;
        font-size:14px;
      ">
ERROR:
${msg}

FILE:
${url}:${line}:${col}

STACK:
${error?.stack}
      </pre>
    `
  }
}

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Frost & Wayne - Shop smarter",
  description: "Frost & Wayne - Shop smarter",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased`}>
          <StoreProvider>
            <Toaster />
            {children}

            {/* Vercel Web Analytics */}
            <Analytics />
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
