import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import { Preview, Text } from "@react-email/components";
import { EmailLayout } from "./utils/email-layout";
import { EmailLink, EmailSection, EmailText } from "./utils/components.utils";

export default function OrganizationInvitationEmail({
  token,
  orgSlug,
  organizationName,
}: {
  token: string;
  orgSlug: string;
  organizationName: string;
}) {
  const url = `${getServerUrl()}/orgs/${orgSlug}/invitations/${token}`;
  return (
    <EmailLayout>
      <Preview>You are invited to join {organizationName}</Preview>
      <EmailSection>
        <EmailText>
          {organizationName} has invited you to join their organization.
        </EmailText>
        <EmailText>
          If you didn't request this, please ignore this email.
        </EmailText>
        <EmailText>
          <EmailLink href={url}>
            👉 Click here to accept the invitation 👈
          </EmailLink>
        </EmailText>
        <EmailText>
          If you don't have an account, you will need to create one.
        </EmailText>
      </EmailSection>
      <Text className="text-lg leading-6">
        Best,
        <br />- {SiteConfig.maker.name} from {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
