import {
  LegalBullet,
  LegalContactCard,
  LegalPageLayout,
  LegalParagraph,
  LegalSection,
} from '../src/components/LegalPageLayout';

export default function TermsScreen() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="March 17, 2026">
      <LegalSection heading="1. Acceptance of Terms">
        <LegalParagraph>
          By accessing and using Vaykae (&quot;the Platform&quot;), you agree to be bound by these
          Terms and Conditions. If you do not agree to these terms, please do not use our
          services.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="2. User Accounts">
        <LegalParagraph>
          To access certain features of the Platform, you must create an account. You are
          responsible for:
        </LegalParagraph>
        <LegalBullet>Maintaining the confidentiality of your account credentials</LegalBullet>
        <LegalBullet>All activities that occur under your account</LegalBullet>
        <LegalBullet>Providing accurate and up-to-date information</LegalBullet>
        <LegalBullet>Notifying us immediately of any unauthorized access</LegalBullet>
      </LegalSection>

      <LegalSection heading="3. Fundraising Campaigns">
        <LegalParagraph>
          When creating a fundraising campaign for travel, you agree to:
        </LegalParagraph>
        <LegalBullet>Provide truthful and accurate information about your travel plans</LegalBullet>
        <LegalBullet>Use funds solely for the stated travel purpose</LegalBullet>
        <LegalBullet>Update donors on your travel progress</LegalBullet>
        <LegalBullet>Comply with all applicable laws and regulations</LegalBullet>
      </LegalSection>

      <LegalSection heading="4. Donations">
        <LegalParagraph>
          All donations made through Vaykae are voluntary. Donors acknowledge that donations are
          non-refundable except as required by law. Vaykae is not responsible for how campaign
          creators use donated funds.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="5. Travel Agency Services">
        <LegalParagraph>Travel agencies using the Platform must:</LegalParagraph>
        <LegalBullet>Maintain proper licensing and certifications</LegalBullet>
        <LegalBullet>Provide accurate package information and pricing</LegalBullet>
        <LegalBullet>Honor all bookings made through the Platform</LegalBullet>
        <LegalBullet>Comply with consumer protection laws</LegalBullet>
      </LegalSection>

      <LegalSection heading="6. Fees and Payments">
        <LegalParagraph>
          Vaykae charges a platform fee on successful fundraising campaigns and travel bookings.
          All fees are clearly disclosed before transactions. Payment processing is handled by
          third-party providers subject to their terms.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="7. Prohibited Activities">
        <LegalParagraph>You may not use Vaykae to:</LegalParagraph>
        <LegalBullet>Engage in fraudulent or misleading activities</LegalBullet>
        <LegalBullet>Violate any applicable laws or regulations</LegalBullet>
        <LegalBullet>Harass, abuse, or harm other users</LegalBullet>
        <LegalBullet>Upload malicious code or interfere with Platform operations</LegalBullet>
        <LegalBullet>Circumvent security features or access restrictions</LegalBullet>
      </LegalSection>

      <LegalSection heading="8. Intellectual Property">
        <LegalParagraph>
          All content, features, and functionality on Vaykae are owned by Vaykae and protected by
          copyright, trademark, and other intellectual property laws. You may not copy, modify,
          or distribute our content without permission.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="9. Limitation of Liability">
        <LegalParagraph>
          Vaykae is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
          indirect, incidental, or consequential damages arising from your use of the Platform,
          including travel disruptions, cancelled trips, or disputes between users and agencies.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="10. Termination">
        <LegalParagraph>
          We reserve the right to suspend or terminate your account at any time for violations of
          these Terms or for any other reason at our discretion. You may terminate your account
          at any time by contacting support.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="11. Changes to Terms">
        <LegalParagraph>
          We may update these Terms from time to time. Continued use of the Platform after
          changes constitutes acceptance of the revised Terms. We will notify users of
          significant changes via email or Platform notifications.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="12. Contact Information">
        <LegalParagraph>
          For questions about these Terms &amp; Conditions, please contact us at:
        </LegalParagraph>
        <LegalContactCard
          lines={['Email: legal@vaykae.com', 'Address: 123 Travel Lane, Adventure City, AC 12345']}
        />
      </LegalSection>
    </LegalPageLayout>
  );
}
