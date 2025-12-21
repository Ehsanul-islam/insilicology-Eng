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
        <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Our Portfolio
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Discover the innovative projects we've built for clients worldwide. From startups to enterprises, we deliver excellence.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <div className="text-3xl font-bold">150+</div>
                  <div className="text-sm text-white/80">Projects Delivered</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-white/80">Happy Clients</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <div className="text-3xl font-bold">25+</div>
                  <div className="text-sm text-white/80">Countries</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

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
