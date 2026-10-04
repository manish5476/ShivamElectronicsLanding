import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function CustomDesign() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: '',
    category: '',
    preferredDate: '',
    colorPreference: '',
    budgetRange: '',
    description: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { contactApi } = await import('../services/api');
    const res = await contactApi.create({
      name: formData.name,
      email: formData.email,
      subject: `Custom Design Request - ${formData.category || 'General'}`,
      message: `Occasion: ${formData.occasion}\nDate: ${formData.preferredDate}\nColor: ${formData.colorPreference}\nBudget: ${formData.budgetRange}\n\nDescription: ${formData.description}\n\nNotes: ${formData.notes}\n\nPhone: ${formData.phone}`,
    });
    if (res.success) setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1400&q=80"
            alt="Custom design"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-espresso/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
              Bespoke Creations
            </p>
            <h1 className="heading-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-ivory mb-4">
              Made Especially for You
            </h1>
            <p className="text-ivory/70 max-w-xl mx-auto">
              Have a specific colour, pattern, occasion or design in mind? Share your idea with Mimiko Studio and let us create something uniquely yours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="heading-serif text-3xl font-semibold text-espresso text-center mb-12">
              How It Works
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Share Your Idea', desc: 'Tell us about your vision, occasion, and preferences.' },
              { step: '02', title: 'Design Discussion', desc: 'We\'ll discuss materials, colors, and feasibility.' },
              { step: '03', title: 'Crafting', desc: 'Our artisans bring your design to life by hand.' },
              { step: '04', title: 'Delivery', desc: 'Your unique piece arrives, ready to be treasured.' },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="text-center">
                  <span className="heading-serif text-4xl font-light text-light-gold">{item.step}</span>
                  <h3 className="heading-serif text-lg font-semibold text-espresso mt-3 mb-2">{item.title}</h3>
                  <p className="text-sm text-taupe">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 lg:py-24 bg-cream/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <ScrollReveal>
              <div className="text-center py-12 bg-white p-8 lg:p-12">
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-muted-gold" />
                </div>
                <h2 className="heading-serif text-2xl font-semibold text-espresso mb-4">
                  Request Received
                </h2>
                <p className="text-taupe leading-relaxed mb-6">
                  Thank you for sharing your vision with us. We'll review your request and get back to you within 24-48 hours to discuss the details.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-muted-gold underline text-sm"
                >
                  Submit another request
                </button>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <div className="bg-white p-6 sm:p-8 lg:p-12">
                <h2 className="heading-serif text-2xl lg:text-3xl font-semibold text-espresso mb-2">
                  Request a Custom Design
                </h2>
                <p className="text-taupe text-sm mb-8">
                  Fill in the details below and we'll get back to you with a consultation.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                        Occasion
                      </label>
                      <input
                        type="text"
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        placeholder="Wedding, Navratri, Birthday..."
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                      >
                        <option value="">Select category</option>
                        <option value="jewellery">Jewellery</option>
                        <option value="ornament">Ornament</option>
                        <option value="navratri">Navratri</option>
                        <option value="embroidery">Embroidery</option>
                        <option value="bridal">Bridal</option>
                        <option value="festive">Festive</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                        Color Preference
                      </label>
                      <input
                        type="text"
                        name="colorPreference"
                        value={formData.colorPreference}
                        onChange={handleChange}
                        placeholder="e.g., Red and gold, Pastel..."
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                        Budget Range
                      </label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors"
                      >
                        <option value="">Select range</option>
                        <option value="under-2000">Under ₹2,000</option>
                        <option value="2000-5000">₹2,000 - ₹5,000</option>
                        <option value="5000-10000">₹5,000 - ₹10,000</option>
                        <option value="above-10000">Above ₹10,000</option>
                        <option value="discuss">Prefer to discuss</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                      Describe Your Design *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us about the piece you have in mind — style, materials, size, any reference to existing designs..."
                      className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Any other details or questions..."
                      className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-espresso text-ivory py-3.5 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Submit Design Request
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
}
