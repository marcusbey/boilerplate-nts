import { getPosts } from "@/features/posts/post-manager";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    {
      url: "https://codeline.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://codeline.app/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://codeline.app/home",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    ...posts.map(
      (post) =>
        ({
          url: `https://codeline.app/posts/${post.slug}`,
          lastModified: new Date(post.attributes.date),
          changeFrequency: "monthly",
        }) as const,
    ),
  ];
}
