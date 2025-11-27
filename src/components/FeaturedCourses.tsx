import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { Button } from './ui/button';

const FeaturedCourses = () => {
  const courses = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Master HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive full-stack development course.',
      instructor: 'Sarah Johnson',
      duration: '40 hours',
      students: 12500,
      rating: 4.8,
      level: 'Beginner' as const,
      category: 'Web Development',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      price: 49,
    },
    {
      id: '2',
      title: 'Data Science & Machine Learning Masterclass',
      description: 'Learn Python, data analysis, visualization, and build real-world ML models with hands-on projects.',
      instructor: 'Dr. Michael Chen',
      duration: '60 hours',
      students: 8900,
      rating: 4.9,
      level: 'Intermediate' as const,
      category: 'Data Science',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      price: 79,
    },
    {
      id: '3',
      title: 'UI/UX Design: From Concept to Prototype',
      description: 'Create stunning user interfaces and experiences using industry-standard tools and design principles.',
      instructor: 'Emma Rodriguez',
      duration: '35 hours',
      students: 15200,
      rating: 4.7,
      level: 'Beginner' as const,
      category: 'Design',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      price: 59,
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular courses designed by industry experts to help you achieve your goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard {...course} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="group" asChild>
            <Link to="/courses">
              View All Courses
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
