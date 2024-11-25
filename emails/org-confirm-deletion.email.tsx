import { SiteConfig } from "@/site-config";
import { Preview, Text } from "@react-email/components";
import { EmailLayout } from "./utils/email-layout";
import { EmailSection, EmailText } from "./utils/components.utils";

export default function OrgConfirmDeletionEmail({ org }: { org: string }) {
  return (
    <EmailLayout>
      <Preview>
        Your organization has been deleted. All your data, related to your
        organization, have been removed from our system.
      </Preview>
      <EmailSection>
        <EmailText>Hi,</EmailText>
        <EmailText>
          We just wanted to let you know that the organization {org} has been
          permanently deleted. All your data, related to your organization, have
          been removed from our system.
        </EmailText>
      </EmailSection>
      <Text className="text-lg leading-6">
        Best,
        <br />- {SiteConfig.maker.name} from {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
