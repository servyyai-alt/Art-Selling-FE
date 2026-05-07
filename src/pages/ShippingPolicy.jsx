import React from 'react';
import InfoPageLayout from '../components/layout/InfoPageLayout';

const sections = [
  {
    heading: 'Order Processing',
    points: [
      'Orders are usually processed within 2 to 4 business days after successful payment confirmation.',
      'Orders placed on Sundays or public holidays are processed on the next working business day.',
      'If an artwork requires special packing or verification, processing may take slightly longer and we will notify the customer.',
    ],
  },
  {
    heading: 'Shipping Charges',
    points: [
      'Shipping is free for orders above Rs 50,000.',
      'A standard shipping fee of Rs 500 applies to orders below Rs 50,000 unless otherwise stated at checkout.',
      'Any charges for remote-area delivery, priority handling, or special installation support will be communicated before dispatch.',
    ],
  },
  {
    heading: 'Delivery Timelines',
    points: [
      'Domestic deliveries within India generally arrive within 5 to 10 business days after dispatch.',
      'Delivery timelines may vary depending on the destination, courier network availability, weather conditions, or local restrictions.',
      'Tracking details are shared once the order is dispatched whenever tracking is available.',
    ],
  },
  {
    heading: 'Packaging and Risk Handling',
    points: [
      'Eligible artworks are packed securely to reduce transit risk and preserve presentation quality.',
      'Customers should inspect the package at the time of delivery and report visible damage as soon as possible.',
      'If a shipment is delayed, lost, or damaged in transit, our team will work with the logistics partner to resolve the issue.',
    ],
  },
];

export default function ShippingPolicy() {
  return (
    <InfoPageLayout
      title="Shipping Policy"
      eyebrow="Delivery Information"
      description="This policy explains how ARTT processes, packs, ships, and delivers orders placed through our platform."
      heroImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400"
    >
      <div className="space-y-10">
        <div className="rounded-none border border-gold/40 bg-gold/10 p-5">
          <p className="font-sans text-sm text-black leading-relaxed">
            Shipping timelines begin after payment confirmation. During high-demand periods, exhibitions, or special releases, dispatch may take longer than usual.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.heading} className="border-b border-beige pb-8 last:border-b-0 last:pb-0">
            <h2 className="font-display text-2xl md:text-3xl font-light mb-4">{section.heading}</h2>
            <div className="space-y-3">
              {section.points.map((point) => (
                <p key={point} className="font-sans text-sm md:text-base text-mid-gray leading-relaxed">
                  {point}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
}
