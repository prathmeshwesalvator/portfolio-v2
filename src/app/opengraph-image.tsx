import { ImageResponse } from "next/og";
import { OG_SIZE, OgArtwork } from "@/lib/og";

export const alt = "Prathmesh More — Flutter Software Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgArtwork
        theme="light"
        eyebrow="Prathmesh More"
        title="Building reliable mobile experiences through thoughtful engineering."
        subtitle="Flutter Software Engineer — production-grade apps, offline-first systems and secure mobile development."
        footerLeft="Recruiter view"
        footerRight="One developer. Two experiences."
      />
    ),
    { ...OG_SIZE },
  );
}
