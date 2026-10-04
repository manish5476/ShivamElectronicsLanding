import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { designs, collections } from '../data';

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    designId: '',
    occasion: '',
    requestedDate: '',
    quantity: '1',
    customization: 'no',
    colorPreference: '',
    sizeDetails: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    const { bookingsApi, designs: designsData, collections: collectionsData } = await import('../services/api').then(async (api) => {
      const designsRes = await api.designsApi.getAll();
      const collectionsRes = await api.collectionsApi.getAll();
      return {
        bookingsApi: api.bookingsApi,
        designs: designsRes.data || [],
        collections: collectionsRes.data || [],
      };
    });
    const selectedDesign = designsData.find((d: any) => d.id === formData.designId);
    const collection = collectionsData.find((c: any) => c.id === selectedDesign?.collectionId);
    const res = await bookingsApi.create({
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      designId: formData.designId,
      designName: selectedDesign?.name,
      collection: collection?.name,
      occasion: formData.occasion,
      requestedDate: formData.requestedDate,
      quantity: formData.quantity,
      customization: formData.customization,
      colorPreference: formData.colorPreference,
      sizeDetails: formData.sizeDetails,
      notes: formData.notes,
    });
    if (res.success) setSubmitted(true);
    else setError(res.error || 'Failed to submit');
  };

  return (
    <div>
      {/* Header */}
      <section className="py-16 lg:py-20 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-light-gold font-sans font-medium mb-4">
              Booking
            </p>
            <h1 className="heading-serif text-4xl sm:text-5xl font-semibold text-espresso mb-4">
              Book a Design
            </h1>
            <p className="text-taupe max-w-xl mx-auto">
              Reserve a piece from our collection or request a custom creation. We'll confirm availability and details shortly.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <ScrollReveal>
              <div className="text-center py-12 bg-white p-8">
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-muted-gold" />
                </div>
                <h2 className="heading-serif text-2xl font-semibold text-espresso mb-4">
                  Thank You — Your Booking Request Has Been Received
                </h2>
                <p className="text-taupe leading-relaxed mb-6">
                  Someone from Mimiko Studio will contact you shortly to confirm availability and details.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-muted-gold underline text-sm"
                >
                  Submit another booking
                </button>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <div className="bg-white p-6 sm:p-8 lg:p-10">
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm mb-6 bg-red-50 p-3 rounded">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-light-gold font-sans font-medium mb-4">
                      Customer Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Full Name *</label>
                        <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required
                          className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required
                            className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Phone / WhatsApp *</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                            className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-champagne/50 pt-5">
                    <h3 className="text-xs uppercase tracking-widest text-light-gold font-sans font-medium mb-4">
                      Design Selection
                    </h3>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Select Design</label>
                      <select name="designId" value={formData.designId} onChange={handleChange}
                        className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors">
                        <option value="">Browse our collection first, or leave blank for custom request</option>
                        {designs.map((d) => {
                          const col = collections.find((c) => c.id === d.collectionId);
                          return (
                            <option key={d.id} value={d.id}>
                              {d.name} — {col?.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-champagne/50 pt-5">
                    <h3 className="text-xs uppercase tracking-widest text-light-gold font-sans font-medium mb-4">
                      Booking Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Preferred Date</label>
                          <input type="date" name="requestedDate" value={formData.requestedDate} onChange={handleChange}
                            className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Quantity</label>
                          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1"
                            className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Occasion</label>
                        <input type="text" name="occasion" value={formData.occasion} onChange={handleChange}
                          placeholder="Wedding, Navratri, Party..."
                          className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Customization Required?</label>
                        <select name="customization" value={formData.customization} onChange={handleChange}
                          className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors">
                          <option value="no">No, as shown</option>
                          <option value="color">Color change only</option>
                          <option value="size">Size modification</option>
                          <option value="full">Full customization</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Color Preference</label>
                        <input type="text" name="colorPreference" value={formData.colorPreference} onChange={handleChange}
                          placeholder="e.g., Red and gold..."
                          className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Size / Additional Details</label>
                        <input type="text" name="sizeDetails" value={formData.sizeDetails} onChange={handleChange}
                          placeholder="Size, specific requirements..."
                          className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-taupe font-sans mb-1.5">Additional Message</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                          placeholder="Any other details or questions..."
                          className="w-full border border-champagne bg-ivory px-4 py-2.5 text-sm text-espresso rounded-sm focus:border-light-gold focus:outline-none transition-colors resize-none" />
                      </div>
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full bg-espresso text-ivory py-3.5 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors mt-4">
                    Submit Booking Request
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
