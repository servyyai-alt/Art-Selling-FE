import React from 'react';
import InfoPageLayout from '../components/layout/InfoPageLayout';

const contactCards = [
  {
    label: 'Email',
    value: 'admin@artt.in',
    href: 'mailto:admin@artt.in',
  },
  {
    label: 'Region',
    value: 'Tamil Nadu, India',
  },
  {
    label: 'Support Hours',
    value: 'Monday to Saturday, 10:00 AM to 6:00 PM IST',
  },
];

export default function Contact() {
  return (
    <InfoPageLayout
      title="Contact"
      eyebrow="Support"
      description="For order support, payment questions, shipping updates, or general enquiries, please reach out to the ARTT team using the details below."
      heroImage="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1400"
    >
      <div className="space-y-10">
        <div className="grid gap-6 md:grid-cols-3">
          {contactCards.map((card) => (
            <div key={card.label} className="border border-beige bg-cream/60 p-6">
              <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">{card.label}</p>
              {card.href ? (
                <a href={card.href} className="font-sans text-sm md:text-base text-black hover:text-gold transition-colors break-all">
                  {card.value}
                </a>
              ) : (
                <p className="font-sans text-sm md:text-base text-mid-gray leading-relaxed">{card.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-beige pt-8 space-y-4">
          <h2 className="font-display text-2xl md:text-3xl font-light">How we can help</h2>
          <div className="space-y-3 font-sans text-sm md:text-base text-mid-gray leading-relaxed">
            <p>Order status and payment confirmation queries.</p>
            <p>Shipping delays, delivery updates, and packaging concerns.</p>
            <p>Return requests, refund assistance, and product clarification before purchase.</p>
          </div>
        </div>

        <div className="rounded-none border border-gold/40 bg-gold/10 p-5">
          <p className="font-sans text-sm text-black leading-relaxed">
            When contacting support, please include your order number and the email address used during checkout so we can help faster.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
}
