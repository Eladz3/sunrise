import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-10 leading-relaxed text-gray-900">
        <h1 className="mb-1 text-3xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-gray-500">
          Last updated: May 15, 2026 &nbsp;|&nbsp; Applies to:{' '}
          <a href="https://thesunrise.app" className="text-blue-600 hover:underline">
            https://thesunrise.app
          </a>
        </p>

        <Section title="Introduction">
          <p>
            This Privacy Policy describes how Sunrise ("we," "us," or "our") collects, uses, and shares information about you when you use our website at{' '}
            <a href="https://thesunrise.app" className="text-blue-600 hover:underline">
              https://thesunrise.app
            </a>{' '}
            (the "Service").
          </p>
          <p>By using our Service, you agree to the collection and use of information in accordance with this policy. This policy applies to all visitors, users, and others who access or use the Service.</p>
        </Section>

        <Section title="Information We Collect">
          <p>We collect several types of information in connection with the Service:</p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              <strong>Information you provide directly:</strong> Name, email address, cookies & usage data
            </li>
            <li>
              <strong>Information collected automatically:</strong> When you use our Service, we automatically collect certain information, including IP address, browser type, operating system, referring URLs, and device information.
            </li>
            <li>
              <strong>Information from third-party services:</strong> We may receive information about you from third-party services you connect to our Service.
            </li>
          </ul>
        </Section>

        <Section title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>Provide, operate, and maintain our Service</li>
            <li>Improve and personalize your experience</li>
            <li>Understand how you use our Service</li>
            <li>Communicate with you, including for customer service and marketing purposes</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and security alerts</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="How We Share Your Information">
          <p>We may share your information in the following circumstances:</p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              <strong>Service providers:</strong> We share information with third-party vendors who provide services on our behalf, including Google Analytics.
            </li>
            <li>
              <strong>Legal requirements:</strong> We may disclose information if required by law or in response to valid legal processes.
            </li>
            <li>
              <strong>Business transfers:</strong> We may share information in connection with a merger, acquisition, or sale of assets.
            </li>
          </ul>
          <p>We do not sell or share your personal information with third parties for their marketing purposes.</p>
        </Section>

        <Section title="Cookies and Tracking Technologies">
          <p>We use cookies and similar tracking technologies to track activity on our Service and to hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          <p>We use cookies for the following purposes: analytics and performance, functional preferences, and marketing (where applicable). Third-party services we use — such as Google Analytics — may also set their own cookies.</p>
        </Section>

        <Section title="Data Retention">
          <p>We will retain your personal information for as long as necessary to fulfill the purposes described in this policy. Data is not kept longer than necessary for the specified purpose.</p>
          <p>When we no longer need to retain your information, we will securely delete or anonymize it.</p>
        </Section>

        <Section title="Your Rights Under the GDPR">
          <p>If you are located in the European Economic Area, you have the following rights regarding your personal data:</p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              <strong>Right of access:</strong> You can request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong>Right to rectification:</strong> You can ask us to correct inaccurate or incomplete information.
            </li>
            <li>
              <strong>Right to erasure ("right to be forgotten"):</strong> You can ask us to delete your personal data in certain circumstances.
            </li>
            <li>
              <strong>Right to restriction of processing:</strong> You can ask us to limit how we use your data.
            </li>
            <li>
              <strong>Right to data portability:</strong> You can request your data in a machine-readable format.
            </li>
            <li>
              <strong>Right to object:</strong> You can object to our processing of your data based on legitimate interests.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:elad.zohar3@gmail.com" className="text-blue-600 hover:underline">
              elad.zohar3@gmail.com
            </a>
            . We will respond within 30 days.
          </p>
          <p>
            <strong>Lawful basis for processing:</strong> We process your personal data on the basis of consent, contract performance, legitimate interests, and legal obligations as applicable.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p>Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information promptly.</p>
          <p>
            If you are a parent or guardian and believe your child has provided us with personal information, please contact us at{' '}
            <a href="mailto:elad.zohar3@gmail.com" className="text-blue-600 hover:underline">
              elad.zohar3@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="Data Security">
          <p>We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.</p>
          <p>However, no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
        </Section>

        <Section title="Third-Party Links">
          <p>Our Service may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.</p>
        </Section>

        <Section title="Changes to This Privacy Policy">
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.</p>
          <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        </Section>

        <Section title="Contact Us">
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              By email:{' '}
              <a href="mailto:elad.zohar3@gmail.com" className="text-blue-600 hover:underline">
                elad.zohar3@gmail.com
              </a>
            </li>
            <li>
              By visiting our website:{' '}
              <a href="https://thesunrise.app" className="text-blue-600 hover:underline">
                https://thesunrise.app
              </a>
            </li>
          </ul>
        </Section>

        <div className="mt-8 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          <strong>Legal Disclaimer:</strong> This document was generated using a template generator for informational purposes only. It does not constitute legal advice. Please consult with a qualified attorney to ensure this document meets your specific legal requirements.
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Sunrise
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 mt-8 border-b border-gray-200 pb-1 text-lg font-semibold">{title}</h2>
      <div className="space-y-3 text-gray-800">{children}</div>
    </section>
  )
}
