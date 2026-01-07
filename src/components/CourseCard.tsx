import { Link } from 'react-router-dom';
import { Clock, Award, Star, Sparkles, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ImageSkeleton from './ImageSkeleton';
import { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    intermediate: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    advanced: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  };

  const courseTypeLabels: Record<string, string> = {
    recorded: 'Recorded',
    live: 'Live',
    hybrid: 'Hybrid',
  };

  const hasDiscount = course.price_regular && course.price_offer && course.price_offer < course.price_regular;
  const discountPercent = hasDiscount
    ? Math.round(((Number(course.price_regular) - Number(course.price_offer)) / Number(course.price_regular)) * 100)
    : 0;

  const topics = Array.isArray(course.topics) ? course.topics as string[] : [];

  return (
    <Card className="card-hover group h-full flex flex-col backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-white/20 shadow-xl overflow-hidden relative">

      <CardHeader className="p-0">
        <div className="relative overflow-hidden aspect-video">
          <ImageSkeleton
            src={course.poster_url || '/placeholder.svg'}
            alt={`${course.title} course poster`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            width={800}
            height={450}
            loading="lazy"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-4 px-4 space-y-1 flex-1">
        {/* Badges Row - Live, Date, Certificate, Upcoming */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live Badge - Only for live courses */}
          {course.course_type === 'live' && (
            <div className="flex items-center gap-1 text-red-600">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" fill="white" />
                <path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-medium">Live</span>
            </div>
          )}

          {/* Date Range Badge - Only for live courses with dates */}
          {course.course_type === 'live' && course.start_date && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-xs font-medium">
                {new Date(course.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {course.end_date && ` - ${new Date(course.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </span>
            </div>
          )}

          {/* Certificate Badge */}
          {course.certificate && (
            <div className="flex items-center gap-1 text-amber-500">
              <Award className="w-3 h-3" />
              <span className="text-xs font-medium">Certificate</span>
            </div>
          )}

          {/* Upcoming Badge - Only when admin marks as upcoming */}
          {course.upcoming && (
            <div className="flex items-center gap-1 text-green-600">
              <Calendar className="w-3 h-3" />
              <span className="text-xs font-medium">Upcoming</span>
            </div>
          )}
        </div>

        <div>
          <Link to={`/courses/${course.slug}`}>
            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {course.title}
            </h3>
          </Link>
        </div>

        {/* Topics */}


        <div className="flex items-center justify-between text-xs">
          {course.duration_text && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{course.duration_text}</span>
            </div>
          )}
          {course.module_count && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>{course.module_count} modules</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-primary">${Number(course.price_offer).toLocaleString()}</span>
                <span className="text-xs text-muted-foreground line-through">${Number(course.price_regular).toLocaleString()}</span>
                <Badge className="bg-destructive text-white text-[10px] px-1.5 h-5">
                  {discountPercent}% OFF
                </Badge>
              </>
            ) : course.price_offer ? (
              <span className="text-xl font-bold">${Number(course.price_offer).toLocaleString()}</span>
            ) : (
              <span className="text-xl font-bold text-green-600">Free</span>
            )}
          </div>
          <Button className="btn-primary" asChild>
            <Link to={`/courses/${course.slug}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
