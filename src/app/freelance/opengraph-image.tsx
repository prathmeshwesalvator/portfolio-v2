import { ImageResponse } from "next/og";
import { OG_SIZE, OgArtwork } from "@/lib/og";

export const alt = "Prathmesh More — Have an idea? Let's turn it into a product.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function FreelanceOpenGraphImage() {
  return new ImageResponse(
    (
      <OgArtwork
        theme="dark"
        eyebrow="Prathmesh More"
        title="Have an idea? Let's turn it into a product."
        subtitle="Flutter mobile apps, backend APIs and full-stack web products — built to stay reliable after launch."
        footerLeft="Freelance view"
        footerRight="One developer. Two experiences."
      />
    ),
    { ...OG_SIZE },
  );
}
