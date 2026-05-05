import React from 'react';
import { Link } from 'react-router-dom';
// import ARTTLogo from '../ui/ARTTLogo';
import ARTLogo from '../../assets/ARTLOGO.jpeg';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-black text-cream">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            {/* <ARTTLogo light /> */}
            <img
                src={ARTLogo}
                alt="Logo"
                className="h-14 w-14 md:h-16 md:w-16 rounded-full object-contain bg-white p-1"
              />
            <p className="mt-6 font-sans text-sm text-light-gray leading-relaxed">
              A curated marketplace for original artworks. Bringing the finest South Indian contemporary art to collectors worldwide.
            </p>
            <div className="flex gap-4 mt-6">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="text-light-gray hover:text-gold transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-6">Shop</h4>
            <ul className="space-y-3">
              {['All Artworks', 'Paintings', 'Sculpture', 'Photography', 'Digital Art'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="font-sans text-sm text-light-gray hover:text-cream transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-6">Account</h4>
            <ul className="space-y-3">
              {[
                { label: 'My Profile', href: '/profile' },
                { label: 'My Orders', href: '/orders' },
                { label: 'Wishlist', href: '/profile' },
                { label: 'Sign In', href: '/login' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="font-sans text-sm text-light-gray hover:text-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-6">Information</h4>
            <ul className="space-y-3">
              {['About Us', 'Shipping Policy', 'Return Policy', 'Terms & Conditions', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-sans text-sm text-light-gray hover:text-cream transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-mid-gray mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-light-gray tracking-widest">
            © {new Date().getFullYear()} ARTT – Alangudi Subramaniam. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5 opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-5 opacity-50" />
          </div>
        </div>
      </div>
    </footer>
  );
}