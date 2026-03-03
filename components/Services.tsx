"use client";

import { motion } from "framer-motion";
import { Heart, Home, Star, CheckCircle } from "lucide-react";

const services = [
  {
    title: "Elderly Care",
    description:
      "Personalized care for the elderly, including daily companionship, medication reminders, meal planning, and light housekeeping.",
    icon: <Heart size={32} className="text-primary" fill="currentColor" />,
    features: [
      "Daily Companionship",
      "Medication Reminders",
      "Meal Planning",
      "Light Housekeeping",
    ],
    color: "bg-primary/5",
  },
  {
    title: "Personal & Household Care",
    description:
      "Reliable support for busy families and professionals, covering childcare assistance, meal preparation, and lifestyle support.",
    icon: <Home size={32} className="text-secondary" />,
    features: [
      "Childcare Assistance",
      "Meal Preparation",
      "Lifestyle Support",
      "Grocery Shopping",
    ],
    color: "bg-secondary/5",
  },
  {
    title: "Premium Concierge Care",
    description:
      "High-end, dedicated care for those seeking a more personalized and exclusive experience with dedicated caregivers.",
    icon: (
      <Star size={32} className="text-accent-foreground" fill="currentColor" />
    ),
    features: [
      "Dedicated Caregiver",
      "24/7 Priority Support",
      "Custom Care Plan",
      "Travel Assistance",
    ],
    color: "bg-accent",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-sm"
          >
            Our Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground"
          >
            Tailored Care Solutions for{" "}
            <span className="text-primary">Every Need</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            We provide a range of premium services designed to ensure comfort,
            safety, and peace of mind for you and your loved ones.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 rounded-4xl border border-border hover:border-primary/30 transition-all shadow-sm hover:shadow-xl group hover:-translate-y-2 ${service.color}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm font-medium text-foreground/80"
                  >
                    <CheckCircle size={18} className="text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-[3rem] glass flex flex-col lg:flex-row items-center justify-between gap-8 border-primary/10 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 space-y-4">
            <h3 className="text-3xl font-heading font-bold text-foreground">
              Not sure which plan is right for you?
            </h3>
            <p className="text-lg text-muted-foreground max-w-xl">
              Our care coordinators are here to help you design a personalized
              care plan that fits your lifestyle and budget.
            </p>
          </div>
          <Link
            href="https://wa.me/2349039182206"
            target="_blank"
            className="relative z-10 px-8 py-4 bg-primary text-white rounded-full text-lg font-bold hover:shadow-primary/20 hover:shadow-xl transition-all active:scale-95 whitespace-nowrap"
          >
            Get a Free Consultation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

import Link from "next/link";
