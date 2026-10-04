import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { faqItems } from '../data';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {/* Header */}
      <section className="py-16 lg:py-24 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
              Help
            </p>
            <h1 className="heading-serif text-4xl sm:text-5xl font-semibold text-espresso mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-taupe max-w-xl mx-auto">
              Find answers to common questions about our designs, ordering process, and services.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05}>
                <div className="border border-champagne/50 hover:border-champagne transition-colors">
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    aria-expanded={openIndex === idx}
                  >
                    <span className="heading-serif text-lg font-semibold text-espresso pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-muted-gold flex-shrink-0 transition-transform duration-300 ${
                        openIndex === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-5 pb-5 text-taupe text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-12 lg:py-16 bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="heading-serif text-2xl font-semibold text-espresso mb-3">
              Still have questions?
            </h2>
            <p className="text-taupe mb-6">
              We're happy to help. Reach out to us directly.
            </p>
            <a
              href="mailto:hello@mimikostudio.com"
              className="inline-flex items-center gap-2 bg-espresso text-ivory px-6 py-3 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors"
            >
              Contact Us
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
