import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-10 text-gray-900 leading-relaxed">
        <h1 className="text-3xl font-bold mb-1">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 15, 2026</p>

        {/* Table of Contents */}
        <section className="mb-8 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
          <h2 className="text-base font-semibold mb-3">Table of Contents</h2>
          <ol className="list-decimal ml-5 space-y-1 text-sm text-blue-700">
            {toc.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className="hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* Agreement intro */}
        <Section id="agreement" title="Agreement to Our Legal Terms">
          <p>
            We are <strong>ZeroToTen LLC</strong>, doing business as <strong>Sunrise</strong> ("Company,"
            "we," "us," "our"), a company registered in California, United States, at 601 Van Ness
            Ave., Unit 3, San Francisco, CA 94102.
          </p>
          <p>
            We operate the website{' '}
            <a href="https://thesunrise.app" className="text-blue-600 hover:underline">
              https://thesunrise.app
            </a>{' '}
            (the "Site") as well as any other related products and services that refer or link to
            these legal terms (collectively, the "Services").
          </p>
          <p>
            Sunrise is a social goal tracking platform that helps friends stay accountable, build
            habits, and achieve goals together.
          </p>
          <p>
            You can contact us by email at{' '}
            <a href="mailto:elad.zohar3@gmail.com" className="text-blue-600 hover:underline">
              elad.zohar3@gmail.com
            </a>{' '}
            or by mail to 601 Van Ness Ave., Unit 3, San Francisco, CA 94102, United States.
          </p>
          <p>
            These Legal Terms constitute a legally binding agreement made between you ("you") and
            ZeroToTen LLC, concerning your access to and use of the Services. You agree that by
            accessing the Services, you have read, understood, and agreed to be bound by all of
            these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE
            EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>
          <p>
            We will provide you with prior notice of any scheduled changes to the Services you are
            using. The modified Legal Terms will become effective upon posting or notifying you by{' '}
            <a href="mailto:elad.zohar3@gmail.com" className="text-blue-600 hover:underline">
              elad.zohar3@gmail.com
            </a>
            . By continuing to use the Services after the effective date of any changes, you agree
            to be bound by the modified terms.
          </p>
          <p>
            All users who are minors in the jurisdiction in which they reside (generally under the
            age of 18) must have the permission of, and be directly supervised by, their parent or
            guardian to use the Services. If you are a minor, you must have your parent or guardian
            read and agree to these Legal Terms prior to you using the Services.
          </p>
          <p>We recommend that you print a copy of these Legal Terms for your records.</p>
        </Section>

        <Section id="services" title="1. Our Services">
          <p>
            The information provided when using the Services is not intended for distribution to or
            use by any person or entity in any jurisdiction or country where such distribution or use
            would be contrary to law or regulation or which would subject us to any registration
            requirement within such jurisdiction or country. Accordingly, those persons who choose to
            access the Services from other locations do so on their own initiative and are solely
            responsible for compliance with local laws, if and to the extent local laws are
            applicable.
          </p>
          <p>
            The Services are not tailored to comply with industry-specific regulations (Health
            Insurance Portability and Accountability Act (HIPAA), Federal Information Security
            Management Act (FISMA), etc.), so if your interactions would be subjected to such laws,
            you may not use the Services. You may not use the Services in a way that would violate
            the Gramm-Leach-Bliley Act (GLBA).
          </p>
        </Section>

        <Section id="ip" title="2. Intellectual Property Rights">
          <h3 className="font-semibold mt-3 mb-1">Our intellectual property</h3>
          <p>
            We are the owner or the licensee of all intellectual property rights in our Services,
            including all source code, databases, functionality, software, website designs, audio,
            video, text, photographs, and graphics in the Services (collectively, the "Content"), as
            well as the trademarks, service marks, and logos contained therein (the "Marks").
          </p>
          <p>
            Our Content and Marks are protected by copyright and trademark laws and treaties in the
            United States and around the world.
          </p>
          <p>
            The Content and Marks are provided in or through the Services "AS IS" for your personal,
            non-commercial use only.
          </p>
          <h3 className="font-semibold mt-4 mb-1">Your use of our Services</h3>
          <p>
            Subject to your compliance with these Legal Terms, we grant you a non-exclusive,
            non-transferable, revocable license to access the Services and download or print a copy
            of any portion of the Content to which you have properly gained access, solely for your
            personal, non-commercial use.
          </p>
          <p>
            Except as set out in this section, no part of the Services and no Content or Marks may
            be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed,
            encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited
            for any commercial purpose whatsoever, without our express prior written permission.
          </p>
          <p>
            If you wish to make any other use of the Services, Content, or Marks, please address
            your request to{' '}
            <a href="mailto:elad.zohar3@gmail.com" className="text-blue-600 hover:underline">
              elad.zohar3@gmail.com
            </a>
            .
          </p>
          <p>
            We reserve all rights not expressly granted to you in and to the Services, Content, and
            Marks. Any breach of these Intellectual Property Rights will constitute a material breach
            of our Legal Terms and your right to use our Services will terminate immediately.
          </p>
          <h3 className="font-semibold mt-4 mb-1">Your submissions and contributions</h3>
          <p>
            <strong>Submissions:</strong> By directly sending us any question, comment, suggestion,
            idea, feedback, or other information about the Services ("Submissions"), you agree to
            assign to us all intellectual property rights in such Submission. You agree that we shall
            own this Submission and be entitled to its unrestricted use and dissemination for any
            lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.
          </p>
          <p>
            <strong>Contributions:</strong> The Services may invite you to chat, contribute to, or
            participate in blogs, message boards, online forums, and other functionality during which
            you may create, submit, post, display, transmit, publish, distribute, or broadcast
            content and materials to us or through the Services ("Contributions"). Any Submission
            that is publicly posted shall also be treated as a Contribution.
          </p>
          <p>
            You understand that Contributions may be viewable by other users of the Services.
          </p>
          <p>
            <strong>
              When you post Contributions, you grant us a license (including use of your name,
              trademarks, and logos):
            </strong>{' '}
            By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable,
            perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and
            license to use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle,
            store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in
            part), and exploit your Contributions for any purpose, commercial, advertising, or
            otherwise.
          </p>
          <p>
            <strong>You are responsible for what you post or upload:</strong> By posting
            Contributions you confirm that they are original to you or that you have the necessary
            rights and licenses, and that they are not illegal, harassing, hateful, harmful,
            defamatory, obscene, or misleading. You are solely responsible for your Contributions
            and expressly agree to reimburse us for any losses we suffer because of your breach of
            this section or any third party's intellectual property rights.
          </p>
          <p>
            <strong>We may remove or edit your Content:</strong> Although we have no obligation to
            monitor any Contributions, we shall have the right to remove or edit any Contributions
            at any time without notice if in our reasonable opinion we consider such Contributions
            harmful or in breach of these Legal Terms.
          </p>
        </Section>

        <Section id="userreps" title="3. User Representations">
          <p>By using the Services, you represent and warrant that:</p>
          <ul className="list-disc ml-6 space-y-1.5">
            <li>
              All registration information you submit will be true, accurate, current, and complete.
            </li>
            <li>
              You will maintain the accuracy of such information and promptly update it as necessary.
            </li>
            <li>
              You have the legal capacity and you agree to comply with these Legal Terms.
            </li>
            <li>
              You are not a minor in the jurisdiction in which you reside, or if a minor, you have
              received parental permission to use the Services.
            </li>
            <li>
              You will not access the Services through automated or non-human means, whether through
              a bot, script, or otherwise.
            </li>
            <li>
              You will not use the Services for any illegal or unauthorized purpose.
            </li>
            <li>
              Your use of the Services will not violate any applicable law or regulation.
            </li>
          </ul>
          <p>
            If you provide any information that is untrue, inaccurate, not current, or incomplete,
            we have the right to suspend or terminate your account and refuse any and all current or
            future use of the Services.
          </p>
        </Section>

        <Section id="userreg" title="4. User Registration">
          <p>
            You may be required to register with the Services. You agree to keep your password
            confidential and will be responsible for all use of your account and password. We
            reserve the right to remove, reclaim, or change a username you select if we determine,
            in our sole discretion, that such username is inappropriate, obscene, or otherwise
            objectionable.
          </p>
        </Section>

        <Section id="purchases" title="5. Purchases and Payment">
          <p>
            We may offer paid features or subscriptions. If you make a purchase, you agree to
            provide current, complete, and accurate purchase and account information. You agree to
            promptly update account and payment information so we can complete your transactions and
            contact you as needed.
          </p>
          <p>
            We reserve the right to refuse any order. We may, in our sole discretion, limit or
            cancel quantities purchased per person, per household, or per order.
          </p>
          <p>
            All purchases are non-refundable except as required by applicable law or as expressly
            stated in a separate refund policy we may publish.
          </p>
        </Section>

        <Section id="prohibited" title="6. Prohibited Activities">
          <p>
            You may not access or use the Services for any purpose other than that for which we make
            them available. The Services may not be used in connection with any commercial endeavors
            except those that are specifically endorsed or approved by us. As a user, you agree not
            to:
          </p>
          <ul className="list-disc ml-6 space-y-1.5">
            <li>
              Systematically retrieve data or other content from the Services to create or compile a
              collection, compilation, database, or directory without written permission from us.
            </li>
            <li>
              Trick, defraud, or mislead us and other users, especially in any attempt to learn
              sensitive account information such as user passwords.
            </li>
            <li>
              Circumvent, disable, or otherwise interfere with security-related features of the
              Services.
            </li>
            <li>
              Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.
            </li>
            <li>
              Use any information obtained from the Services in order to harass, abuse, or harm
              another person.
            </li>
            <li>
              Make improper use of our support services or submit false reports of abuse or
              misconduct.
            </li>
            <li>
              Use the Services in a manner inconsistent with any applicable laws or regulations.
            </li>
            <li>
              Engage in unauthorized framing of or linking to the Services.
            </li>
            <li>
              Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or
              other material that interferes with any party's uninterrupted use and enjoyment of the
              Services.
            </li>
            <li>
              Attempt to impersonate another user or person or use the username of another user.
            </li>
            <li>
              Sell or otherwise transfer your profile.
            </li>
            <li>
              Use the Services to advertise or offer to sell goods and services.
            </li>
            <li>
              Harass, annoy, intimidate, or threaten any of our employees or agents engaged in
              providing any portion of the Services to you.
            </li>
            <li>
              Delete the copyright or other proprietary rights notice from any Content.
            </li>
            <li>
              Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML,
              JavaScript, or other code.
            </li>
            <li>
              Use the Services as part of any effort to compete with us or otherwise use the
              Services and/or the Content for any revenue-generating endeavor or commercial
              enterprise.
            </li>
          </ul>
        </Section>

        <Section id="ugc" title="7. User Generated Contributions">
          <p>
            The Services may invite you to chat, contribute to, or participate in blogs, message
            boards, online forums, and other functionality, and may provide you with the opportunity
            to create, submit, post, display, transmit, perform, publish, distribute, or broadcast
            content and materials to us or on the Services.
          </p>
          <p>
            Any Contributions you transmit may be treated as non-confidential and non-proprietary.
            When you create or make available any Contributions, you thereby represent and warrant
            that your Contributions do not violate the privacy or publicity rights of any third
            party, are not false, are not unsolicited advertising or spam, and do not violate
            applicable law.
          </p>
        </Section>

        <Section id="license" title="8. Contribution License">
          <p>
            By posting your Contributions to any part of the Services, you automatically grant us an
            unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable,
            royalty-free, fully-paid, worldwide right and license to host, use, copy, reproduce,
            disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly
            perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part),
            and distribute such Contributions for any purpose.
          </p>
          <p>
            We do not assert any ownership over your Contributions. You retain full ownership of all
            of your Contributions and any intellectual property rights or other proprietary rights
            associated with your Contributions.
          </p>
          <p>
            We have the right, in our sole and absolute discretion, (1) to edit, redact, or
            otherwise change any Contributions; (2) to re-categorize any Contributions to place them
            in more appropriate locations on the Services; and (3) to pre-screen or delete any
            Contributions at any time and for any reason, without notice.
          </p>
        </Section>

        <Section id="sitemanage" title="9. Services Management">
          <p>
            We reserve the right, but not the obligation, to: (1) monitor the Services for
            violations of these Legal Terms; (2) take appropriate legal action against anyone who,
            in our sole discretion, violates the law or these Legal Terms; (3) in our sole
            discretion and without limitation, refuse, restrict access to, limit the availability
            of, or disable (to the extent technologically feasible) any of your Contributions or any
            portion thereof; (4) in our sole discretion and without limitation, notice, or
            liability, to remove from the Services or otherwise disable all files and content that
            are excessive in size or are in any way burdensome to our systems; and (5) otherwise
            manage the Services in a manner designed to protect our rights and property and to
            facilitate the proper functioning of the Services.
          </p>
        </Section>

        <Section id="ppyes" title="10. Privacy Policy">
          <p>
            We care about data privacy and security. Please review our{' '}
            <Link to="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            . By using the Services, you agree to be bound by our Privacy Policy, which is
            incorporated into these Legal Terms. Please be advised the Services are hosted in the
            United States. If you access the Services from any other region of the world with laws
            or other requirements governing personal data collection, use, or disclosure that differ
            from applicable laws in the United States, then through your continued use of the
            Services, you are transferring your data to the United States, and you expressly consent
            to have your data transferred to and processed in the United States.
          </p>
        </Section>

        <Section id="copyrightyes" title="11. Copyright Infringements">
          <p>
            We respect the intellectual property rights of others. If you believe that any material
            available on or through the Services infringes upon any copyright you own or control,
            please immediately notify us using the contact information provided below (a "Notification").
            A copy of your Notification will be sent to the person who posted or stored the material
            addressed in the Notification.
          </p>
          <p>
            Please be advised that pursuant to applicable law you may be held liable for damages if
            you make material misrepresentations in a Notification. Thus, if you are not sure that
            material located on or linked to by the Services infringes your copyright, you should
            consider first contacting an attorney.
          </p>
        </Section>

        <Section id="terms" title="12. Term and Termination">
          <p>
            These Legal Terms shall remain in full force and effect while you use the Services.
            WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN
            OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE
            SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR
            NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR
            COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION.
          </p>
          <p>
            If we terminate or suspend your account for any reason, you are prohibited from
            registering and creating a new account under your name, a fake or borrowed name, or the
            name of any third party. In addition to terminating or suspending your account, we
            reserve the right to take appropriate legal action, including without limitation pursuing
            civil, criminal, and injunctive redress.
          </p>
        </Section>

        <Section id="modifications" title="13. Modifications and Interruptions">
          <p>
            We reserve the right to change, modify, or remove the contents of the Services at any
            time or for any reason at our sole discretion without notice. We also reserve the right
            to modify or discontinue all or part of the Services without notice at any time.
          </p>
          <p>
            We will not be liable to you or any third party for any modification, suspension, or
            discontinuance of the Services.
          </p>
          <p>
            We cannot guarantee the Services will be available at all times. We may experience
            hardware, software, or other problems or need to perform maintenance related to the
            Services, resulting in interruptions, delays, or errors. We reserve the right to change,
            revise, update, suspend, discontinue, or otherwise modify the Services at any time
            without notice to you.
          </p>
        </Section>

        <Section id="law" title="14. Governing Law">
          <p>
            These Legal Terms shall be governed by and defined following the laws of the State of
            California, United States. ZeroToTen LLC and yourself irrevocably consent that the
            courts of California shall have exclusive jurisdiction to resolve any dispute which may
            arise in connection with these Legal Terms.
          </p>
        </Section>

        <Section id="disputes" title="15. Dispute Resolution">
          <p>
            <strong>Informal Negotiations.</strong> To expedite resolution and control the cost of
            any dispute, controversy, or claim related to these Legal Terms (each a "Dispute"), you
            and we agree to first attempt to negotiate any Dispute informally for at least thirty
            (30) days before initiating formal proceedings. Such informal negotiations commence upon
            written notice from one party to the other.
          </p>
          <p>
            <strong>Binding Arbitration.</strong> If the parties are unable to resolve a Dispute
            through informal negotiations, the Dispute (except those Disputes expressly excluded
            below) will be finally and exclusively resolved by binding arbitration in San Francisco,
            California. The arbitration shall be commenced and conducted under the Commercial
            Arbitration Rules of the American Arbitration Association (AAA).
          </p>
          <p>
            <strong>Restrictions.</strong> The parties agree that any arbitration shall be limited
            to the Dispute between the parties individually. To the full extent permitted by law,
            (a) no arbitration shall be joined with any other proceeding; (b) there is no right or
            authority for any Dispute to be arbitrated on a class-action basis or to utilize class
            action procedures; and (c) there is no right or authority for any Dispute to be brought
            in a purported representative capacity on behalf of the general public or any other
            persons.
          </p>
        </Section>

        <Section id="corrections" title="16. Corrections">
          <p>
            There may be information on the Services that contains typographical errors,
            inaccuracies, or omissions, including descriptions, pricing, availability, and various
            other information. We reserve the right to correct any errors, inaccuracies, or
            omissions and to change or update the information on the Services at any time, without
            prior notice.
          </p>
        </Section>

        <Section id="disclaimer" title="17. Disclaimer">
          <p>
            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE
            OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE
            DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR
            USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR
            REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT.
          </p>
          <p>
            WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS
            WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVER THAT MAKES THEM AVAILABLE ARE
            FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
        </Section>

        <Section id="liability" title="18. Limitations of Liability">
          <p>
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY
            THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR
            PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES
            ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY
            OF SUCH DAMAGES.
          </p>
          <p>
            NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY
            CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED
            TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY
            CAUSE OF ACTION ARISING.
          </p>
        </Section>

        <Section id="indemnification" title="19. Indemnification">
          <p>
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries,
            affiliates, and all of our respective officers, agents, partners, and employees, from
            and against any loss, damage, liability, claim, or demand, including reasonable
            attorneys' fees and expenses, made by any third party due to or arising out of: (1) use
            of the Services; (2) breach of these Legal Terms; (3) any breach of your representations
            and warranties set forth in these Legal Terms; (4) your violation of the rights of a
            third party, including but not limited to intellectual property rights; or (5) any
            overt harmful act toward any other user of the Services.
          </p>
        </Section>

        <Section id="userdata" title="20. User Data">
          <p>
            We will maintain certain data that you transmit to the Services for the purpose of
            managing the performance of the Services, as well as data relating to your use of the
            Services. Although we perform regular routine backups of data, you are solely responsible
            for all data that you transmit or that relates to any activity you have undertaken using
            the Services.
          </p>
          <p>
            You agree that we shall have no liability to you for any loss or corruption of any such
            data, and you hereby waive any right of action against us arising from any such loss or
            corruption of such data.
          </p>
        </Section>

        <Section id="electronic" title="21. Electronic Communications, Transactions, and Signatures">
          <p>
            Visiting the Services, sending us emails, and completing online forms constitute
            electronic communications. You consent to receive electronic communications, and you
            agree that all agreements, notices, disclosures, and other communications we provide to
            you electronically, via email and on the Services, satisfy any legal requirement that
            such communication be in writing.
          </p>
          <p>
            You hereby agree to the use of electronic signatures, contracts, orders, and other
            records, and to electronic delivery of notices, policies, and records of transactions
            initiated or completed by us or via the Services. You hereby waive any rights or
            requirements under any statutes, regulations, rules, ordinances, or other laws in any
            jurisdiction which require an original signature or delivery or retention of
            non-electronic records.
          </p>
        </Section>

        <Section id="california" title="22. California Users and Residents">
          <p>
            If any complaint with us is not satisfactorily resolved, you can contact the Complaint
            Assistance Unit of the Division of Consumer Services of the California Department of
            Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento,
            California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.
          </p>
        </Section>

        <Section id="misc" title="23. Miscellaneous">
          <p>
            These Legal Terms and any policies or operating rules posted by us on the Services or in
            respect to the Services constitute the entire agreement and understanding between you and
            us. Our failure to exercise or enforce any right or provision of these Legal Terms shall
            not operate as a waiver of such right or provision.
          </p>
          <p>
            These Legal Terms operate to the fullest extent permissible by law. We may assign any or
            all of our rights and obligations to others at any time. We shall not be responsible or
            liable for any loss, damage, delay, or failure to act caused by any cause beyond our
            reasonable control.
          </p>
          <p>
            If any provision or part of a provision of these Legal Terms is determined to be
            unlawful, void, or unenforceable, that provision or part of the provision is deemed
            severable from these Legal Terms and does not affect the validity and enforceability of
            any remaining provisions.
          </p>
          <p>
            There is no joint venture, partnership, employment or agency relationship created between
            you and us as a result of these Legal Terms or use of the Services. You agree that these
            Legal Terms will not be construed against us by virtue of having drafted them.
          </p>
        </Section>

        <Section id="contact" title="24. Contact Us">
          <p>In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>
          <ul className="list-disc ml-6 space-y-1.5">
            <li>
              <strong>ZeroToTen LLC</strong> (dba Sunrise)
            </li>
            <li>601 Van Ness Ave., Unit 3, San Francisco, CA 94102, United States</li>
            <li>
              Email:{' '}
              <a href="mailto:elad.zohar3@gmail.com" className="text-blue-600 hover:underline">
                elad.zohar3@gmail.com
              </a>
            </li>
            <li>
              Website:{' '}
              <a href="https://thesunrise.app" className="text-blue-600 hover:underline">
                https://thesunrise.app
              </a>
            </li>
          </ul>
        </Section>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Sunrise
          </Link>
        </div>
      </div>
    </div>
  )
}

const toc = [
  { id: 'services', label: 'Our Services' },
  { id: 'ip', label: 'Intellectual Property Rights' },
  { id: 'userreps', label: 'User Representations' },
  { id: 'userreg', label: 'User Registration' },
  { id: 'purchases', label: 'Purchases and Payment' },
  { id: 'prohibited', label: 'Prohibited Activities' },
  { id: 'ugc', label: 'User Generated Contributions' },
  { id: 'license', label: 'Contribution License' },
  { id: 'sitemanage', label: 'Services Management' },
  { id: 'ppyes', label: 'Privacy Policy' },
  { id: 'copyrightyes', label: 'Copyright Infringements' },
  { id: 'terms', label: 'Term and Termination' },
  { id: 'modifications', label: 'Modifications and Interruptions' },
  { id: 'law', label: 'Governing Law' },
  { id: 'disputes', label: 'Dispute Resolution' },
  { id: 'corrections', label: 'Corrections' },
  { id: 'disclaimer', label: 'Disclaimer' },
  { id: 'liability', label: 'Limitations of Liability' },
  { id: 'indemnification', label: 'Indemnification' },
  { id: 'userdata', label: 'User Data' },
  { id: 'electronic', label: 'Electronic Communications, Transactions, and Signatures' },
  { id: 'california', label: 'California Users and Residents' },
  { id: 'misc', label: 'Miscellaneous' },
  { id: 'contact', label: 'Contact Us' },
]

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-6 scroll-mt-6">
      <h2 className="text-lg font-semibold mt-8 mb-3 pb-1 border-b border-gray-200">{title}</h2>
      <div className="space-y-3 text-gray-800">{children}</div>
    </section>
  )
}
