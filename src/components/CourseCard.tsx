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
    <Card className="card-hover overflow-hidden group h-full flex flex-col">
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
          
          {/* Badges overlay */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {course.featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {course.upcoming && (
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Upcoming
              </Badge>
            )}
          </div>

          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            {course.difficulty && (
              <Badge className={difficultyColors[course.difficulty] || difficultyColors.beginner}>
                {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
              </Badge>
            )}
            {course.course_type && (
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                {courseTypeLabels[course.course_type] || course.course_type}
              </Badge>
            )}
          </div>

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge className="bg-destructive text-destructive-foreground text-xs">
                {discountPercent}% OFF
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2 flex-1">
        <div>
          <Link to={`/courses/${course.slug}`}>
            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {course.title}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {String(topic)}
              </Badge>
            ))}
            {topics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{topics.length - 3}
              </Badge>
            )}
          </div>
        )}

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
          {course.certificate && (
            <div className="flex items-center gap-1 text-amber-500">
              <Award className="w-3 h-3" />
              <span className="text-xs">Certificate</span>
            </div>
          )}
        </div>

        {course.start_date && (
          <div className="pt-1 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Starts: {new Date(course.start_date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-primary">${Number(course.price_offer).toLocaleString()}</span>
              <span className="text-xs text-muted-foreground line-through">${Number(course.price_regular).toLocaleString()}</span>
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
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
