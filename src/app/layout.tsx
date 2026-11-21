import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { modeMeta } from "@/data/site";
import { buildPersonJsonLd } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";

/* Body/UI — shared by both experiences */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
/* Labels, metadata, terminal */
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
/* Recruiter — elegant editorial accents */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});
/* Freelance — bold editorial display */
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: modeMeta.recruiter.title,
  description: modeMeta.recruiter.description,
  applicationName: "Prathmesh More — Portfolio",
  authors: [{ name: profile.fullName, url: profile.links.linkedin }],
  creator: profile.fullName,
  keywords: [
    "Prathmesh More",
    "Flutter Software Engineer",
    "Flutter Developer",
    "Mobile Application Developer",
    "Full Stack Developer",
    "Dart",
    "BLoC",
    "Clean Architecture",
    "Offline-First",
    "Django",
    "FastAPI",
    "React",
    "Freelance Flutter Developer",
    "Mumbai",
    "Thane",
  ],
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${bricolage.variable}`}
    >
      <body>
        {/* Without JavaScript, scroll-reveal content must still be visible. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"}</style>
        </noscript>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildPersonJsonLd(siteUrl) }} />
      </body>
    </html>
  );
}
