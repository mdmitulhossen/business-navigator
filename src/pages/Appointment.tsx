import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFetchAppointmentSlots } from '@/services/useAppointmentSlotService';
import { useCreateAppointment, useFetchAppointments } from '@/services/useBookAppointmentService';
import { useFetchServices } from '@/services/useService';
import { Building2, Calendar, CheckCircle, Clock, Mail, Phone, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const Appointment = () => {
  const { language, t } = useLanguage();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAppointmentMutation = useCreateAppointment();
  const { data: appointmentsData, isLoading: isAppointmentsLoading } = useFetchAppointments({ limit: 1000 }, true);
  const {
    data: appointmentSlotsData,
    isLoading: isAppointmentSlotsLoading,
    isError: isAppointmentSlotsError,
  } = useFetchAppointmentSlots(true);
  const { data: servicesData, isLoading: isServicesLoading } = useFetchServices({ isActive: true, limit: 1000 }, true);

  const timeSlots = useMemo(() => appointmentSlotsData?.data?.timeSlots ?? [], [appointmentSlotsData?.data?.timeSlots]);
  const serviceOptions = servicesData?.data ?? [];

  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0];

  const bookedSlotsForSelectedDate = useMemo(() => {
    if (!formData.date) return new Set<string>();

    const selectedDateKey = formData.date;
    const booked = (appointmentsData?.data ?? [])
      .filter((appointment) => appointment.date?.slice(0, 10) === selectedDateKey)
      .map((appointment) => appointment.slotTime);

    return new Set(booked);
  }, [appointmentsData?.data, formData.date]);

  const isSelectedSlotBooked = formData.time ? bookedSlotsForSelectedDate.has(formData.time) : false;

  useEffect(() => {
    if (formData.time && !timeSlots.includes(formData.time)) {
      setFormData((prev) => ({ ...prev, time: '' }));
    }
  }, [formData.time, timeSlots]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSelectedSlotBooked) return;

    try {
      setIsSubmitting(true);
      await createAppointmentMutation.mutateAsync({
        name: formData.name.trim(),
        phoneNumber: formData.phone.trim(),
        email: formData.email.trim(),
        companyName: formData.company.trim(),
        service: formData.service,
        additionalNotes: formData.notes.trim() || undefined,
        date: new Date(`${formData.date}T00:00:00.000Z`).toISOString(),
        slotTime: formData.time,
      });
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
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
                    min={minDate}
                    required
                  />
                </div>

                <div>
                  <label className="form-label flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {language === 'en' ? 'Select Time' : 'اختر الوقت'}
                  </label>
                  {isAppointmentSlotsLoading ? (
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Loading available slots...' : 'جارٍ تحميل الأوقات المتاحة...'}
                    </p>
                  ) : isAppointmentSlotsError ? (
                    <p className="text-sm text-rose-600 dark:text-rose-300">
                      {language === 'en' ? 'No available slots here.' : 'لا توجد أوقات متاحة هنا.'}
                    </p>
                  ) : !timeSlots.length ? (
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'No available slots here.' : 'لا توجد أوقات متاحة هنا.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            if (!bookedSlotsForSelectedDate.has(time)) {
                              setFormData(prev => ({ ...prev, time }));
                            }
                          }}
                          disabled={isAppointmentsLoading || isAppointmentSlotsLoading || bookedSlotsForSelectedDate.has(time)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${formData.time === time
                              ? 'bg-accent text-accent-foreground'
                              : bookedSlotsForSelectedDate.has(time)
                                ? 'cursor-not-allowed bg-rose-500/10 text-rose-700 line-through opacity-70 dark:text-rose-300'
                                : 'bg-muted text-foreground hover:bg-muted/80'
                            }`}
                        >
                          <span className="block">{time}</span>
                          {bookedSlotsForSelectedDate.has(time) ? (
                            <span className="block text-sm font-bold uppercase tracking-wide">Booked</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {isAppointmentSlotsLoading || isAppointmentsLoading
                      ? language === 'en'
                        ? 'Checking available slots...'
                        : 'جارٍ فحص الأوقات المتاحة...'
                      : language === 'en'
                        ? 'Booked slots are disabled for the selected date.'
                        : 'الأوقات المحجوزة معطلة للتاريخ المحدد.'}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.date || !formData.time || isSelectedSlotBooked || isAppointmentSlotsLoading || !timeSlots.length}
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
                    disabled={isServicesLoading}
                    required
                  >
                    <option value="">
                      {isServicesLoading
                        ? language === 'en'
                          ? 'Loading services...'
                          : 'جارٍ تحميل الخدمات...'
                        : language === 'en'
                          ? 'Select a service...'
                          : 'اختر الخدمة...'}
                    </option>
                    {serviceOptions.map((service) => (
                      <option key={service.id} value={service.id}>
                        {t(service.titleKey)}
                      </option>
                    ))}
                  </select>
                  {!isServicesLoading && !serviceOptions.length ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {language === 'en' ? 'No active services available right now.' : 'لا توجد خدمات نشطة متاحة حالياً.'}
                    </p>
                  ) : null}
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
                  disabled={isSubmitting || createAppointmentMutation.isPending}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  {isSubmitting || createAppointmentMutation.isPending
                    ? language === 'en'
                      ? 'Booking...'
                      : 'جارٍ الحجز...'
                    : language === 'en'
                      ? 'Confirm Booking'
                      : 'تأكيد الحجز'}
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
                  ? 'We will contact with you shortly.'
                  : 'سنقوم بالاتصال بك قريباً.'}
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
