import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Building2, MapPin, Calendar, Users, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PortfolioDetail = () => {
  const { slug } = useParams();

  // Mock data - replace with actual data fetching
  const project = {
    id: '1',
    slug: slug || 'fintech-banking-app',
    title: 'FinTech Banking Application',
    summary: 'A modern digital banking platform with real-time transactions, AI-powered insights, and seamless user experience.',
    description: 'Developed a comprehensive digital banking solution that revolutionizes how customers manage their finances. The platform integrates cutting-edge security features, real-time transaction processing, and AI-powered financial insights to provide users with a superior banking experience.',
    client: 'GlobalBank Inc.',
    country: 'United States',
    duration: '6 months',
    teamSize: '12 members',
    category: 'Web Development',
    heroImage: '/placeholder.svg',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Redis', 'Docker', 'Kubernetes'],
    services: [
      'Full-Stack Development',
      'Cloud Infrastructure',
      'Security Implementation',
      'UI/UX Design',
      'DevOps & Deployment',
      'Quality Assurance',
    ],
    results: [
      { metric: '3M+', description: 'Active users within first year' },
      { metric: '99.9%', description: 'Uptime achieved' },
      { metric: '50%', description: 'Reduction in transaction time' },
      { metric: '4.8/5', description: 'User satisfaction rating' },
    ],
    challenges: [
      {
        title: 'Security & Compliance',
        description: 'Implementing bank-grade security while maintaining user-friendly experience and meeting regulatory requirements.',
      },
      {
        title: 'Real-time Processing',
        description: 'Building infrastructure to handle millions of concurrent transactions with minimal latency.',
      },
      {
        title: 'Legacy System Integration',
        description: 'Seamlessly integrating with existing banking systems while building modern microservices architecture.',
      },
    ],
    solutions: [
      {
        title: 'Multi-layer Security',
        description: 'Implemented end-to-end encryption, biometric authentication, and AI-powered fraud detection.',
      },
      {
        title: 'Scalable Architecture',
        description: 'Built microservices architecture with auto-scaling capabilities and distributed caching.',
      },
      {
        title: 'API Gateway',
        description: 'Developed robust API layer to bridge modern and legacy systems with real-time synchronization.',
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${project.title} - Portfolio Case Study | LearnCraft`}
        description={project.summary}
        url={`/portfolio/${slug}`}
        type="article"
        image={project.heroImage}
        tags={[project.category, 'case study', ...project.technologies]}
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4 text-white/80">
                <Link to="/portfolio" className="hover:text-white transition-colors">
                  Portfolio
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span>{project.category}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl">{project.summary}</p>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <span>{project.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{project.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{project.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{project.teamSize}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="bg-muted py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center"
            >
              <div className="text-8xl opacity-50">📊</div>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
                <p className="text-lg text-foreground/80 leading-relaxed">{project.description}</p>
              </motion.section>

              {/* Challenges */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-6">Challenges</h2>
                <div className="space-y-6">
                  {project.challenges.map((challenge, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                        <p className="text-foreground/80">{challenge.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>

              {/* Solutions */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-6">Solutions</h2>
                <div className="space-y-6">
                  {project.solutions.map((solution, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          {solution.title}
                        </h3>
                        <p className="text-foreground/80 ml-7">{solution.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>

              {/* Results */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6">Results & Impact</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {project.results.map((result, index) => (
                    <Card key={index} className="bg-gradient-to-br from-primary/5 to-accent/5">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-4xl font-bold text-primary mb-2">{result.metric}</div>
                        <p className="text-foreground/80">{result.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Technologies */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Services */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Services Provided</h3>
                      <ul className="space-y-3">
                        {project.services.map((service, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gradient-to-br from-primary to-primary-dark text-white">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-2">Have a Similar Project?</h3>
                      <p className="text-white/90 mb-4">
                        Let's discuss how we can help you achieve your goals.
                      </p>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                        <Link to="/contact">
                          Contact Us
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioDetail;
