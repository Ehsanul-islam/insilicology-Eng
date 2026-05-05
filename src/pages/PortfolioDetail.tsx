import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Building2, MapPin, Calendar, Users, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/hooks/usePortfolio';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const demoCaseStudies: Record<string, any> = {
  'biotech-analytics-portal': {
    title: 'Biotech Analytics Portal',
    summary: 'Built a secure analytics platform for genomics teams with automated dashboards and stakeholder-ready reporting.',
    category: 'Health Tech',
    hero_image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=80',
    client_name: 'NovaGen Labs',
    country: 'USA',
    duration_text: '14 weeks',
    team_size: '6 specialists',
    description:
      'We modernized a fragmented analytics workflow into a single secure portal. The new system unified data ingestion, KPI dashboards, and export-ready executive reports. It improved speed, reduced manual analysis work, and supported compliance-friendly access controls.',
    challenges: [
      { title: 'Disconnected data sources', description: 'Teams used multiple tools without a central source of truth, causing delays and inconsistency.' },
      { title: 'Slow reporting cycles', description: 'Creating review-ready reports required manual extraction and repetitive formatting.' },
    ],
    solutions: [
      { title: 'Unified analytics workspace', description: 'Created one portal to manage datasets, insights, and progress tracking in real time.' },
      { title: 'Role-based access control', description: 'Implemented permission layers to protect sensitive data and keep audits clean.' },
      { title: 'Automated reporting pipeline', description: 'Introduced templates and scheduled exports to speed up stakeholder communication.' },
    ],
    results: [
      { metric: '42%', description: 'Faster reporting turnaround' },
      { metric: '3x', description: 'Improvement in onboarding speed' },
      { metric: '99.9%', description: 'Platform uptime during pilot' },
      { metric: '35%', description: 'Reduction in manual QA effort' },
    ],
    technologies: ['React', 'TypeScript', 'PostgreSQL', 'Supabase'],
    services: ['Product Design', 'Full-stack Development', 'Analytics Engineering', 'Security Hardening'],
  },
  'clinical-ops-workflow-automation': {
    title: 'Clinical Ops Workflow Automation',
    summary: 'Automated clinical operations workflow with role-based approvals, reducing manual handoffs and review delays.',
    category: 'Automation',
    hero_image_url: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=1400&q=80',
    client_name: 'MedAxis Program',
    country: 'Germany',
    duration_text: '10 weeks',
    team_size: '5 specialists',
    description:
      'This engagement focused on replacing spreadsheet-driven operations with a workflow engine. We delivered a reliable approval system, traceable state transitions, and actionable operations dashboards for program managers.',
    challenges: [
      { title: 'Manual approval bottlenecks', description: 'Approvals depended on email threads and lacked visibility across teams.' },
      { title: 'Limited traceability', description: 'No clear audit timeline for who changed what, and when.' },
    ],
    solutions: [
      { title: 'Workflow orchestration', description: 'Modeled each operational stage with validation and automatic state updates.' },
      { title: 'Approval controls', description: 'Added reviewer queues and escalation rules to prevent stalled requests.' },
      { title: 'Audit and activity logs', description: 'Built a transparent history view for compliance and management reviews.' },
    ],
    results: [
      { metric: '2.6x', description: 'Increase in process throughput' },
      { metric: '58%', description: 'Fewer support tickets' },
      { metric: '30%', description: 'Lower operational cost' },
      { metric: '92', description: 'Post-launch stakeholder NPS' },
    ],
    technologies: ['Next.js', 'Node.js', 'Redis', 'Tailwind CSS'],
    services: ['Workflow Design', 'Backend Automation', 'QA & UAT Support', 'Deployment'],
  },
  'learning-platform-revamp': {
    title: 'Learning Platform Revamp',
    summary: 'Redesigned an enterprise learning product with premium UX, better engagement loops, and measurable retention growth.',
    category: 'EdTech',
    hero_image_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80',
    client_name: 'SkillForge Academy',
    country: 'Bangladesh',
    duration_text: '12 weeks',
    team_size: '7 specialists',
    description:
      'We redesigned the product experience, improved content discovery, and introduced engagement mechanics to increase completion and retention. The platform now provides a cleaner learner flow and stronger admin insight.',
    challenges: [
      { title: 'Low content engagement', description: 'Learners struggled to discover relevant modules and dropped early.' },
      { title: 'Weak performance insights', description: 'The team had limited visibility into outcomes and bottlenecks.' },
    ],
    solutions: [
      { title: 'UX modernization', description: 'Delivered a cleaner navigation model and focused learning path design.' },
      { title: 'Engagement loop optimization', description: 'Introduced progress milestones, reminders, and improved dashboard cues.' },
      { title: 'Admin analytics panel', description: 'Added cohort-level metrics for completion, drop-off, and activity trends.' },
    ],
    results: [
      { metric: '67%', description: 'Growth in monthly active learners' },
      { metric: '49%', description: 'Improvement in completion rate' },
      { metric: '2.1x', description: 'Increase in content engagement' },
      { metric: '24h', description: 'Average release cycle time' },
    ],
    technologies: ['React', 'Framer Motion', 'Supabase Auth', 'Vite'],
    services: ['UX Strategy', 'Frontend Development', 'Auth Integration', 'Performance Optimization'],
  },
};

const PortfolioDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { fetchPortfolioBySlug } = usePortfolio();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadProject();
  }, [slug]);

  const loadProject = async () => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPortfolioBySlug(slug);
      if (data && data.status === 'published') {
        setProject(data);
        setNotFound(false);
      } else {
        const demoProject = demoCaseStudies[slug];
        if (demoProject) {
          setProject(demoProject);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      const demoProject = slug ? demoCaseStudies[slug] : null;
      if (demoProject) {
        setProject(demoProject);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen">
        <SEOHead
          title="Portfolio Not Found | insilicology"
          description="The portfolio project you're looking for doesn't exist."
          robots="noindex,nofollow"
        />
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The portfolio project you're looking for doesn't exist or is no longer available.
          </p>
          <Button asChild>
            <Link to="/portfolio">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Portfolio
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${project.title} - Portfolio Case Study | insilicology`}
        description={project.summary}
        url={`/portfolio/${slug}`}
        type="article"
        image={project.hero_image_url}
        tags={[project.category, 'case study', ...(project.technologies || [])]}
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
                <span>{project.category || 'Project'}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl">{project.summary}</p>

              <div className="flex flex-wrap gap-6">
                {project.client_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>{project.client_name}</span>
                  </div>
                )}
                {project.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{project.country}</span>
                  </div>
                )}
                {project.duration_text && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{project.duration_text}</span>
                  </div>
                )}
                {project.team_size && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{project.team_size}</span>
                  </div>
                )}
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
              className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden"
            >
              {project.hero_image_url ? (
                <img
                  src={project.hero_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-8xl opacity-50">📊</div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              {project.description && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.description}
                    </ReactMarkdown>
                  </div>
                </motion.section>
              )}

              {/* Challenges */}
              {project.challenges && project.challenges.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-6">Challenges</h2>
                  <div className="space-y-6">
                    {project.challenges.map((challenge: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                          <p className="text-foreground/80">{challenge.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Solutions */}
              {project.solutions && project.solutions.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold mb-6">Solutions</h2>
                  <div className="space-y-6">
                    {project.solutions.map((solution: any, index: number) => (
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
              )}

              {/* Results */}
              {project.results && project.results.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-6">Results & Impact</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {project.results.map((result: any, index: number) => (
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
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech: string) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Services */}
                {project.services && project.services.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4">Services Provided</h3>
                        <ul className="space-y-3">
                          {project.services.map((service: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

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
