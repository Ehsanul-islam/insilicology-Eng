import { motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  ImageIcon,
  MessageCircle,
  PackageCheck,
  Wrench,
  X,
  ZoomIn,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  getResearchServiceBySlug,
  getResearchWhatsappLink,
  getSampleAnalysisImageUrls,
  type ResearchService,
} from '@/data/researchServices';
import { useResearchServices } from '@/hooks/useResearchServices';

/* ------------------------------------------------------------------ */
/*  Image Lightbox                                                     */
/* ------------------------------------------------------------------ */

function ImageLightbox({
  urls,
  initialIndex,
  title,
  onClose,
}: {
  urls: string[];
  initialIndex: number;
  title?: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const n = urls.length;
  const safeIndex = ((index % n) + n) % n;

  const goPrev = useCallback(() => {
    if (n <= 1) return;
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const goNext = useCallback(() => {
    if (n <= 1) return;
    setIndex((i) => (i + 1) % n);
  }, [n]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goPrev, goNext]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:text-white transition-all"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Title */}
      {title && (
        <div className="absolute top-4 left-4 z-10">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-md border border-white/10">
            {title}
          </span>
        </div>
      )}

      {/* Navigation */}
      {n > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:text-white transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:text-white transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image */}
      <motion.img
        key={safeIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        src={urls[safeIndex]}
        alt={title || 'Sample analysis figure'}
        className="max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        referrerPolicy="no-referrer"
      />

      {/* Counter */}
      {n > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium tabular-nums text-white/90 backdrop-blur-md border border-white/10">
            {safeIndex + 1} / {n}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sample Analysis Image Carousel (inline cards)                      */
/* ------------------------------------------------------------------ */

function SampleAnalysisImageCarousel({
  urls,
  galleryKey,
  onImageClick,
}: {
  urls: string[];
  galleryKey: string;
  onImageClick?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    setIndex(0);
    setFailed(new Set());
  }, [galleryKey]);

  const n = urls.length;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (n <= 1) return;
    setIndex((i) => (i - 1 + n) % n);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (n <= 1) return;
    setIndex((i) => (i + 1) % n);
  };

  if (n === 0) {
    return (
      <div className="flex h-48 items-center justify-center border-b bg-muted/30">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  const safeIndex = ((index % n) + n) % n;
  const currentUrl = urls[safeIndex];
  const showNav = n > 1;
  const currentFailed = failed.has(safeIndex);

  return (
    <div
      className="relative overflow-hidden border-b bg-slate-950 cursor-pointer group/img"
      onClick={() => !currentFailed && onImageClick?.(safeIndex)}
    >
      {!currentFailed ? (
        <img
          key={`${galleryKey}-${safeIndex}`}
          src={currentUrl}
          alt=""
          className="h-48 w-full object-cover transition-transform duration-300 group-hover/img:scale-[1.03]"
          loading={safeIndex === 0 ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          onError={() => setFailed((prev) => new Set(prev).add(safeIndex))}
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-muted/20">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      {/* Zoom hint overlay */}
      {!currentFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/img:bg-black/30 transition-all duration-300 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-full bg-white/0 px-3 py-1.5 text-white/0 group-hover/img:bg-white/15 group-hover/img:text-white/90 backdrop-blur-none group-hover/img:backdrop-blur-sm transition-all duration-300 text-xs font-medium">
            <ZoomIn className="h-3.5 w-3.5" />
            Click to enlarge
          </div>
        </div>
      )}

      {showNav && (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 text-white shadow-md backdrop-blur-sm hover:bg-black/75 hover:text-white"
            aria-label="Previous figure"
            onClick={goPrev}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 text-white shadow-md backdrop-blur-sm hover:bg-black/75 hover:text-white"
            aria-label="Next figure"
            onClick={goNext}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
          <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center">
            <span className="rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-white/95 backdrop-blur-sm">
              {safeIndex + 1} / {n}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

const ResearchServiceDetail = () => {
  const { serviceSlug } = useParams();
  const { fetchPublishedServiceBySlug } = useResearchServices();
  const fallback = getResearchServiceBySlug(serviceSlug);
  const [service, setService] = useState<ResearchService | null>(fallback ?? null);
  const [loaded, setLoaded] = useState(false);

  // Lightbox state
  const [lightbox, setLightbox] = useState<{
    urls: string[];
    index: number;
    title?: string;
  } | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    let active = true;
    void (async () => {
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
                  {service.sampleAnalyses.map((analysis, index) => {
                    const imgKey = `${service.slug}-${index}-${analysis.title}`;
                    const urls = getSampleAnalysisImageUrls(analysis);
                    return (
                      <Card key={imgKey} className="overflow-hidden border-slate-200">
                        <SampleAnalysisImageCarousel
                          urls={urls}
                          galleryKey={imgKey}
                          onImageClick={(imgIndex) =>
                            urls.length > 0 &&
                            setLightbox({ urls, index: imgIndex, title: analysis.title })
                          }
                        />
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
                    );
                  })}
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
                  <Button size="sm" className="h-9 bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.03] hover:shadow-md border border-slate-200 transition-all duration-200" asChild>
                    <a
                      href={getResearchWhatsappLink(service.title)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.52 3.44C18.24 1.15 15.2 0 12 0 5.46 0 .14 5.32.14 11.87c0 2.09.55 4.13 1.59 5.93L0 24l6.38-1.67c1.74.96 3.71 1.46 5.76 1.46h.01c6.54 0 11.86-5.32 11.86-11.87 0-3.17-1.23-6.16-3.49-8.48zm-8.38 18.02h-.01c-1.77 0-3.51-.48-5.03-1.38l-.36-.21-3.74.98.99-3.64-.23-.37c-1-1.59-1.53-3.42-1.53-5.33 0-5.54 4.51-10.05 10.06-10.05 2.68 0 5.2 1.05 7.1 2.94 1.89 1.89 2.94 4.41 2.94 7.1-.01 5.53-4.52 10.04-10.05 10.04zm5.53-7.53c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.79-1.67-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.11 3.22 5.11 4.52.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z" fill="#25D366"/>
                      </svg>
                      WhatsApp Us
                    </a>
                  </Button>
                  <Button size="sm" className="h-9 bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.03] hover:shadow-md border border-slate-200 transition-all duration-200" asChild>
                    <a
                      href="https://t.me/+8801617082936"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="tg-b" x1="0.667" y1="0.167" x2="0.417" y2="0.75"><stop offset="0" stopColor="#37aee2"/><stop offset="1" stopColor="#1e96c8"/></linearGradient></defs>
                        <circle cx="120" cy="120" r="120" fill="url(#tg-b)"/>
                        <path d="M98 175c-3.89 0-3.23-1.47-4.57-5.17L82.1 132.37 170.4 80" fill="#c8daea"/>
                        <path d="M98 175c3 0 4.33-1.37 6-3l16-15.56-19.97-12.04" fill="#a9c9dd"/>
                        <path d="M100.04 144.4l48.36 35.73c5.52 3.04 9.5 1.47 10.88-5.13l19.69-92.82c2.02-8.07-3.07-11.73-8.34-9.33L53.75 113.21c-7.87 3.16-7.83 7.55-1.43 9.5l29.93 9.34 69.27-43.68c3.27-1.98 6.27-.92 3.81 1.27" fill="white"/>
                      </svg>
                      Telegram
                    </a>
                  </Button>
                  <Button size="sm" className="h-9 bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.03] hover:shadow-md border border-slate-200 transition-all duration-200" asChild>
                    <a
                      href={`mailto:info@insilicology.com?subject=${encodeURIComponent(service.title + ' Inquiry')}`}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="52 42 88 66" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>
                        <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>
                        <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>
                        <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/>
                        <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.46-14.4-.22-14.4 7.2"/>
                      </svg>
                      Email
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

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            urls={lightbox.urls}
            initialIndex={lightbox.index}
            title={lightbox.title}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
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
