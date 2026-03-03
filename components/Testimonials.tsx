"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Funmi Adebayo",
    role: "Family Physician",
    content:
      "MelodyICare has been a godsend for my elderly patients. Their caregivers are not just professional; they are deeply compassionate. I trust them completely with the transition of care from hospital to home.",
    image: "/avatar-1.png",
  },
  {
    name: "Emeka Nwosu",
    role: "Son of Client",
    content:
      "Finding a care agency that actually cares in Lagos was difficult until we found MelodyICare. They treat my father like their own family. The peace of mind they've given us is priceless.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Chioma Okereke",
    role: "Busy Professional",
    content:
      "As a working mom, balancing my career and my aging mother's needs was stressful. MelodyICare stepped in with their concierge service and handled everything. Their responsiveness is unmatched.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary font-bold tracking-widest uppercase text-sm"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground"
          >
            What Families Are <span className="text-secondary">Saying</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-4xl bg-white border border-border shadow-sm hover:shadow-md transition-all relative group"
            >
              <Quote className="absolute top-6 right-8 text-primary/10 w-12 h-12 group-hover:text-primary/20 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
