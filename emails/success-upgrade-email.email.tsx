import { SiteConfig } from "@/site-config";
import { Preview, Text } from "@react-email/components";
import { EmailLayout } from "./utils/email-layout";
import { EmailSection, EmailText } from "./utils/components.utils";

export default function SuccessUpgradeEmail() {
  return (
    <EmailLayout>
      <Preview>
        You have successfully upgraded your account to {SiteConfig.title}
      </Preview>
      <EmailSection>
        <EmailText>Hello,</EmailText>
        <EmailText>
          Great news! Your payment was successful, and you now have full access
          to all our premium features. Get ready to explore everything we have
          to offer!
        </EmailText>
        <EmailText>
          If you have any questions or need assistance as you dive in, feel free
          to reach out to us. We're here to help you make the most of your
          experience.
        </EmailText>
        <EmailText>Happy exploring,</EmailText>
      </EmailSection>
      <Text className="text-lg leading-6">
        Best,
        <br />- {SiteConfig.maker.name} from {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
