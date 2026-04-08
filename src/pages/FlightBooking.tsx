import FeaturedReviewsSlider from '@/components/common/FeaturedReviewsSlider';
import Layout from '@/components/layout/Layout';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateFlightBooking, type FlightClass } from '@/services/useBookFlightService';
import { useFetchCMS } from '@/services/useCMSService';
import {
    ArrowRight,
    CheckCircle,
    Clock,
    Globe,
    Mail,
    MapPin,
    Phone,
    Plane,
    Shield,
    User,
    Zap
} from 'lucide-react';
import { useState } from 'react';

const FlightBooking = () => {
    const { language } = useLanguage();
    const { data: cmsData } = useFetchCMS(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        flightFrom: '',
        flightTo: '',
        departureDate: '',
        returnDate: '',
        numberOfPassengers: '1',
        flightClass: 'ECONOMY' as FlightClass,
        specialRequestNote: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const createFlightBookingMutation = useCreateFlightBooking();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (isSubmitted) setIsSubmitted(false);
    };

    const submitBookingRequest = async () => {
        if (createFlightBookingMutation.isPending) return;

        await createFlightBookingMutation.mutateAsync({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            flightFrom: formData.flightFrom.trim().toUpperCase(),
            flightTo: formData.flightTo.trim().toUpperCase(),
            departureDate: new Date(`${formData.departureDate}T00:00:00.000Z`).toISOString(),
            returnDate: new Date(`${formData.returnDate}T00:00:00.000Z`).toISOString(),
            numberOfPassengers: Number(formData.numberOfPassengers),
            flightClass: formData.flightClass,
            specialRequestNote: formData.specialRequestNote.trim() || undefined,
        });

        setIsConfirmOpen(false);
        setIsSubmitted(true);
        setFormData({
            name: '',
            email: '',
            phoneNumber: '',
            flightFrom: '',
            flightTo: '',
            departureDate: '',
            returnDate: '',
            numberOfPassengers: '1',
            flightClass: 'ECONOMY',
            specialRequestNote: ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (createFlightBookingMutation.isPending) return;
        setIsConfirmOpen(true);
    };

    const popularDestinations = [
        {
            city: language === 'en' ? 'Dubai' : 'دبي',
            country: language === 'en' ? 'United Arab Emirates' : 'الإمارات العربية المتحدة',
            airportCode: 'DXB',
            region: language === 'en' ? 'Middle East' : 'الشرق الأوسط',
            duration: language === 'en' ? 'Approx. 2h from Riyadh' : 'حوالي ساعتين من الرياض'
        },
        {
            city: language === 'en' ? 'Cairo' : 'القاهرة',
            country: language === 'en' ? 'Egypt' : 'مصر',
            airportCode: 'CAI',
            region: language === 'en' ? 'North Africa' : 'شمال أفريقيا',
            duration: language === 'en' ? 'Approx. 2h 30m from Riyadh' : 'حوالي ساعتين و30 دقيقة من الرياض'
        },
        {
            city: language === 'en' ? 'Istanbul' : 'اسطنبول',
            country: language === 'en' ? 'Türkiye' : 'تركيا',
            airportCode: 'IST',
            region: language === 'en' ? 'Europe / Asia' : 'أوروبا / آسيا',
            duration: language === 'en' ? 'Approx. 4h 30m from Riyadh' : 'حوالي 4 ساعات و30 دقيقة من الرياض'
        },
        {
            city: language === 'en' ? 'London' : 'لندن',
            country: language === 'en' ? 'United Kingdom' : 'المملكة المتحدة',
            airportCode: 'LHR',
            region: language === 'en' ? 'Europe' : 'أوروبا',
            duration: language === 'en' ? 'Approx. 7h from Riyadh' : 'حوالي 7 ساعات من الرياض'
        }
    ];

    const features = [
        {
            icon: Shield,
            title: language === 'en' ? 'Secure Booking' : 'حجز آمن',
            description: language === 'en' ? '100% secure payment processing' : 'معالجة دفع آمنة 100%'
        },
        {
            icon: Clock,
            title: language === 'en' ? '24/7 Support' : 'دعم على مدار الساعة',
            description: language === 'en' ? 'Round-the-clock customer assistance' : 'مساعدة العملاء على مدار الساعة'
        },
        {
            icon: Zap,
            title: language === 'en' ? 'Instant Confirmation' : 'تأكيد فوري',
            description: language === 'en' ? 'Get your tickets confirmed instantly' : 'احصل على تأكيد تذاكرك فورياً'
        }
    ];

    const cmsContact = cmsData?.data?.contact;
    const contactName =
        cmsContact?.name?.trim() ||
        cmsContact?.companyName?.trim() ||
        cmsContact?.company?.trim() ||
        (language === 'en' ? 'Business Navigator' : 'بزنس نافيجيتر');
    const contactPhone = cmsContact?.phone?.trim() || '+966 11 123 4567';
    const contactEmail = cmsContact?.email?.trim() || 'flights@business-navigator.com';

    return (
        <Layout>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {language === 'en' ? 'Confirm Booking Request' : 'تأكيد طلب الحجز'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {language === 'en'
                                ? 'Are you sure booking this request?'
                                : 'هل أنت متأكد من إرسال طلب الحجز هذا؟'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={createFlightBookingMutation.isPending}>
                            {language === 'en' ? 'Cancel' : 'إلغاء'}
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                type="button"
                                onClick={submitBookingRequest}
                                disabled={createFlightBookingMutation.isPending}
                            >
                                {createFlightBookingMutation.isPending
                                    ? (language === 'en' ? 'Submitting...' : 'جاري الإرسال...')
                                    : (language === 'en' ? 'Yes, Submit' : 'نعم، إرسال')}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isSubmitted} onOpenChange={setIsSubmitted}>
                <DialogContent className="max-w-xl overflow-hidden border-0 p-0">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-10 text-center text-white">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                            <CheckCircle className="h-12 w-12" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">
                            {language === 'en' ? 'Booking Request Sent!' : 'تم إرسال طلب الحجز!'}
                        </DialogTitle>
                    </div>

                    <div className="px-8 pb-8 pt-6 text-center">
                        <DialogDescription className="text-base leading-7 text-slate-700 dark:text-slate-300">
                            {language === 'en'
                                ? 'We will contact you shortly.'
                                : 'We will contact you shortly.'}
                        </DialogDescription>
                        <Button
                            type="button"
                            onClick={() => setIsSubmitted(false)}
                            className="mt-6 h-11 min-w-36"
                        >
                            {language === 'en' ? 'Got it' : 'Got it'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative container mx-auto px-4 py-16 md:py-24">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="p-3 bg-white/10 rounded-full">
                                <Plane className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold">
                                {language === 'en' ? 'Book Your Flight' : 'احجز رحلتك'}
                            </h1>
                        </div>
                        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
                            {language === 'en' 
                                ? 'Discover the world with our premium flight booking service'
                                : 'اكتشف العالم مع خدمة حجز الطيران المتميزة لدينا'
                            }
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-primary-foreground/90">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                <span>{language === 'en' ? 'Best Prices' : 'أفضل الأسعار'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                <span>{language === 'en' ? 'Easy Booking' : 'حجز سهل'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                <span>{language === 'en' ? '24/7 Support' : 'دعم 24/7'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Booking Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-t-lg">
                                <CardTitle className="text-2xl flex items-center gap-3">
                                    <Plane className="w-6 h-6" />
                                    {language === 'en' ? 'Flight Booking Form' : 'نموذج حجز الطيران'}
                                </CardTitle>
                                <CardDescription className="text-primary-foreground/90">
                                    {language === 'en' 
                                        ? 'Fill in your details to book your perfect flight'
                                        : 'املأ بياناتك لحجز رحلتك المثالية'
                                    }
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <User className="w-5 h-5 text-primary" />
                                            {language === 'en' ? 'Personal Information' : 'المعلومات الشخصية'}
                                        </h3>
                                        
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder={language === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'}
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder={language === 'en' ? '+966 50 123 4567' : '+966 50 123 4567'}
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Flight Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            {language === 'en' ? 'Flight Details' : 'تفاصيل الرحلة'}
                                        </h3>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="from" className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'From (Departure City)' : 'من (مدينة المغادرة)'}
                                                </Label>
                                                <Input
                                                    id="from"
                                                    type="text"
                                                    placeholder={language === 'en' ? 'e.g., RUH' : 'مثال: RUH'}
                                                    value={formData.flightFrom}
                                                    onChange={(e) => handleInputChange('flightFrom', e.target.value)}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="to" className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'To (Destination City)' : 'إلى (مدينة الوصول)'}
                                                </Label>
                                                <Input
                                                    id="to"
                                                    type="text"
                                                    placeholder={language === 'en' ? 'e.g., DXB' : 'مثال: DXB'}
                                                    value={formData.flightTo}
                                                    onChange={(e) => handleInputChange('flightTo', e.target.value)}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="departureDate" className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'Departure Date' : 'تاريخ المغادرة'}
                                                </Label>
                                                <Input
                                                    id="departureDate"
                                                    type="date"
                                                    min={minDate}
                                                    value={formData.departureDate}
                                                    onChange={(e) => handleInputChange('departureDate', e.target.value)}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="returnDate" className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'Return Date' : 'تاريخ العودة'}
                                                </Label>
                                                <Input
                                                    id="returnDate"
                                                    type="date"
                                                    min={formData.departureDate || minDate}
                                                    value={formData.returnDate}
                                                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                                                    className="h-12"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'Number of Passengers' : 'عدد المسافرين'}
                                                </Label>
                                                <Select value={formData.numberOfPassengers} onValueChange={(value) => handleInputChange('numberOfPassengers', value)}>
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">1 {language === 'en' ? 'Passenger' : 'مسافر'}</SelectItem>
                                                        <SelectItem value="2">2 {language === 'en' ? 'Passengers' : 'مسافرين'}</SelectItem>
                                                        <SelectItem value="3">3 {language === 'en' ? 'Passengers' : 'مسافرين'}</SelectItem>
                                                        <SelectItem value="4">4 {language === 'en' ? 'Passengers' : 'مسافرين'}</SelectItem>
                                                        <SelectItem value="5">5 {language === 'en' ? 'Passengers' : 'مسافرين'}</SelectItem>
                                                        <SelectItem value="6">6 {language === 'en' ? 'Passengers' : 'مسافرين'}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-slate-300">
                                                    {language === 'en' ? 'Flight Class' : 'درجة الطيران'}
                                                </Label>
                                                <Select value={formData.flightClass} onValueChange={(value: FlightClass) => handleInputChange('flightClass', value)}>
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ECONOMY">{language === 'en' ? 'Economy Class' : 'الدرجة السياحية'}</SelectItem>
                                                        <SelectItem value="PREMIUM_ECONOMY">{language === 'en' ? 'Premium Economy' : 'اقتصادية مميزة'}</SelectItem>
                                                        <SelectItem value="BUSINESS">{language === 'en' ? 'Business Class' : 'درجة رجال الأعمال'}</SelectItem>
                                                        <SelectItem value="FIRST">{language === 'en' ? 'First Class' : 'الدرجة الأولى'}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    <div className="space-y-2">
                                        <Label htmlFor="specialRequestNote" className="text-slate-700 dark:text-slate-300">
                                            {language === 'en' ? 'Special Requests (Optional)' : 'طلبات خاصة (اختياري)'}
                                        </Label>
                                        <Textarea
                                            id="specialRequestNote"
                                            placeholder={language === 'en' ? 'Any special requirements, meal preferences, etc.' : 'أي متطلبات خاصة، تفضيلات الطعام، إلخ.'}
                                            value={formData.specialRequestNote}
                                            onChange={(e) => handleInputChange('specialRequestNote', e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={createFlightBookingMutation.isPending}
                                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {createFlightBookingMutation.isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {language === 'en' ? 'Submitting...' : 'جاري الإرسال...'}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Plane className="w-5 h-5" />
                                                {language === 'en' ? 'Submit Booking Request' : 'إرسال طلب الحجز'}
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Popular Destinations */}
                        <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90">
                            <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    {language === 'en' ? 'Popular Destinations' : 'الوجهات الشائعة'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {popularDestinations.map((dest, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer group">
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                                                    {dest.city}
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{dest.country} • {dest.airportCode}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{dest.region}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-accent dark:text-accent">{dest.airportCode}</p>
                                                <p className="text-xs text-slate-500">{dest.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90">
                            <CardHeader className="bg-gradient-to-r from-primary to-accent text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    {language === 'en' ? 'Need Help?' : 'تحتاج مساعدة؟'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white" dir="ltr">{contactPhone}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{language === 'en' ? '24/7 Support' : 'دعم على مدار الساعة'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white" dir="ltr">{contactEmail}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{language === 'en' ? 'Email Support' : 'دعم البريد الإلكتروني'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            {language === 'en' ? 'Why Choose Our Service?' : 'لماذا تختار خدمتنا؟'}
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            {language === 'en' 
                                ? 'Experience the difference with our premium flight booking service'
                                : 'اختبر الفرق مع خدمة حجز الطيران المتميزة لدينا'
                            }
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center p-8 shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mt-16">
                    <FeaturedReviewsSlider
                        language={language}
                        title={language === 'en' ? 'What Our Customers Say' : 'ماذا يقول عملاؤنا'}
                        subtitle={
                            language === 'en'
                                ? 'Featured verified reviews from our travelers and clients.'
                                : 'تقييمات مميزة وموثوقة من المسافرين والعملاء.'
                        }
                    />
                </div>
            </div>
        </div>
        </Layout>
    );
};

export default FlightBooking;