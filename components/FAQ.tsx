"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What areas in Lagos do you cover?",
    answer:
      "We currently provide care services across most residential areas in Lagos, including Lekki, Victoria Island, Ikoyi, Ikeja, and Surulere. Please contact us to confirm coverage for your specific location.",
  },
  {
    question: "How do you vet your caregivers?",
    answer:
      "Our caregivers go through a rigorous vetting process that includes background checks, verification of identification, practical skills assessment, and multi-stage interviews. We prioritize both professional competence and emotional intelligence.",
  },
  {
    question: "Do you offer 24/7 care services?",
    answer:
      "Yes, we offer flexible care arrangements including hourly support, overnight care, and 24/7 live-in care depending on the needs of the individual and their family.",
  },
  {
    question: "Can I meet the caregiver before services start?",
    answer:
      "Absolutely. We believe in building trust early. After our initial assessment, we introduce potential caregivers to the family to ensure there is a good personality match and comfort level.",
  },
  {
    question: "How do I get started with MelodyICare?",
    answer:
      "The easiest way is to message us via WhatsApp or email. We will schedule a free initial consultation to understand your needs and design a personalized care plan.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4"
          >
            <HelpCircle size={32} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-heading font-bold text-foreground"
          >
            Frequently Asked <span className="text-primary">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Everything you need to know about our care services and process.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm"
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-muted/10 transition-colors"
              >
                <span className="text-lg font-heading font-bold text-foreground pr-8">
                  {faq.question}
                </span>
                <div className="shrink-0 text-primary">
                  {activeIndex === index ? (
                    <Minus size={24} />
                  ) : (
                    <Plus size={24} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
