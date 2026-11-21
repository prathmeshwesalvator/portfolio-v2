import { ImageResponse } from "next/og";
import { OG_SIZE, OgArtwork } from "@/lib/og";

export const alt = "Prathmesh More — Flutter Software Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgArtwork
        theme="warm"
        eyebrow="Prathmesh More · Flutter Software Engineer"
        title="Engineering mobile experiences that scale."
        subtitle="Flutter Engineer focused on building secure, scalable and reliable mobile applications."
        footerLeft="Recruiter view"
        footerRight="One developer. Two experiences."
      />
    ),
    { ...OG_SIZE },
  );
}
