import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import TransitionProvider from "./components/transition/TransitionProvider";
import Preloader from "./components/transition/Preloader";
import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import CommandPalette from "./components/CommandPalette";
import EasterEggs from "./components/EasterEggs";
import { Analytics } from "@vercel/analytics/next";
import { themeInitScript } from "./lib/theme-script";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bhanu Prasad Palella — AI & Data Science",
    template: "%s — Bhanu Prasad Palella",
  },
  description:
    "Bhanu Prasad Palella builds intelligent systems — graph-learning schedulers, autonomous rescue robots and production AI platforms. AI & Data Science at Amrita School of Artificial Intelligence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <TransitionProvider>
          <Preloader />
          <SmoothScroll />
          <Nav />
          <main className="relative flex-1">{children}</main>
          <Footer />
          <CommandPalette />
          <EasterEggs />
        </TransitionProvider>
        <Analytics />
        <Cursor />
        <div aria-hidden="true" className="grain" />
      </body>
    </html>
  );
}