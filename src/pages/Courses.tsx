import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import SEOHead from '@/components/SEOHead';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allCourses = [
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
    {
      id: '4',
      title: 'Advanced JavaScript & TypeScript',
      description: 'Deep dive into modern JavaScript and TypeScript with advanced patterns and best practices.',
      instructor: 'Alex Thompson',
      duration: '45 hours',
      students: 6700,
      rating: 4.8,
      level: 'Advanced' as const,
      category: 'Web Development',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80',
      price: 69,
    },
    {
      id: '5',
      title: 'Digital Marketing Mastery',
      description: 'Complete digital marketing course covering SEO, social media, content marketing, and analytics.',
      instructor: 'Jennifer Lee',
      duration: '30 hours',
      students: 11200,
      rating: 4.6,
      level: 'Beginner' as const,
      category: 'Marketing',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      price: 55,
    },
    {
      id: '6',
      title: 'Cloud Computing with AWS',
      description: 'Master AWS services, cloud architecture, and deployment strategies for modern applications.',
      instructor: 'David Kumar',
      duration: '50 hours',
      students: 5800,
      rating: 4.9,
      level: 'Intermediate' as const,
      category: 'Cloud Computing',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      price: 89,
    },
  ];

  const categories = ['all', ...Array.from(new Set(allCourses.map(course => course.category)))];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="All Courses - Learn Web Development, Data Science, Design & More"
        description="Browse our complete catalog of expert-led online courses. Master web development, data science, UI/UX design, digital marketing, cloud computing and more. 50,000+ students learning."
        url="/courses"
        type="website"
        tags={['online courses', 'web development', 'data science', 'ui ux design', 'digital marketing', 'cloud computing', 'professional training']}
      />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Explore <span className="gradient-text">All Courses</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from {allCourses.length} courses across various categories to advance your career
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="md:w-64">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CourseCard {...course} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No courses found matching your criteria</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
