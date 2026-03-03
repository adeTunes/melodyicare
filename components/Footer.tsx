"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ArrowUpCircle,
} from "lucide-react";

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
                  alt="MelodyICare Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-heading font-bold tracking-tight text-white">
                Melody<span className="text-secondary">ICare</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 italic">
              "MelodyICare exists to ensure that no one feels forgotten,
              overwhelmed or unsupported. We step in where life becomes heavy
              and carry it with care."
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
            © {new Date().getFullYear()} MelodyICare Services. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 group hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUpCircle
              size={24}
              className="group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
