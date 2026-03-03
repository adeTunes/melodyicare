"use client";

import { motion } from "framer-motion";
import { Eye, Target, Heart, Shield, Award, Users, Zap } from "lucide-react";

const values = [
  {
    title: "Compassion",
    description: "We act with empathy and kindness in every interaction.",
    icon: <Heart size={24} className="text-primary" />,
  },
  {
    title: "Trust",
    description:
      "Building reliable relationships with families and care providers.",
    icon: <Shield size={24} className="text-secondary" />,
  },
  {
    title: "Excellence",
    description:
      "Striving for the highest quality in professional care services.",
    icon: <Award size={24} className="text-secondary" />,
  },
  {
    title: "Respect & Dignity",
    description: "Empowering individuals to live with comfort and pride.",
    icon: <Users size={24} className="text-primary" />,
  },
  {
    title: "Responsiveness",
    description:
      "Being there when you need us most, with prompt and clear action.",
    icon: (
      <Zap size={24} className="text-accent-foreground" fill="currentColor" />
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Eye size={16} />
              <span>Our Vision & Mission</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Empowering Families to Live with{" "}
              <span className="text-secondary">Comfort & Peace</span>
            </h2>
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-border group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Target size={20} />
                  </div>
                  <h3 className="text-xl font-heading font-bold">
                    Our Mission
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To enhance the quality of life for individuals by providing
                  reliable, empathetic, and professional care that nurtures
                  their physical, emotional, and social well-being.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-border group hover:border-secondary/20 transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Eye size={20} />
                  </div>
                  <h3 className="text-xl font-heading font-bold">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and compassionate care agency,
                  empowering families and individuals to live with comfort,
                  dignity, and peace of mind.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden aspect-square shadow-lg"
          >
            <img
              src="/about-care.png"
              alt="Professional care service"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-overlay" />
            <div className="absolute inset-0 flex items-center justify-center p-12 text-center text-white">
              <div className="space-y-4">
                <p className="text-3xl font-heading font-bold italic leading-tight">
                  "We step in where life becomes heavy and carry it with care."
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-heading font-bold mb-4">
              Our Core Values
            </h3>
            <p className="text-muted-foreground">
              The foundation of everything we do at MelodyiCare.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 text-center space-y-3 hover:translate-y-[-4px] transition-all shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/10 transition-colors">
                  {value.icon}
                </div>
                <h4 className="font-heading font-bold text-foreground">
                  {value.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
