import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, BarChart3, Award, ChevronRight, Star, CheckCircle2, PlayCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - replace with actual data fetching
  const course = {
    id: '1',
    slug: slug || 'web-development-bootcamp',
    title: 'Complete Web Development Bootcamp 2024',
    description: 'Master modern web development from scratch with HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and launch your career.',
    longDescription: 'This comprehensive bootcamp covers everything you need to become a professional web developer. Starting from the fundamentals of HTML and CSS, you\'ll progress through JavaScript, modern frameworks like React, backend development with Node.js, databases, and deployment strategies. Each module includes hands-on projects and real-world applications.',
    instructor: {
      name: 'Sarah Johnson',
      title: 'Senior Full-Stack Developer',
      avatar: '👩‍💻',
      bio: '10+ years of experience building web applications for Fortune 500 companies.',
    },
    price: 89,
    duration: '12 weeks',
    level: 'Beginner',
    category: 'Web Development',
    students: 15420,
    rating: 4.8,
    reviews: 2341,
    thumbnail: '/placeholder.svg',
    featured: true,
    whatYouLearn: [
      'Build responsive websites with HTML5, CSS3, and modern JavaScript',
      'Master React.js for building dynamic user interfaces',
      'Create RESTful APIs with Node.js and Express',
      'Work with databases like MongoDB and PostgreSQL',
      'Deploy applications to cloud platforms',
      'Implement authentication and authorization',
      'Write clean, maintainable code following best practices',
      'Build a professional portfolio with 10+ projects',
    ],
    curriculum: [
      {
        module: 'Introduction to Web Development',
        lessons: [
          { title: 'Welcome to the Course', duration: '5 min', free: true },
          { title: 'Setting Up Your Development Environment', duration: '15 min', free: true },
          { title: 'How the Web Works', duration: '20 min', free: false },
          { title: 'HTML Basics', duration: '45 min', free: false },
        ],
      },
      {
        module: 'CSS and Modern Layouts',
        lessons: [
          { title: 'CSS Fundamentals', duration: '30 min', free: false },
          { title: 'Flexbox Mastery', duration: '40 min', free: false },
          { title: 'CSS Grid Layouts', duration: '35 min', free: false },
          { title: 'Responsive Design Principles', duration: '50 min', free: false },
        ],
      },
      {
        module: 'JavaScript Programming',
        lessons: [
          { title: 'JavaScript Basics', duration: '40 min', free: false },
          { title: 'DOM Manipulation', duration: '45 min', free: false },
          { title: 'ES6+ Features', duration: '50 min', free: false },
          { title: 'Asynchronous JavaScript', duration: '60 min', free: false },
        ],
      },
      {
        module: 'React.js Framework',
        lessons: [
          { title: 'Introduction to React', duration: '25 min', free: false },
          { title: 'Components and Props', duration: '40 min', free: false },
          { title: 'State and Lifecycle', duration: '45 min', free: false },
          { title: 'React Hooks', duration: '55 min', free: false },
        ],
      },
    ],
    requirements: [
      'A computer with internet connection',
      'No prior programming experience required',
      'Willingness to learn and practice',
    ],
  };

  const handleEnroll = () => {
    if (!user) {
      navigate('/auth', { state: { returnTo: `/courses/${slug}` } });
    } else {
      // Handle enrollment logic
      console.log('Enrolling user in course:', slug);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${course.title} - LearnCraft`}
        description={course.description}
        url={`/courses/${slug}`}
        type="article"
        image={course.thumbnail}
        course={{
          id: course.id,
          title: course.title,
          description: course.description,
          instructor: course.instructor.name,
          price: course.price,
        }}
        tags={[course.category, course.level, 'online course', 'professional development']}
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-16">
          <div className="container-custom">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Link to="/courses" className="text-white/80 hover:text-white transition-colors">
                    Courses
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span>{course.category}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-white/90 mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-white/80">({course.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {course.level}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{course.instructor.avatar}</div>
                    <div>
                      <p className="font-semibold">{course.instructor.name}</p>
                      <p className="text-white/80 text-sm">{course.instructor.title}</p>
                    </div>
                  </div>
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {course.whatYouLearn.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Course Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Course curriculum</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {course.curriculum.map((module, moduleIndex) => (
                        <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="font-semibold">{module.module}</span>
                              <span className="text-sm text-muted-foreground">
                                {module.lessons.length} lessons
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pt-2">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lessonIndex}
                                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <PlayCircle className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{lesson.title}</span>
                                    {lesson.free && (
                                      <Badge variant="outline" className="text-xs">
                                        Free preview
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {lesson.duration}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                    <ul className="space-y-3">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* About Instructor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">About the instructor</h2>
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{course.instructor.avatar}</div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{course.instructor.name}</h3>
                        <p className="text-muted-foreground mb-3">{course.instructor.title}</p>
                        <p className="text-foreground/80">{course.instructor.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
                  <div className="aspect-video bg-gradient-to-br from-primary-dark to-primary relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold">${course.price}</span>
                        <span className="text-muted-foreground line-through">$199</span>
                      </div>
                      <p className="text-sm text-destructive font-semibold">55% off • Limited time offer</p>
                    </div>

                    <Button 
                      className="w-full btn-accent text-lg py-6" 
                      size="lg"
                      onClick={handleEnroll}
                    >
                      Enroll Now
                    </Button>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Duration</span>
                        </div>
                        <span className="font-semibold">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BarChart3 className="w-4 h-4" />
                          <span>Level</span>
                        </div>
                        <span className="font-semibold">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="w-4 h-4" />
                          <span>Certificate</span>
                        </div>
                        <span className="font-semibold">Yes</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">This course includes:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>Lifetime access</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>Certificate of completion</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>Downloadable resources</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>Access on mobile and desktop</span>
                        </li>
                      </ul>
                    </div>
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
