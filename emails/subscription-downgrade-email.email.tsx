import { SiteConfig } from "@/site-config";
import { Preview, Text } from "@react-email/components";
import { EmailLayout } from "./utils/email-layout";
import { EmailLink, EmailSection, EmailText } from "./utils/components.utils";

export default function SubscriptionDowngradeEmail({ url }: { url: string }) {
  return (
    <EmailLayout>
      <Preview>Your Premium Access Has Been Paused</Preview>
      <EmailSection>
        <EmailText>Hello,</EmailText>
        <EmailText>
          We're reaching out to inform you that your account has reverted to our
          basic access level. This change is due to the recent issues with your
          premium subscription payment.
        </EmailText>
        <EmailText>
          While you'll still enjoy our core services, access to premium features
          is now limited. We'd love to have you back in our premium community!
        </EmailText>
        <EmailText>
          To reactivate your premium status, simply update your payment
          information here:
        </EmailText>
        <EmailText>
          <EmailLink href={url}>
            👉 Click to Update Payment and Keep Using {SiteConfig.title} 👈
          </EmailLink>
        </EmailText>
        <EmailText>
          If you have any questions or need assistance, our team is always here
          to help.
        </EmailText>
      </EmailSection>
      <Text className="text-lg leading-6">
        Best,
        <br />- {SiteConfig.maker.name} from {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
