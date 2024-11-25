import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { ServerMdx } from "@/features/markdown/server-mdx";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { calculateReadingTime } from "@/features/posts/calculate-reading-time";
import type {
  PostParams} from "@/features/posts/post-manager";
import {
  getCurrentPost,
  getPosts,
} from "@/features/posts/post-manager";
import { formatDate } from "@/lib/format/date";
import { logger } from "@/lib/logger";
import { SiteConfig } from "@/site-config";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateMetadata(props: PostParams): Promise<Metadata> {
  const params = await props.params;
  const post = await getCurrentPost(params.slug);

  if (!post) {
    notFound();
  }

  return {
    title: post.attributes.title,
    description: post.attributes.description,
    keywords: post.attributes.keywords,
    authors: {
      name: SiteConfig.maker.name,
      url: SiteConfig.maker.website,
    },
    openGraph: {
      title: post.attributes.title,
      description: post.attributes.description,
      url: `https://codeline.app/posts/${params.slug}`,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function RoutePage(props: PostParams) {
  const params = await props.params;
  const post = await getCurrentPost(params.slug);

  if (!post) {
    notFound();
  }

  if (
    post.attributes.status === "draft" &&
    process.env.VERCEL_ENV === "production"
  ) {
    logger.warn(`Post "${post.attributes.title}" is a draft`);
    notFound();
  }

  return (
    <Layout>
      <LayoutContent>
        <Link className={buttonVariants({ variant: "link" })} href="/posts">
          <ArrowLeft size={16} /> Back
        </Link>
      </LayoutContent>
      <LayoutHeader
        style={{
          backgroundImage: `url(${post.attributes.coverUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="overflow-hidden rounded-lg"
      >
        <div className="flex w-full flex-col gap-2 bg-black/50 p-10 text-white backdrop-blur">
          {post.attributes.status === "draft" ? (
            <Badge className="w-fit" variant="secondary">
              Draft
            </Badge>
          ) : null}
          <LayoutTitle className="drop-shadow-sm">
            {post.attributes.title}
          </LayoutTitle>
          <LayoutDescription className="drop-shadow-sm">
            Published by {formatDate(new Date(post.attributes.date))} · Reading
            time {calculateReadingTime(post.content)} minutes · Created by{" "}
            <Typography
              variant="link"
              as={Link}
              href={SiteConfig.maker.website}
            >
              {SiteConfig.maker.name}
            </Typography>
          </LayoutDescription>
        </div>
      </LayoutHeader>
      <Separator />
      <LayoutContent>
        <ServerMdx
          className="prose mb-8 dark:prose-invert lg:prose-lg xl:prose-xl"
          source={post.content}
        />
      </LayoutContent>
    </Layout>
  );
}
