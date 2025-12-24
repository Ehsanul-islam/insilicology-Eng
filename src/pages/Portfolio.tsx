import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import PortfolioInsights from '@/components/PortfolioInsights';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { fetchPublishedPortfolios, fetchCategories } = usePortfolio();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [portfolioData, categoryData] = await Promise.all([
        fetchPublishedPortfolios(),
        fetchCategories(),
      ]);
      setProjects(portfolioData);
      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { slug: 'all', name: 'All' },
    ...categories.map(cat => ({ slug: cat.slug, name: cat.name })),
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Portfolio - Real-World Projects & Case Studies | LearnCraft"
        description="Explore our portfolio of successful projects across web development, mobile apps, data science, and design. See how we transform ideas into reality."
        url="/portfolio"
        type="website"
        tags={['portfolio', 'case studies', 'web development projects', 'mobile apps', 'data science']}
      />
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="vibe-section-light border-b border-border/40 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-50" />

          <div className="container-custom py-12 md:py-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
            >
              {/* Left Content */}
              <div className="text-center md:text-left md:max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                  Our Portfolio
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
                  Discover the innovative projects we've built for clients worldwide. From startups to enterprises, we deliver excellence everywhere.
                </p>
              </div>

              {/* Right Stats - Compact Grid */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 w-full md:w-auto">
                <div className="flex flex-col items-center md:items-start p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl font-bold text-primary">150+</div>
                  <div className="text-xs md:text-sm font-medium text-muted-foreground mt-1">Projects</div>
                </div>
                <div className="flex flex-col items-center md:items-start p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
                  <div className="text-xs md:text-sm font-medium text-muted-foreground mt-1">Clients</div>
                </div>
                <div className="flex flex-col items-center md:items-start p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="text-2xl md:text-3xl font-bold text-primary">25+</div>
                  <div className="text-xs md:text-sm font-medium text-muted-foreground mt-1">Countries</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Insights Section */}
        <PortfolioInsights />

        {/* Filter Section */}
        <section className="py-8 border-b border-border">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              {categoryOptions.map((category) => (
                <Button
                  key={category.slug}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.slug)}
                  className="capitalize"
                >
                  {category.name}
                </Button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container-custom">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading projects...</p>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/portfolio/${project.slug}`}>
                      <Card className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Image */}
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                          {project.hero_image_url ? (
                            <img
                              src={project.hero_image_url}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-6xl opacity-50">📊</div>
                            </div>
                          )}
                          {project.featured && (
                            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                              Featured
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-6 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {project.summary}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {project.client_name && (
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{project.client_name}</span>
                              </div>
                            )}
                            {project.country && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{project.country}</span>
                              </div>
                            )}
                          </div>

                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.slice(0, 3).map((tech: string) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{project.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="pt-4 flex items-center justify-between border-t border-border">
                            <span className="text-sm text-muted-foreground">
                              {project.duration_text || 'View project'}
                            </span>
                            <div className="flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                              <span>View Case Study</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No projects found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-dark to-primary text-white">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Let's discuss how we can help bring your vision to life with cutting-edge technology and expert development.
              </p>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
