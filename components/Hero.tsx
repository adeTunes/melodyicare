"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-linear-to-br from-background via-accent/30 to-background"
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-primary/20 text-primary text-sm font-semibold shadow-sm backdrop-blur-sm">
            <Heart size={16} fill="currentColor" />
            <span>MelodyICare Services - Now in Lagos</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading leading-[1.1] font-extrabold text-foreground">
            We care to <span className="text-primary italic">live</span>, <br />
            we live to <span className="text-secondary italic">care</span>.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            A premium care service agency committed to delivering personalized,
            professional and compassionate support to individuals and families
            who need it most.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="https://wa.me/2349039182206"
              target="_blank"
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full text-lg font-bold hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-95 group w-full sm:w-auto justify-center"
            >
              <MessageSquare size={20} />
              Message Us Now
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="#services"
              className="px-8 py-4 bg-white/50 border border-border text-foreground rounded-full text-lg font-bold hover:bg-white transition-all backdrop-blur-sm w-full sm:w-auto text-center"
            >
              View Our Services
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-secondary" size={24} />
              <span className="text-sm font-medium text-foreground/70">
                Trusted Care
              </span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <Heart className="text-primary" size={24} fill="currentColor" />
              <span className="text-sm font-medium text-foreground/70">
                Empathetic Team
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-4xl overflow-hidden shadow-2xl border-8 border-white group">
            {/* Using a placeholder for now, ideally user's images should be here */}
            <div className="aspect-4/5 bg-muted flex items-center justify-center">
              <img
                src="/hero-care.png"
                alt="Caregiving at MelodyICare"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-primary/30 to-transparent pointer-events-none" />
          </div>

          {/* Floating card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl shadow-xl max-w-xs hidden md:block"
          >
            <p className="text-primary font-bold mb-1 italic">
              "Caring, Compassion and Comfort"
            </p>
            <p className="text-sm text-foreground/70">
              Our tagline is our promise to every family we serve.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
