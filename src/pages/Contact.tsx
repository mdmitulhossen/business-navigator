import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { serviceCategories, serviceCategoriesAr } from '@/data/demoData';
import { useFetchCMS } from '@/services/useCMSService';
import { useCreateContact, type CreateContactPayload } from '@/services/useContactService';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

type LatLng = [number, number];

const DEFAULT_CENTER: LatLng = [23.8103, 90.4125];

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Contact = () => {
  const { t, language } = useLanguage();
  const { pathname } = useLocation();
  const { data: cmsData } = useFetchCMS(true);
  const createContactMutation = useCreateContact();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLng>(DEFAULT_CENTER);

  const cmsContact = cmsData?.data?.contact;

  useEffect(() => {
    const address = cmsContact?.address?.trim();

    if (!address) {
      setMapCenter(DEFAULT_CENTER);
      return;
    }

    const controller = new AbortController();

    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
            },
          },
        );

        if (!response.ok) return;

        const result = (await response.json()) as Array<{ lat: string; lon: string }>;
        const first = result[0];
        if (!first) return;

        const lat = Number(first.lat);
        const lng = Number(first.lon);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          setMapCenter([lat, lng]);
        }
      } catch {
        // no-op: keep fallback center
      }
    };

    geocodeAddress();

    return () => controller.abort();
  }, [cmsContact?.address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateContactPayload = {
      name: formData.name.trim(),
      phoneNumber: formData.phone.trim(),
      email: formData.email.trim(),
      companyName: formData.company.trim(),
      serviceType: formData.service.trim(),
      message: formData.message.trim(),
    };

    try {
      await createContactMutation.mutateAsync(payload);
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        service: '',
        message: '',
      });
      setSuccessOpen(true);
    } catch {
      // toast already handled in service hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = useMemo(
    () => [
      {
        icon: MapPin,
        labelKey: 'contact.office',
        value: cmsContact?.address || t('contact.address'),
      },
      {
        icon: Phone,
        labelKey: 'contact.phoneLabel',
        value: cmsContact?.phone || '+966 11 234 5678',
      },
      {
        icon: Mail,
        labelKey: 'contact.emailLabel',
        value: cmsContact?.email || 'info@consultant.sa',
      },
      {
        icon: Clock,
        labelKey: 'contact.hours',
        value: cmsContact?.workingTime || t('contact.hoursValue'),
      },
    ],
    [cmsContact?.address, cmsContact?.email, cmsContact?.phone, cmsContact?.workingTime, t],
  );

  const categories = language === 'en' ? serviceCategories : serviceCategoriesAr;

  return (
    <Layout>
      <PageHero badge={t('contact.label')} title={t('contact.title')} />

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="bg-muted rounded-2xl p-8 mb-8">
                <h2 className="font-display font-bold text-2xl mb-8 text-primary">
                  {t('contact.office')}
                </h2>
                <ul className="space-y-6">
                  {contactInfo.map((item) => (
                    <li key={item.labelKey} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-primary mb-1 dark:text-foreground/70">
                          {t(item.labelKey)}
                        </p>
                        <p className="font-medium" dir={item.labelKey === 'contact.phoneLabel' ? 'ltr' : undefined}>
                          {item.value}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map */}
              <div className="bg-muted rounded-2xl h-64 overflow-hidden">
                <MapContainer center={mapCenter} zoom={14} className="h-full w-full" scrollWheelZoom={false}>
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={mapCenter}>
                    <Popup>
                      {cmsContact?.address || (language === 'en' ? 'Our office location' : 'موقع المكتب')}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                {t('contact.formTitle')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('contact.formSubtitle')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">{t('contact.name')}</label>
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
                    <label className="form-label">{t('contact.phone')}</label>
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
                    <label className="form-label">{t('contact.email')}</label>
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
                    <label className="form-label">{t('contact.company')}</label>
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
                  <label className="form-label">{t('contact.service')}</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">{t('common.selectService')}</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('contact.message')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="form-input resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={createContactMutation.isPending}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {createContactMutation.isPending
                    ? (language === 'en' ? 'Submitting...' : 'جاري الإرسال...')
                    : t('contact.submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-center">
              {language === 'en' ? 'Request Submitted' : 'تم إرسال الطلب'}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {language === 'en' ? 'We will contact you shortly.' : 'سنتواصل معك قريبًا.'}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Contact;
