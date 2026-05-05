import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Github,
  ImageIcon,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
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

  const galleryImages = Array.isArray(project.gallery_images) ? project.gallery_images : [];
  const projectFacts = [
    project.client_name && { icon: Building2, label: 'Client', value: project.client_name },
    project.country && { icon: MapPin, label: 'Location', value: project.country },
    project.duration_text && { icon: Clock, label: 'Timeline', value: project.duration_text },
    project.team_size && { icon: Users, label: 'Team', value: project.team_size },
  ].filter(Boolean);

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

      <main className="pt-16 bg-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-950 text-white py-10 md:py-12">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
          <div className="absolute -top-40 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute top-20 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3 text-xs text-white/70">
                <Link to="/portfolio" className="hover:text-white transition-colors">
                  Portfolio
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span>{project.category || 'Project'}</span>
              </div>

              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur text-xs font-semibold text-cyan-100 mb-3">
                    <Sparkles className="w-4 h-4" />
                    Premium Case Study
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 mb-5 max-w-3xl leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-2 mb-5">
                    {projectFacts.map((fact: any) => (
                      <div key={fact.label} className="flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 p-3 backdrop-blur">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                          <fact.icon className="w-4 h-4 text-cyan-200" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{fact.label}</p>
                          <p className="text-sm font-semibold text-white">{fact.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="sm" className="bg-white text-slate-950 hover:bg-cyan-50">
                      <Link to="/contact">
                        Request Similar Project
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    {project.demo_url && (
                      <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                        <a href={project.demo_url} target="_blank" rel="noreferrer">
                          Live Demo
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                        <a href={project.github_url} target="_blank" rel="noreferrer">
                          Source
                          <Github className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/20 to-primary/20 rounded-[2rem] blur-2xl" />
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                    {project.hero_image_url ? (
                      <img
                        src={project.hero_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        Security-aware delivery with approval-ready documentation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              {project.description && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Project Overview</h2>
                    </div>
                    <div className="prose max-w-none prose-p:text-slate-600 prose-headings:text-slate-950">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {project.description}
                      </ReactMarkdown>
                    </div>
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
                  <h2 className="text-2xl font-bold mb-4">Challenges</h2>
                  <div className="space-y-4">
                    {project.challenges.map((challenge: any, index: number) => (
                      <Card key={index} className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <h3 className="text-lg font-bold mb-1.5">{challenge.title}</h3>
                          <p className="text-sm text-slate-600">{challenge.description}</p>
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
                  <h2 className="text-2xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-4">
                    {project.solutions.map((solution: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-primary bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <h3 className="text-lg font-bold mb-1.5 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            {solution.title}
                          </h3>
                          <p className="text-sm text-slate-600 ml-7">{solution.description}</p>
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
                  <h2 className="text-2xl font-bold mb-4">Results & Impact</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.results.map((result: any, index: number) => (
                      <Card key={index} className="group border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardContent className="p-5 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-3xl font-black text-primary mb-1.5 group-hover:scale-105 transition-transform">{result.metric}</div>
                          <p className="text-sm text-slate-600">{result.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <h2 className="text-2xl font-bold mb-4">Project Gallery</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {galleryImages.map((imageUrl: string, index: number) => (
                      <div key={`${imageUrl}-${index}`} className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                        <img src={imageUrl} alt={`${project.title} gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
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
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold mb-3">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="rounded-full">
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
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold mb-3">Services Provided</h3>
                        <ul className="space-y-2.5 text-sm">
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold">Trust & Approval</h3>
                      </div>
                      <div className="space-y-2.5 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          Approval-ready project documentation
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          Security-conscious implementation approach
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          Clear success metrics and handover notes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gradient-to-br from-slate-950 via-primary-dark to-primary text-white shadow-xl">
                    <CardContent className="p-5 text-center">
                      <h3 className="text-lg font-bold mb-2">Have a Similar Project?</h3>
                      <p className="text-sm text-white/90 mb-4">
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
