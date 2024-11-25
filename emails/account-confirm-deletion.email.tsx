import { SiteConfig } from "@/site-config";
import { Preview, Text } from "@react-email/components";
import { EmailLayout } from "./utils/email-layout";
import { EmailSection, EmailText } from "./utils/components.utils";

export default function AccountConfirmDeletionEmail() {
  return (
    <EmailLayout>
      <Preview>
        Your account has been deleted. All your data, including any
        organizations you owned, have been removed from our system.
      </Preview>
      <EmailSection>
        <EmailText>Hi,</EmailText>
        <EmailText>
          We wanted to let you know that your account has been permanently
          deleted. All your data, including any organizations you owned, have
          been removed from our system.
        </EmailText>
        <EmailText>
          If you have any questions or need further assistance, please do not
          hesitate to contact our support team.
        </EmailText>
      </EmailSection>
      <Text className="text-lg leading-6">
        Best,
        <br />- {SiteConfig.maker.name} from {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
