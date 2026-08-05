import {
  LegalBullet,
  LegalContactCard,
  LegalPageLayout,
  LegalParagraph,
  LegalSection,
} from '../src/components/LegalPageLayout';

export default function PrivacyPolicyScreen() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="March 17, 2026">
      <LegalSection heading="1. Introduction">
        <LegalParagraph>
          Welcome to Vaykae. We respect your privacy and are committed to protecting your
          personal data. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our Platform.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="2. Information We Collect">
        <LegalParagraph>We collect information you provide directly to us:</LegalParagraph>
        <LegalBullet>Name, email address, phone number</LegalBullet>
        <LegalBullet>Profile information and photos</LegalBullet>
        <LegalBullet>Payment and billing information</LegalBullet>
        <LegalBullet>Travel preferences and destinations</LegalBullet>
        <LegalBullet>Campaign descriptions and updates</LegalBullet>
        <LegalParagraph>We also automatically collect:</LegalParagraph>
        <LegalBullet>Device information (IP address, browser type, operating system)</LegalBullet>
        <LegalBullet>Usage data (pages visited, features used, time spent)</LegalBullet>
        <LegalBullet>Location data (with your permission)</LegalBullet>
        <LegalBullet>Cookies and similar tracking technologies</LegalBullet>
      </LegalSection>

      <LegalSection heading="3. How We Use Your Information">
        <LegalParagraph>We use collected information for:</LegalParagraph>
        <LegalBullet>Providing and maintaining our services</LegalBullet>
        <LegalBullet>Processing transactions and sending notifications</LegalBullet>
        <LegalBullet>Personalizing your experience</LegalBullet>
        <LegalBullet>Communicating with you about updates and promotions</LegalBullet>
        <LegalBullet>Analyzing usage patterns to improve our Platform</LegalBullet>
        <LegalBullet>Preventing fraud and ensuring security</LegalBullet>
        <LegalBullet>Complying with legal obligations</LegalBullet>
      </LegalSection>

      <LegalSection heading="4. Information Sharing">
        <LegalParagraph>We may share your information with:</LegalParagraph>
        <LegalBullet>Travel Agencies — when you book packages or request services</LegalBullet>
        <LegalBullet>
          Service Providers — payment processors, hosting providers, analytics services
        </LegalBullet>
        <LegalBullet>
          Other Users — profile information visible on campaigns and social features
        </LegalBullet>
        <LegalBullet>Legal Authorities — when required by law or to protect our rights</LegalBullet>
        <LegalBullet>Business Transfers — in connection with mergers or acquisitions</LegalBullet>
        <LegalParagraph>We do not sell your personal information to third parties.</LegalParagraph>
      </LegalSection>

      <LegalSection heading="5. Data Security">
        <LegalParagraph>
          We implement appropriate technical and organizational measures to protect your data,
          including encryption, secure servers, and access controls. However, no method of
          transmission over the internet is 100% secure, and we cannot guarantee absolute
          security.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="6. Your Rights and Choices">
        <LegalParagraph>You have the right to:</LegalParagraph>
        <LegalBullet>Access — request a copy of your personal data</LegalBullet>
        <LegalBullet>Correction — update or correct inaccurate information</LegalBullet>
        <LegalBullet>Deletion — request deletion of your data (subject to legal requirements)</LegalBullet>
        <LegalBullet>Opt-out — unsubscribe from marketing communications</LegalBullet>
        <LegalBullet>Data Portability — receive your data in a structured format</LegalBullet>
        <LegalBullet>Object — object to certain processing of your data</LegalBullet>
      </LegalSection>

      <LegalSection heading="7. Cookies and Tracking">
        <LegalParagraph>
          We use cookies and similar technologies to enhance your experience, analyze usage, and
          deliver personalized content. You can control cookie preferences through your browser
          settings, though this may affect Platform functionality.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="8. Third-Party Links">
        <LegalParagraph>
          Our Platform may contain links to third-party websites and services. We are not
          responsible for their privacy practices. We encourage you to review their privacy
          policies before providing any information.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="9. Children's Privacy">
        <LegalParagraph>
          Vaykae is not intended for users under 18 years of age. We do not knowingly collect
          personal information from children. If you believe we have collected information from
          a child, please contact us immediately.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="10. International Data Transfers">
        <LegalParagraph>
          Your information may be transferred to and processed in countries other than your own.
          We ensure appropriate safeguards are in place to protect your data in accordance with
          this Privacy Policy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="11. Data Retention">
        <LegalParagraph>
          We retain your personal data for as long as necessary to provide our services and
          comply with legal obligations. When data is no longer needed, we securely delete or
          anonymize it.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="12. Changes to Privacy Policy">
        <LegalParagraph>
          We may update this Privacy Policy periodically. We will notify you of significant
          changes via email or Platform notification. Your continued use after changes
          constitutes acceptance of the updated policy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="13. Contact Us">
        <LegalParagraph>
          For questions about this Privacy Policy or to exercise your rights, please contact us
          at:
        </LegalParagraph>
        <LegalContactCard
          lines={[
            'Email: privacy@vaykae.com',
            'Address: 123 Travel Lane, Adventure City, AC 12345',
            'Data Protection Officer: dpo@vaykae.com',
          ]}
        />
      </LegalSection>
    </LegalPageLayout>
  );
}
