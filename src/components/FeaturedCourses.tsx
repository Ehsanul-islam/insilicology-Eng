import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;

const FeaturedCourses = () => {
  const { data: courses = [], isLoading: loading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id, title, slug, poster_url, price_offer, price_regular,
          course_type, difficulty, start_date, end_date, certificate,
          upcoming, duration_text, module_count, topics, status, featured, created_at
        `)
        .eq('status', 'published')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Course[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <section className="pt-8 pb-8 bg-white">
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Featured Courses
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-bio-teal to-bio-gold rounded-full mx-auto"></div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured courses available at the moment.</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-bio-teal hover:opacity-90 text-white font-semibold px-8"
            asChild
          >
            <Link to="/academy">
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
