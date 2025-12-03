import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, Users, BarChart3, Award, ChevronRight, Star, CheckCircle2, 
  PlayCircle, Sparkles, Calendar, Download, FileText, Lock, BookOpen,
  Target, Zap, ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseDetail } from '@/hooks/useCourses';
import ImageSkeleton from '@/components/ImageSkeleton';

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { course, lessons, reviews, resources, loading, error, isEnrolled } = useCourseDetail(slug);

  const handleEnroll = () => {
    if (!user) {
      navigate('/auth', { state: { returnTo: `/courses/${slug}` } });
    } else {
      // TODO: Handle enrollment/payment flow
      console.log('Enrolling user in course:', slug);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background py-16">
            <div className="container-custom">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          <div className="container-custom py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasDiscount = course.price_regular && course.price_offer && course.price_offer < course.price_regular;
  const discountPercent = hasDiscount 
    ? Math.round(((Number(course.price_regular) - Number(course.price_offer)) / Number(course.price_regular)) * 100)
    : 0;

  const learningOutcomes = Array.isArray(course.learning_outcomes) ? course.learning_outcomes as string[] : [];
  const requirements = Array.isArray(course.requirements) ? course.requirements as string[] : [];
  const whatsIncluded = Array.isArray(course.whats_included) ? course.whats_included as string[] : [];
  const topics = Array.isArray(course.topics) ? course.topics as string[] : [];
  const roadmap = Array.isArray(course.roadmap) ? course.roadmap as { title: string; description: string }[] : [];
  const whyJoin = Array.isArray(course.why_join) ? course.why_join as string[] : [];

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen">
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
          instructor: 'Expert Instructor',
          price: Number(course.price_offer) || 0,
        }}
        tags={topics.map(String)}
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/20 via-primary/10 to-background py-12 lg:py-16">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Link to="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                    Courses
                  </Link>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{course.title}</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.featured && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {course.upcoming && (
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                      <Calendar className="w-3 h-3 mr-1" />
                      Upcoming
                    </Badge>
                  )}
                  {course.difficulty && (
                    <Badge variant="secondary">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{avgRating}</span>
                      <span className="text-muted-foreground">({reviews.length} reviews)</span>
                    </div>
                  )}
                  {course.duration_text && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span>{course.duration_text}</span>
                    </div>
                  )}
                  {course.module_count && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-5 h-5" />
                      <span>{course.module_count} modules</span>
                    </div>
                  )}
                </div>

                {/* Topics */}
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic, index) => (
                      <Badge key={index} variant="outline">
                        {String(topic)}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Course Poster */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <ImageSkeleton
                    src={course.poster_url || '/placeholder.svg'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    width={800}
                    height={450}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              {learningOutcomes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6 text-primary" />
                        What you'll learn
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {learningOutcomes.map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{String(item)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Learning Roadmap */}
              {roadmap.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ArrowRight className="w-6 h-6 text-primary" />
                        Learning Roadmap
                      </h2>
                      <div className="space-y-4">
                        {roadmap.map((step, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              {index < roadmap.length - 1 && (
                                <div className="w-0.5 h-full bg-border mt-2" />
                              )}
                            </div>
                            <div className="pb-6">
                              <h3 className="font-semibold mb-1">{step.title}</h3>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Why Join */}
              {whyJoin.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-primary" />
                        Why Join This Course?
                      </h2>
                      <ul className="space-y-3">
                        {whyJoin.map((reason, index) => (
                          <li key={index} className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{String(reason)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Course Curriculum */}
              {lessons.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        Course Curriculum
                      </h2>
                      <div className="space-y-2">
                        {lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.is_preview || isEnrolled ? (
                                <PlayCircle className="w-5 h-5 text-primary" />
                              ) : (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                              )}
                              <div>
                                <span className="text-sm text-muted-foreground mr-2">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="font-medium">{lesson.title}</span>
                              </div>
                              {lesson.is_preview && !isEnrolled && (
                                <Badge variant="outline" className="text-xs">
                                  Free Preview
                                </Badge>
                              )}
                            </div>
                            {lesson.duration_minutes && (
                              <span className="text-sm text-muted-foreground">
                                {lesson.duration_minutes} min
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                      <ul className="space-y-3">
                        {requirements.map((req, index) => (
                          <li key={index} className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{String(req)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Resources (for enrolled students) */}
              {isEnrolled && resources.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        Course Resources
                      </h2>
                      <div className="space-y-3">
                        {resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Download className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">{resource.title}</p>
                                {resource.description && (
                                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                                )}
                              </div>
                            </div>
                            {resource.file_type && (
                              <Badge variant="outline">{resource.file_type.toUpperCase()}</Badge>
                            )}
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6 text-primary" />
                        Student Reviews ({reviews.length})
                      </h2>
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.profiles?.avatar_url || ''} />
                                <AvatarFallback>
                                  {review.profiles?.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</p>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < (review.rating || 0)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                {review.comment && (
                                  <p className="text-foreground/80">{review.comment}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-24"
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6 space-y-6">
                    {/* Price */}
                    <div>
                      {hasDiscount ? (
                        <>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-3xl font-bold text-primary">
                              ৳{Number(course.price_offer).toLocaleString()}
                            </span>
                            <span className="text-muted-foreground line-through">
                              ৳{Number(course.price_regular).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-destructive font-semibold">
                            {discountPercent}% off • Limited time offer
                          </p>
                        </>
                      ) : course.price_offer ? (
                        <span className="text-3xl font-bold">
                          ৳{Number(course.price_offer).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-3xl font-bold text-green-600">Free</span>
                      )}
                    </div>

                    {/* Start Date */}
                    {course.start_date && (
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            Starts: {new Date(course.start_date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Enroll Button */}
                    {isEnrolled ? (
                      <Button className="w-full" size="lg" asChild>
                        <Link to={`/learn/${course.slug}`}>
                          Continue Learning
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        className="w-full btn-accent text-lg py-6" 
                        size="lg"
                        onClick={handleEnroll}
                      >
                        {course.upcoming ? 'Pre-Register' : 'Enroll Now'}
                      </Button>
                    )}

                    {/* Course Info */}
                    <div className="space-y-3 text-sm">
                      {course.duration_text && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Duration</span>
                          </div>
                          <span className="font-semibold">{course.duration_text}</span>
                        </div>
                      )}
                      {course.difficulty && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <BarChart3 className="w-4 h-4" />
                            <span>Level</span>
                          </div>
                          <span className="font-semibold">
                            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                          </span>
                        </div>
                      )}
                      {course.module_count && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            <span>Modules</span>
                          </div>
                          <span className="font-semibold">{course.module_count}</span>
                        </div>
                      )}
                      {course.certificate && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Award className="w-4 h-4" />
                            <span>Certificate</span>
                          </div>
                          <span className="font-semibold text-green-600">Yes</span>
                        </div>
                      )}
                    </div>

                    {/* What's Included */}
                    {whatsIncluded.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm font-semibold mb-3">This course includes:</p>
                        <ul className="space-y-2 text-sm">
                          {whatsIncluded.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              <span>{String(item)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
