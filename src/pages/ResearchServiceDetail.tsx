import { motion } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Clock,
  HelpCircle,
  ImageIcon,
  MessageCircle,
  PackageCheck,
  Wrench,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  getResearchServiceBySlug,
  getResearchWhatsappLink,
  type ResearchService,
} from '@/data/researchServices';
import { useResearchServices } from '@/hooks/useResearchServices';

const ResearchServiceDetail = () => {
  const { serviceSlug } = useParams();
  const { fetchPublishedServiceBySlug } = useResearchServices();
  const fallback = getResearchServiceBySlug(serviceSlug);
  const [service, setService] = useState<ResearchService | null>(fallback ?? null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!serviceSlug) {
        setLoaded(true);
        return;
      }
      const remote = await fetchPublishedServiceBySlug(serviceSlug);
      if (!active) return;
      if (remote) {
        setService(remote);
      } else if (fallback) {
        setService(fallback);
      }
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  if (loaded && !service) {
    return <Navigate to="/research" replace />;
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading service...</div>
      </div>
    );
  }

  const ServiceIcon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={service.seoTitle}
        description={service.seoDescription}
        url={`/research/${service.slug}`}
      />
      <Navbar />

      <main className="pt-16">
        {/* Compact Hero */}
        <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${service.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
          <div className="container-custom relative z-10 py-8 md:py-12">
            <Button
              variant="ghost"
              className="mb-4 h-8 px-0 text-xs text-white/80 hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link to="/research">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Research Services
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${service.accent} shadow-lg`}
                  >
                    <ServiceIcon className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                    Research Service
                  </p>
                </div>
                <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
                  {service.title}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
                <Button size="sm" className="h-9" asChild>
                  <a
                    href={getResearchWhatsappLink(service.title)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Discuss This Service
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  asChild
                >
                  <Link to="/contact">Send Detailed Inquiry</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Compact Stats Bar */}
        <section className="border-b bg-muted/20 py-4">
          <div className="container-custom grid gap-2.5 sm:grid-cols-3">
            {[
              { label: 'Timeline', value: service.timeline, icon: Clock },
              { label: 'Pricing', value: service.price, icon: BadgeDollarSign },
              {
                label: 'Outputs',
                value: `${service.deliverables.length}+ deliverables`,
                icon: PackageCheck,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-primary/10 bg-background px-3.5 py-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="truncate text-sm font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-10">
          <div className="container-custom grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Scope */}
              <section>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                  Scope
                </p>
                <h2 className="text-2xl font-bold tracking-tight md:text-[1.6rem]">
                  What This Service Includes
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {service.overviewBullets.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-lg border bg-muted/20 px-3 py-2 text-xs leading-relaxed text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Service Types */}
              <section>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                  Types & Workflows
                </p>
                <h2 className="text-2xl font-bold tracking-tight md:text-[1.6rem]">
                  Available Service Types
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.serviceTypes.map((type) => (
                    <div
                      key={type.title}
                      className="rounded-xl border border-slate-200 bg-background p-4 transition-shadow hover:shadow-sm"
                    >
                      <h3 className="text-sm font-bold">{type.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sample Outputs - kept exactly as-is per the request */}
              <section>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  Analysis
                </p>
                <h2 className="text-3xl font-bold tracking-tight">Sample Outputs And Figures</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {service.sampleAnalyses.map((analysis) => (
                    <Card key={analysis.title} className="overflow-hidden border-slate-200">
                      {analysis.image ? (
                        <div className="border-b bg-slate-950">
                          <img
                            src={analysis.image}
                            alt={`${analysis.title} example`}
                            className="h-48 w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="flex h-32 items-center justify-center border-b bg-muted/30">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <h3 className="font-bold">{analysis.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {analysis.description}
                        </p>
                        {analysis.caption && (
                          <p className="mt-3 text-xs font-medium text-primary">
                            {analysis.caption}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                  FAQ
                </p>
                <h2 className="text-2xl font-bold tracking-tight md:text-[1.6rem]">
                  Common Questions
                </h2>
                <div className="mt-4 space-y-2.5">
                  {service.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="rounded-xl border border-slate-200 bg-background p-4"
                    >
                      <div className="flex gap-2.5">
                        <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold">{faq.question}</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar - compact card style matching the screenshot */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <CompactInfoCard
                title="What We Need From You"
                items={service.clientRequirements}
              />

              <CompactInfoCard title="Deliverables" items={service.deliverables} />

              {/* Tools - chips style */}
              <div className="rounded-2xl border border-slate-200 bg-background p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <h3 className="text-base font-bold tracking-tight">Tools & Software</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {service.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      <Wrench className="h-3 w-3" />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="overflow-hidden rounded-2xl border-0 bg-[#0a0a0a] p-5 text-white shadow-lg">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                  Ready To Start?
                </p>
                <h2 className="mt-1.5 text-xl font-black">Send your project details</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  We will review your files, recommend the right workflow, and confirm timeline before
                  starting.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button size="sm" className="h-9" asChild>
                    <a
                      href={getResearchWhatsappLink(service.title)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp Us
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    asChild
                  >
                    <Link to="/contact">
                      Contact Form
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const CompactInfoCard = ({ title, items }: { title: string; items: string[] }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-background p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h3 className="text-base font-bold tracking-tight">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-[13px] leading-snug text-foreground/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResearchServiceDetail;
