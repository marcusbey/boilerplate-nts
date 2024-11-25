import { getCurrentPost } from "@/features/posts/post-manager";
import { getOgImageFont } from "@/lib/og-image-font";
import type { PageParams } from "@/types/next";
import { ImageResponse } from "next/og";
import { PostSlugMetadataImage } from "./post-slug-metadata-image";

export const alt = "Codeline information images";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage(
  props: PageParams<{ slug: string }>,
) {
  const params = await props.params;
  const post = await getCurrentPost(params.slug);

  if (!post) {
    return null;
  }

  return new ImageResponse(<PostSlugMetadataImage post={post} />, {
    ...size,
    fonts: await getOgImageFont(),
  });
}
