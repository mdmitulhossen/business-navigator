import PageHero from '@/components/common/PageHero';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateReview } from '@/services/useReviewService';
import { CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';

const SubmitReview = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createReviewMutation = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim() || rating < 1 || rating > 5) {
      return;
    }

    await createReviewMutation.mutateAsync({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      comment: comment.trim(),
      rating,
    });

    setIsSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setComment('');
    setRating(5);
  };

  return (
    <Layout>
      <PageHero
        badge={isArabic ? 'مراجعات العملاء' : 'CUSTOMER REVIEWS'}
        title={isArabic ? 'شاركنا رأيك' : 'Share Your Experience'}
        subtitle={
          isArabic
            ? 'قيّم تجربتك معنا وساعد الآخرين في اتخاذ القرار.'
            : 'Rate your experience with us and help others make better decisions.'
        }
      />

      <section className="section-padding bg-background">
        <div className="container-custom max-w-2xl">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {isArabic ? 'نموذج التقييم' : 'Review Form'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                  <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
                  <p className="font-medium text-foreground">
                    {isArabic ? 'شكراً لك! تم إرسال تقييمك بنجاح.' : 'Thank you! Your review has been submitted successfully.'}
                  </p>
                </div>
              ) : null}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>{isArabic ? 'الاسم *' : 'Name *'}</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{isArabic ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{isArabic ? 'رقم الهاتف (اختياري)' : 'Phone (Optional)'}</Label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? 'التقييم (من 5) *' : 'Rating (out of 5) *'}</Label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          className="transition-transform hover:scale-110"
                          onClick={() => setRating(starValue)}
                          aria-label={`${starValue} star`}
                        >
                          <Star
                            className={`h-7 w-7 ${starValue <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? 'التعليق *' : 'Comment *'}</Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    required
                    placeholder={
                      isArabic
                        ? 'اكتب رأيك في الخدمة...' 
                        : 'Write your feedback about our service...'
                    }
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createReviewMutation.isPending}>
                  {createReviewMutation.isPending
                    ? isArabic
                      ? 'جارٍ الإرسال...'
                      : 'Submitting...'
                    : isArabic
                      ? 'إرسال التقييم'
                      : 'Submit Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default SubmitReview;
