import React from 'react';
import InfoPageLayout from '../components/layout/InfoPageLayout';

const eligibleReasons = [
  'Artwork received in a damaged condition.',
  'Wrong artwork or wrong quantity delivered.',
  'Material mismatch or a significant issue not disclosed on the product page.',
];

const notEligible = [
  'Change-of-mind returns after successful delivery.',
  'Custom, commissioned, personalized, or made-to-order artworks.',
  'Products damaged after delivery due to misuse, poor handling, or improper storage.',
];

export default function ReturnPolicy() {
  return (
    <InfoPageLayout
      title="Return Policy"
      eyebrow="Returns and Refunds"
      description="We want collectors to feel confident buying from ARTT. This policy explains when a return, replacement, or refund may be approved."
      heroImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400"
    >
      <div className="space-y-10">
        <div className="space-y-4">
          <h2 className="font-display text-2xl md:text-3xl font-light">Return Window</h2>
          <p className="font-sans text-sm md:text-base text-mid-gray leading-relaxed">
            Return requests must be raised within 7 days of delivery. Requests received after this period may not be eligible for return, replacement, or refund review.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-beige bg-cream/60 p-6">
            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-4">Eligible Return Cases</p>
            <div className="space-y-3">
              {eligibleReasons.map((item) => (
                <p key={item} className="font-sans text-sm text-mid-gray leading-relaxed">{item}</p>
              ))}
            </div>
          </div>

          <div className="border border-beige bg-cream/60 p-6">
            <p className="font-sans text-xs tracking-widest uppercase text-gold mb-4">Non-Returnable Cases</p>
            <div className="space-y-3">
              {notEligible.map((item) => (
                <p key={item} className="font-sans text-sm text-mid-gray leading-relaxed">{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl md:text-3xl font-light">How to Request a Return</h2>
          <div className="space-y-3 font-sans text-sm md:text-base text-mid-gray leading-relaxed">
            <p>Share your order number, delivery date, and a brief description of the issue.</p>
            <p>Attach clear photos of the received artwork, packaging, and any visible damage.</p>
            <p>Our team will review the request and confirm whether a replacement, store resolution, or refund applies.</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-beige pt-8">
          <h2 className="font-display text-2xl md:text-3xl font-light">Refund Timelines</h2>
          <p className="font-sans text-sm md:text-base text-mid-gray leading-relaxed">
            Once a return or cancellation is approved, refunds are processed to the original payment method. Banking timelines can vary, but most refunds are completed within 5 to 10 business days after approval.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
}
