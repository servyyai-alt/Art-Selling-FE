import React from 'react';
import InfoPageLayout from '../components/layout/InfoPageLayout';

const sections = [
  {
    heading: 'Use of the Website',
    body: 'By using ARTT, you agree to use the website lawfully and only for genuine browsing and purchase activity. Any misuse of the platform, including fraudulent orders or abuse of payment systems, may result in account restriction or order cancellation.',
  },
  {
    heading: 'Products and Pricing',
    body: 'We aim to present artworks, descriptions, and prices as accurately as possible. Minor variations in color or texture may occur due to screen settings or the handmade nature of certain works. All prices shown on the website are subject to change without prior notice.',
  },
  {
    heading: 'Orders and Acceptance',
    body: 'Placing an order does not automatically guarantee acceptance. We reserve the right to cancel or refuse orders in cases such as pricing errors, stock issues, verification concerns, payment failure, or delivery limitations.',
  },
  {
    heading: 'Payments',
    body: 'Payments are processed through authorized third-party payment providers including Razorpay. By completing checkout, you agree to the terms applicable to the selected payment method. ARTT does not store full card or bank credentials on the website.',
  },
  {
    heading: 'Intellectual Property',
    body: 'All website content including images, artwork listings, text, branding, and layout elements remains the property of ARTT, the relevant artist, or the lawful rights holder. No content may be copied, reproduced, or commercially reused without written permission.',
  },
  {
    heading: 'Liability and Updates',
    body: 'We may update these terms from time to time. Continued use of the website after changes are published means you accept the revised terms. To the extent permitted by law, ARTT is not liable for indirect or incidental loss arising from website use, service interruption, or courier delay.',
  },
];

export default function TermsAndConditions() {
  return (
    <InfoPageLayout
      title="Terms & Conditions"
      eyebrow="Legal"
      description="These terms govern your use of the ARTT website, purchases made through the platform, and the general relationship between ARTT and its customers."
      heroImage="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400"
    >
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.heading} className="border-b border-beige pb-8 last:border-b-0 last:pb-0">
            <h2 className="font-display text-2xl md:text-3xl font-light mb-4">{section.heading}</h2>
            <p className="font-sans text-sm md:text-base text-mid-gray leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
}
