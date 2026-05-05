import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  hero_image_url: string | null;
  client_name: string | null;
  country: string | null;
  duration_text: string | null;
  technologies: string[] | null;
  featured: boolean | null;
};

const demoCaseStudies: CaseStudy[] = [
  {
    id: 'demo-1',
    slug: 'biotech-analytics-portal',
    title: 'Biotech Analytics Portal',
    summary: 'Built a secure analytics platform for genomics teams with automated dashboards and stakeholder-ready reporting.',
    hero_image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    client_name: 'NovaGen Labs',
    country: 'USA',
    duration_text: '14 weeks',
    technologies: ['React', 'TypeScript', 'Supabase'],
    featured: true,
  },
  {
    id: 'demo-2',
    slug: 'clinical-ops-workflow-automation',
    title: 'Clinical Ops Workflow Automation',
    summary: 'Automated clinical operations workflow with role-based approvals, reducing manual handoffs and review delays.',
    hero_image_url: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=1200&q=80',
    client_name: 'MedAxis Program',
    country: 'Germany',
    duration_text: '10 weeks',
    technologies: ['Next.js', 'Node.js', 'Redis'],
    featured: true,
  },
  {
    id: 'demo-3',
    slug: 'learning-platform-revamp',
    title: 'Learning Platform Revamp',
    summary: 'Redesigned an enterprise learning product with premium UX, better engagement loops, and measurable retention growth.',
    hero_image_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    client_name: 'SkillForge Academy',
    country: 'Bangladesh',
    duration_text: '12 weeks',
    technologies: ['React', 'Framer Motion', 'Vite'],
    featured: false,
  },
  {
    id: 'demo-4',
    slug: 'research-data-workbench',
    title: 'Research Data Workbench',
    summary: 'Created a collaborative research workspace for dataset review, protocol tracking, and publication-ready insights.',
    hero_image_url: 'https://images.unsplash.com/photo-1581093458791-9d42f3d9347f?auto=format&fit=crop&w=1200&q=80',
    client_name: 'BioQuest Research',
    country: 'Singapore',
    duration_text: '16 weeks',
    technologies: ['PostgreSQL', 'Tailwind CSS', 'Analytics'],
    featured: false,
  },
];

const CaseStudies = () => {
  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ['homepage-case-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('id, slug, title, summary, hero_image_url, client_name, country, duration_text, technologies, featured')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error loading homepage case studies:', error);
        return demoCaseStudies;
      }

      return data && data.length > 0 ? (data as CaseStudy[]) : demoCaseStudies;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="py-16 bg-gradient-to-b from-white via-secondary/20 to-white">
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-bio-teal mb-3">
              Case Studies
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Work From Our Portfolio
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-bio-teal to-bio-gold rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A quick look at recent builds, research workflows, and product experiences delivered for clients and learners.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {caseStudies.slice(0, 4).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Link to={`/portfolio/${project.slug}`} className="block h-full">
                  <Card className="group h-full overflow-hidden border-border/70 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="h-32 sm:h-[8.5rem] lg:h-28 xl:h-32 bg-gradient-to-br from-primary/10 to-accent/20 relative overflow-hidden">
                      {project.hero_image_url ? (
                        <img
                          src={project.hero_image_url}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40">
                          📊
                        </div>
                      )}
                      {project.featured && (
                        <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] px-2 py-0.5">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-3 space-y-2">
                      <div>
                        <h3 className="text-sm font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                          {project.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        {project.client_name && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span className="line-clamp-1">{project.client_name}</span>
                          </div>
                        )}
                        {project.country && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{project.country}</span>
                          </div>
                        )}
                      </div>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 2).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 2 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              +{project.technologies.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="pt-1.5 flex items-center justify-between border-t border-border">
                        <span className="text-[11px] text-muted-foreground">
                          {project.duration_text || 'Case study'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                          View
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-bio-teal text-bio-teal hover:bg-bio-teal hover:text-white font-semibold px-8"
            asChild
          >
            <Link to="/portfolio">
              View All Portfolio
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudies;
