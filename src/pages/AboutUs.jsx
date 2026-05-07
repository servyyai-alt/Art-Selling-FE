import React from 'react';
import InfoPageLayout from '../components/layout/InfoPageLayout';

const highlights = [
  {
    title: 'Curated Originals',
    body: 'We focus on original artworks, limited editions, and collectible pieces presented with clear pricing, secure checkout, and careful handling.',
  },
  {
    title: 'Artist-Led Storytelling',
    body: 'Every listing is chosen to highlight the artist, medium, dimensions, and creative context so collectors can buy with confidence.',
  },
  {
    title: 'Collector Support',
    body: 'From browsing to post-purchase assistance, our goal is to make discovering and owning meaningful art feel personal and straightforward.',
  },
];

export default function AboutUs() {
  return (
    <InfoPageLayout
      title="About Us"
      eyebrow="Our Story"
      description="ARTT is a curated art marketplace inspired by South Indian contemporary expression, designed to connect collectors with meaningful original works."
      heroImage="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1400"
    >
      <div className="space-y-10">
        <div className="space-y-5">
          <p className="font-sans text-sm md:text-base text-mid-gray leading-relaxed">
            ARTT showcases artworks that balance cultural depth, craftsmanship, and contemporary appeal. Our collection is shaped around thoughtful presentation, secure purchasing, and a premium visual experience for collectors.
          </p>
          <p className="font-sans text-sm md:text-base text-mid-gray leading-relaxed">
            We believe art buying should be transparent and trustworthy. That is why we clearly communicate pricing, shipping, payment, and support information throughout the customer journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="border border-beige bg-cream/60 p-6">
              <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">{item.title}</p>
              <p className="font-sans text-sm text-mid-gray leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-beige pt-8">
          <p className="font-display text-2xl md:text-3xl font-light mb-4">What we stand for</p>
          <div className="space-y-3 font-sans text-sm md:text-base text-mid-gray leading-relaxed">
            <p>Authentic product representation and clear artwork information.</p>
            <p>Secure checkout through trusted payment partners including Razorpay.</p>
            <p>Responsive customer support before and after purchase.</p>
            <p>Careful packaging and insured delivery practices for eligible orders.</p>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}
