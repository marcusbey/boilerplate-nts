import { Typography } from "@/components/ui/typography";
import { Layout, LayoutContent } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border border-border bg-card">
      <Layout className="py-24">
        <LayoutContent className="flex justify-between max-lg:flex-col">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Typography variant="h3">{SiteConfig.title}</Typography>
              <Typography variant="muted">{SiteConfig.company.name}</Typography>
              <Typography variant="muted">
                {SiteConfig.company.address}
              </Typography>
            </div>
            <Typography variant="muted" className="italic">
              © {new Date().getFullYear()} {SiteConfig.company.name} - All
              rights reserved.
            </Typography>
          </div>
          <div className="flex flex-col items-end gap-4">
            <Typography variant="large">Legal</Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/legal/terms"
            >
              Terms
            </Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/legal/privacy"
            >
              Privacy
            </Typography>
          </div>
          <div className="flex flex-col items-end gap-4">
            <Typography variant="large">Resources</Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/posts"
            >
              Blog
            </Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/orgs"
            >
              Dashboard
            </Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/account"
            >
              Account
            </Typography>
          </div>
        </LayoutContent>
      </Layout>
    </footer>
  );
};
