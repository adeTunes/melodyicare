"use client";

import { motion } from "framer-motion";
import {
  UserCheck,
  Briefcase,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const requirements = [
  "Valid Means Of Identification",
  "Relevant Certifications (if available)",
  "1-2 years Caregiving Experience (Preferred)",
  "Good Communication Skills",
];

const benefits = [
  "Structured Onboarding Process",
  "Professional Work Environment",
  "Flexible Work Schedule",
  "Opportunity for growth and continuous Training",
];

export default function Recruitment() {
  return (
    <section id="join" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 relative">
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-md">
                <Briefcase size={16} />
                <span>We are Hiring</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                Join <span className="text-primary italic">MelodyICare</span> as
                a Care-Provider
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We are currently recruiting qualified caregivers for our growing
                team. If you are passionate about providing professional and
                compassionate care, we want to hear from you.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-heading font-bold flex items-center gap-2 text-primary">
                  <UserCheck size={24} />
                  Requirements:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requirements.map((req, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border/50 text-sm font-medium text-foreground/80 shadow-sm"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-secondary shrink-0 mt-0.5"
                      />
                      {req}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-heading font-bold flex items-center gap-2 text-primary">
                  <Briefcase size={24} />
                  What We Offer:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border/50 text-sm font-medium text-foreground/80 shadow-sm"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="https://wa.me/2349039182206"
                  target="_blank"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-full text-lg font-bold hover:shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                  <MessageSquare size={24} />
                  Apply via WhatsApp
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
                <p className="mt-4 text-sm text-muted-foreground ml-4">
                  Interested candidates should contact:{" "}
                  <span className="font-bold text-foreground">09039182206</span>{" "}
                  (WhatsApp only)
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-4xl overflow-hidden aspect-4/5 shadow-lg border-2 border-white">
                <img
                  src="/recruitment-team.png"
                  alt="MelodyICare Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-2xl font-heading font-bold italic">
                    "We Step In Where Life Becomes Heavy and Carry It With
                    Care."
                  </p>
                </div>
              </div>

              {/* Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", damping: 15, delay: 0.5 }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-accent rounded-full flex items-center justify-center text-center p-4 border-4 border-white shadow-lg rotate-12"
              >
                <p className="text-accent-foreground font-bold text-lg leading-tight">
                  CAREERS AT MELODYICARE
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
