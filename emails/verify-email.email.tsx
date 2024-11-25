import { SiteConfig } from "@/site-config";
import { Preview, Text } from "@react-email/components";
import { EmailLayout } from "./utils/email-layout";
import { EmailLink, EmailSection, EmailText } from "./utils/components.utils";

export default function VerifyEmail({ url }: { url: string }) {
  return (
    <EmailLayout>
      <Preview>Please click the link below to sign in to your account.</Preview>
      <EmailSection>
        <EmailText>
          <EmailLink href={url}>
            👉 Click here to verify your email 👈
          </EmailLink>
        </EmailText>
        <EmailText>
          If you didn't request this, please ignore this email.
        </EmailText>
      </EmailSection>
      <Text className="text-lg leading-6">
        Best,
        <br />- {SiteConfig.maker.name} from {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
