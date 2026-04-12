"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  CircleArrowUp,
} from "lucide-react";

function Instagram({ size = 24, ...props }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Facebook({ size = 24, ...props }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Twitter({ size = 24, ...props }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-white/90 py-20 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center p-2 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="MelodyiCare Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight text-white">
                Melody<span className="text-secondary">ICare</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 italic">
              &ldquo;MelodyiCare exists to ensure that no one feels forgotten,
              overwhelmed or unsupported. We step in where life becomes heavy
              and carry it with care.&rdquo;
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors text-white/70 hover:text-white"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors text-white/70 hover:text-white"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors text-white/70 hover:text-white"
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link
                  href="#home"
                  className="hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#join"
                  className="hover:text-primary transition-colors"
                >
                  Join the Team
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>Elderly Care</li>
              <li>Childcare Assistance</li>
              <li>Meal Preparation</li>
              <li>Premium Concierge</li>
              <li>Lifestyle Support</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-bold text-white mb-0.5">WhatsApp</p>
                  <a
                    href="https://wa.me/2349039182206"
                    target="_blank"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    09039182206
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-bold text-white mb-0.5">Email</p>
                  <a
                    href="mailto:melodyicare4@gmail.com"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    melodyicare4@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-bold text-white mb-0.5">Location</p>
                  <p className="text-white/60">Lagos, Nigeria</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
          <p>
            © {new Date().getFullYear()} MelodyiCare Services. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 group hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <CircleArrowUp
              size={24}
              className="group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
