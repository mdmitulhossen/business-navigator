import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { serviceCategories, serviceCategoriesAr } from '@/data/demoData';
import { Building2, Calendar, CheckCircle, Clock, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';

const Appointment = () => {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    company: '',
    service: '',
    notes: '',
  });

  const categories = language === 'en' ? serviceCategories : serviceCategoriesAr;

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Appointment booked:', formData);
    setStep(3);
  };

  return (
    <Layout>
      <PageHero
        badge={language === 'en' ? 'APPOINTMENT' : 'حجز موعد'}
        title={language === 'en' ? 'Book Your Consultation' : 'احجز استشارتك'}
        subtitle={language === 'en' ? 'Schedule a free consultation with our expert team' : 'حدد موعداً لاستشارة مجانية مع فريق الخبراء لدينا'}
      />

      {/* Booking Section */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded transition-colors ${step > s ? 'bg-accent' : 'bg-muted'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-2xl p-8 animate-fade-in">
              <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
                {language === 'en' ? 'Select Date & Time' : 'اختر التاريخ والوقت'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="form-label flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {language === 'en' ? 'Select Date' : 'اختر التاريخ'}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="form-label flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {language === 'en' ? 'Select Time' : 'اختر الوقت'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, time }))}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${formData.time === time
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.date || !formData.time}
                className="w-full mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                {language === 'en' ? 'Continue' : 'متابعة'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 animate-fade-in">
              <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
                {language === 'en' ? 'Your Information' : 'معلوماتك'}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {language === 'en' ? 'Company Name (Optional)' : 'اسم الشركة (اختياري)'}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    {language === 'en' ? 'Service Required' : 'الخدمة المطلوبة'}
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">{language === 'en' ? 'Select a service...' : 'اختر الخدمة...'}</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    {language === 'en' ? 'Additional Notes (Optional)' : 'ملاحظات إضافية (اختياري)'}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="form-input resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  size="lg"
                >
                  {language === 'en' ? 'Back' : 'رجوع'}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  {language === 'en' ? 'Confirm Booking' : 'تأكيد الحجز'}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="bg-card border border-border rounded-2xl p-12 text-center animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-4">
                {language === 'en' ? 'Booking Confirmed!' : 'تم تأكيد الحجز!'}
              </h2>
              <p className="text-muted-foreground mb-2">
                {language === 'en'
                  ? `Your appointment is scheduled for ${formData.date} at ${formData.time}`
                  : `موعدك محجوز في ${formData.date} الساعة ${formData.time}`}
              </p>
              <p className="text-muted-foreground mb-8">
                {language === 'en'
                  ? 'We will send you a confirmation email shortly.'
                  : 'سنرسل لك بريد تأكيد قريباً.'}
              </p>
              <Button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    date: '',
                    time: '',
                    name: '',
                    phone: '',
                    email: '',
                    company: '',
                    service: '',
                    notes: '',
                  });
                }}
                variant="outline"
                size="lg"
              >
                {language === 'en' ? 'Book Another Appointment' : 'حجز موعد آخر'}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Appointment;
