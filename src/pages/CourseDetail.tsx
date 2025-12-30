import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseDetail } from '@/hooks/useCourses';
import { EnrollmentDialog } from '@/components/EnrollmentDialog';

// Import all course detail components
import {
  VibeHeroSection,
  CourseDescription,
  ComparisonTable,
  TargetAudienceCards,
  CurriculumAccordion,
  InstructorSection,
  VideoTestimonials,
  PricingSection,
  FAQSection,
  StickyFooterCTA,
  EverythingYoureGettingSection,
} from '@/components/course-detail';

// Type definitions for JSON fields
interface Stats {
  students?: number;
  community?: string;
  support?: string;
  time?: string;
  capacity?: string;
  batch?: string;
}

interface ComparisonFeature {
  feature: string;
  us: boolean;
  others: boolean;
}

interface TargetAudienceItem {
  title: string;
  description: string;
  icon: string;
}

interface ValueBreakdownItem {
  item: string;
  original_price: number;
  is_premium?: boolean;
  sub_text?: string;
}

interface Testimonial {
  name: string;
  role?: string;
  video_url?: string;
  thumbnail?: string;
  text?: string;
  rating?: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ModuleItem {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
}

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { course, lessons, loading, error, isEnrolled, refetch } = useCourseDetail(slug);
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);

  // Handle enrollment button click
  const handleEnroll = () => {
    if (!user) {
      navigate('/auth', { state: { returnTo: `/courses/${slug}` } });
    } else if (isEnrolled) {
      navigate(`/learn/${course?.slug}`);
    } else {
      setEnrollmentOpen(true);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          {/* Hero Skeleton */}
          <div className="bg-[#f5f7ff] dark:bg-slate-900/50 py-16 lg:py-24">
            <div className="container-custom">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-12 w-40" />
                  <div className="flex gap-6">
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-16 w-32" />
                  </div>
                </div>
                <Skeleton className="aspect-video rounded-2xl" />
              </div>
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="container-custom py-12 space-y-12">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="text-6xl mb-6">📚</div>
              <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The course you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild size="lg">
                <Link to="/courses">Browse All Courses</Link>
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse JSON fields with type safety
  const stats = course.stats as Stats | null;
  const comparisonFeatures = (course.comparison_features as ComparisonFeature[] | null) || [];
  const targetAudience = (course.target_audience as TargetAudienceItem[] | null) || [];
  const valueBreakdown = (course.value_breakdown as ValueBreakdownItem[] | null) || [];
  const testimonials = (course.testimonials as Testimonial[] | null) || [];
  const faqs = (course.faq as FAQItem[] | null) || [];
  const whatsIncluded = Array.isArray(course.whats_included)
    ? (course.whats_included as string[])
    : [];
  const topics = Array.isArray(course.topics)
    ? (course.topics as string[])
    : [];
  const modules = (course.modules as ModuleItem[] | null) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Head */}
      <SEOHead
        title={`${course.title} - LearnCraft`}
        description={course.description || ''}
        url={`/courses/${slug}`}
        type="article"
        image={course.poster_url || ''}
        course={{
          id: course.id,
          title: course.title,
          description: course.description || '',
          instructor: course.instructor_name || 'Expert Instructor',
          price: Number(course.price_offer) || 0,
        }}
        tags={topics.map(String)}
      />

      <Navbar />

      <main className="pt-16">
        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: HERO
            - Subtitle badge, animated headline, YouTube embed, stats bar, CTA
        ═══════════════════════════════════════════════════════════════════ */}
        <VibeHeroSection
          title={course.title}
          subtitle={course.difficulty ? `${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)} Level Course` : undefined}
          promoVideoUrl={course.promo_video_url || undefined}
          posterUrl={course.poster_url || undefined}
          stats={stats || undefined}
          onEnrollClick={handleEnroll}
          isEnrolled={isEnrolled}
          upcoming={course.upcoming || false}
          startDate={course.start_date ? new Date(course.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined}
          endDate={course.end_date ? new Date(course.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined}
          courseTime={stats?.time || course.course_time || undefined}
          participantCount={course.participant_count || undefined}
          capacity={stats?.capacity || undefined}
          batch={stats?.batch || undefined}
          instructorName={course.instructor_name || undefined}
          priceRegular={course.price_regular ? Number(course.price_regular) : undefined}
          priceOffer={course.price_offer ? Number(course.price_offer) : undefined}
          duration={course.duration_text || undefined}
          modulesCount={course.module_count || undefined}
        />

        {/* Main Content Container */}
        <div className="space-y-16 lg:space-y-24 pt-0 pb-16 lg:pb-24">

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 2: COURSE DESCRIPTION
              - Rich text content with Read More and secondary CTA
          ═══════════════════════════════════════════════════════════════════ */}
          {course.description && (
            <section className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <CourseDescription
                  title={course.title}
                  description={course.description}
                  maxLength={600}
                  onEnrollClick={handleEnroll}
                  showCta={!isEnrolled}
                />
              </motion.div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 3: COMPARISON TABLE
              - What we offer vs Others feature checklist
          ═══════════════════════════════════════════════════════════════════ */}
          {comparisonFeatures.length > 0 && (
            <section className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <ComparisonTable
                  features={comparisonFeatures}
                  courseTitle={course.title}
                />
              </motion.div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 4: TARGET AUDIENCE
              - Who is this course for? with persona cards
          ═══════════════════════════════════════════════════════════════════ */}
          {targetAudience.length > 0 && (
            <section className="container-custom">
              <TargetAudienceCards audience={targetAudience} />
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 5: CURRICULUM
              - Module-based accordion with lessons
          ═══════════════════════════════════════════════════════════════════ */}
          {(lessons.length > 0 || modules.length > 0) && (
            <section className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <CurriculumAccordion
                  lessons={lessons}
                  modules={modules}
                  isEnrolled={isEnrolled}
                  courseTitle={course.title}
                />
              </motion.div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 6: INSTRUCTOR
              - Photo, name, title, bio, achievements
          ═══════════════════════════════════════════════════════════════════ */}
          {course.instructor_name && (
            <section className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <InstructorSection
                  name={course.instructor_name}
                  title={course.instructor_title || undefined}
                  bio={course.instructor_bio || undefined}
                  photo={course.instructor_photo || undefined}
                />
              </motion.div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 7: VIDEO TESTIMONIALS
              - Horizontal scrollable video/text testimonial cards
          ═══════════════════════════════════════════════════════════════════ */}
          {testimonials.length > 0 && (
            <section className="container-custom">
              <VideoTestimonials testimonials={testimonials} />
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 7.5: EVERYTHING YOU'RE GETTING
              - Value breakdown with purple banners and itemized list
          ═══════════════════════════════════════════════════════════════════ */}
          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 7.5 & 8: EVERYTHING YOU'RE GETTING & PRICING
              - Grouped to eliminate vertical spacing
          ═══════════════════════════════════════════════════════════════════ */}
          <div>
            {valueBreakdown.length > 0 && (
              <EverythingYoureGettingSection
                valueBreakdown={valueBreakdown}
                totalValue={valueBreakdown.reduce((sum, item) => sum + (item.original_price || 0), 0)}
                priceOffer={course.price_offer}
                priceRegular={course.price_regular}
                onEnrollClick={handleEnroll}
                isEnrolled={isEnrolled}
              />
            )}

            <section className="container-custom pt-8 lg:pt-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <PricingSection
                  priceOffer={course.price_offer}
                  priceRegular={course.price_regular}
                  valueBreakdown={valueBreakdown.length > 0 ? valueBreakdown : undefined}
                  countdownEndDate={course.countdown_end_date}
                  onEnrollClick={handleEnroll}
                  isEnrolled={isEnrolled}
                  upcoming={course.upcoming || false}
                  whatsIncluded={whatsIncluded.length > 0 ? whatsIncluded : undefined}
                />
              </motion.div>
            </section>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION 9: FAQ
              - Accordion Q&A
          ═══════════════════════════════════════════════════════════════════ */}
          {faqs.length > 0 && (
            <section className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
              >
                <FAQSection faqs={faqs} />
              </motion.div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 10: STICKY FOOTER CTA (Mobile)
          - Fixed bottom bar with price + enroll button
      ═══════════════════════════════════════════════════════════════════ */}
      <StickyFooterCTA
        price={course.price_offer}
        priceRegular={course.price_regular}
        onEnrollClick={handleEnroll}
        isEnrolled={isEnrolled}
        upcoming={course.upcoming || false}
        courseTitle={course.title}
      />

      {/* Enrollment Dialog */}
      {course && (
        <EnrollmentDialog
          course={{
            id: course.id,
            title: course.title,
            price_offer: course.price_offer,
            price_regular: course.price_regular,
            payment_methods: course.payment_methods as string[] | null,
            payment_instructions: course.payment_instructions,
            enrollment_form_fields: course.enrollment_form_fields as { id: string; label: string; type: string; required: boolean; placeholder?: string; options?: string[] }[] | null,
          }}
          open={enrollmentOpen}
          onOpenChange={setEnrollmentOpen}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default CourseDetail;
