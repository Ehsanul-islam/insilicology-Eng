import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BadgeDollarSign, CheckCircle2, ClipboardList, MessageCircle, PackageCheck, SearchCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResearchInsights from '@/components/ResearchInsights';
import {
    getResearchWhatsappLink,
    researchServices as fallbackServices,
    type ResearchService,
} from '@/data/researchServices';
import { useResearchServices } from '@/hooks/useResearchServices';

const Research = () => {
    const { fetchPublishedServices } = useResearchServices();
    const [researchServices, setResearchServices] = useState<ResearchService[]>(fallbackServices);

    useEffect(() => {
        let active = true;
        void (async () => {
            const remote = await fetchPublishedServices();
            if (active && remote.length > 0) {
                setResearchServices(remote);
            }
        })();
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const processSteps = [
        {
            title: 'Share Requirements',
            description: 'Send structures, sequences, datasets, target papers, and the outputs you need.',
            icon: ClipboardList,
        },
        {
            title: 'Scope Review',
            description: 'We confirm feasibility, workflow, timeline, and the most useful analyses.',
            icon: SearchCheck,
        },
        {
            title: 'Analysis & Reporting',
            description: 'You receive results, figures, tables, files, and an interpretation-focused report.',
            icon: PackageCheck,
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Research Services - Docking, MD, DFT, CADD & Bioinformatics | insilicology"
                description="Expert research services including Molecular Docking, Molecular Dynamics, DFT calculations, Bioinformatics, Network Pharmacology, Vaccine Design, CADD, and Metagenomics analysis."
                url="/research"
            />
            <Navbar />

            <main className="pt-16">
                {/* Hero Section */}
                <section className="relative pt-2 pb-4 overflow-hidden bg-[#0a0a0a] text-white border-b border-white/5">
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

                    <div className="container-custom relative z-10">
                        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                            {/* Left Column: Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="max-w-2xl"
                            >
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold mb-2">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                                    </span>
                                    RESEARCH & SERVICES
                                </div>

                                <h1 className="text-3xl md:text-5xl font-black mb-1 tracking-tighter leading-tight">
                                    Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Scientific Research</span> Services
                                </h1>

                                <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed font-medium">
                                    Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-semibold">CADD, computational chemistry, and bioinformatics</span> services
                                </p>
                            </motion.div>

                            {/* Right Column: Compact Horizontal Stats */}
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {[
                                    { label: 'Projects', value: '100+' },
                                    { label: 'Research Areas', value: '8+' },
                                    { label: 'Success Rate', value: '95%' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px] p-2 md:p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all hover:scale-105 group backdrop-blur-sm"
                                    >
                                        <span className="text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">{stat.value}</span>
                                        <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{stat.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Research Insights Section */}
                <ResearchInsights />

                {/* Services Grid */}
                <section className="py-12">
                    <div className="container-custom space-y-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">Research Services</p>
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Choose the Right Scientific Workflow</h2>
                            <p className="mt-3 text-muted-foreground">
                                Start with the overview, then open each service page for workflow types, analyses, client requirements, and deliverables.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {researchServices.map((service, index) => (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className={`h-full hover:shadow-lg transition-all group ${service.cardClass}`}>
                                        <CardHeader className="p-5 pb-3">
                                            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${service.bg} group-hover:scale-110 transition-transform`}>
                                                <service.icon className={`h-5 w-5 ${service.color}`} />
                                            </div>
                                            <CardTitle className="text-lg leading-tight">{service.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 pt-0">
                                            <CardDescription className="mb-4 text-sm leading-relaxed">
                                                {service.description}
                                            </CardDescription>
                                            <Button variant="outline" size="sm" className="w-full group/btn" asChild>
                                                <Link to={`/research/${service.slug}`}>
                                                    View Details
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Preview */}
                <section className="bg-muted/20 py-12">
                    <div className="container-custom">
                        <div className="grid gap-4 md:grid-cols-3">
                            {processSteps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full border-primary/10 bg-background shadow-sm">
                                        <CardContent className="p-5">
                                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                                <step.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-bold">{step.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Service Details Preview */}
                <section className="bg-muted/20 py-12">
                    <div className="container-custom space-y-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">Service Details</p>
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Explore Each Research Service</h2>
                            <p className="mt-3 text-muted-foreground">
                                Review the scope, workflow types, expected outputs, client inputs, and tools for each service before starting a conversation.
                            </p>
                        </div>

                        {researchServices.map((service, index) => (
                            <motion.article
                                id={service.id}
                                key={service.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="scroll-mt-24 overflow-hidden rounded-2xl border bg-background shadow-sm"
                            >
                                <div className={`grid gap-0 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                                    <div
                                        className="relative min-h-[220px] bg-cover bg-center lg:min-h-[260px]"
                                        style={{
                                            backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.78), rgba(2, 6, 23, 0.2)), url(${service.image})`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                                        <div className="relative flex h-full min-h-[220px] flex-col justify-end p-5 text-white lg:min-h-[260px] lg:p-6">
                                            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${service.accent} shadow-lg`}>
                                                <service.icon className="h-5 w-5" />
                                            </div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Research Service</p>
                                            <h3 className="mt-1.5 text-2xl font-black tracking-tight">{service.title}</h3>
                                        </div>
                                    </div>

                                    <div className="p-5 md:p-6 lg:p-7">
                                        <p className="text-sm leading-relaxed text-muted-foreground">{service.summary}</p>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl border bg-muted/30 p-3">
                                                <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                    <BadgeDollarSign className="h-4 w-4 text-primary" />
                                                    Price
                                                </div>
                                                <p className="text-base font-bold">{service.price}</p>
                                                <p className="mt-0.5 text-[11px] text-muted-foreground">Depends on scope and dataset size.</p>
                                            </div>
                                            <div className="rounded-xl border bg-muted/30 p-3">
                                                <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                                    <PackageCheck className="h-4 w-4 text-primary" />
                                                    Delivery
                                                </div>
                                                <p className="text-base font-bold">{service.timeline}</p>
                                                <p className="mt-0.5 text-[11px] text-muted-foreground">Confirmed after requirement review.</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="mb-2 text-sm font-semibold">Deliverables</h4>
                                            <div className="grid gap-1.5 sm:grid-cols-2">
                                                {service.deliverables.slice(0, 4).map((item) => (
                                                    <div key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="mb-2 text-sm font-semibold">Common Tools</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {service.tools.map((tool) => (
                                                    <span key={tool} className="rounded-full border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <Button size="sm" className="bg-white text-slate-800 hover:bg-slate-50 hover:scale-[1.03] hover:shadow-md border border-slate-200 shadow-sm transition-all duration-200" asChild>
                                                <a href={getResearchWhatsappLink(service.title)} target="_blank" rel="noreferrer">
                                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M20.52 3.44C18.24 1.15 15.2 0 12 0 5.46 0 .14 5.32.14 11.87c0 2.09.55 4.13 1.59 5.93L0 24l6.38-1.67c1.74.96 3.71 1.46 5.76 1.46h.01c6.54 0 11.86-5.32 11.86-11.87 0-3.17-1.23-6.16-3.49-8.48zm-8.38 18.02h-.01c-1.77 0-3.51-.48-5.03-1.38l-.36-.21-3.74.98.99-3.64-.23-.37c-1-1.59-1.53-3.42-1.53-5.33 0-5.54 4.51-10.05 10.06-10.05 2.68 0 5.2 1.05 7.1 2.94 1.89 1.89 2.94 4.41 2.94 7.1-.01 5.53-4.52 10.04-10.05 10.04zm5.53-7.53c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.79-1.67-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.11 3.22 5.11 4.52.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z" fill="#25D366"/>
                                                    </svg>
                                                    WhatsApp
                                                </a>
                                            </Button>
                                            <Button size="sm" className="bg-white text-slate-800 hover:bg-slate-50 hover:scale-[1.03] hover:shadow-md border border-slate-200 shadow-sm transition-all duration-200" asChild>
                                                <a href="https://t.me/+8801617082936" target="_blank" rel="noreferrer">
                                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                                                        <defs><linearGradient id="tg-a" x1="0.667" y1="0.167" x2="0.417" y2="0.75"><stop offset="0" stopColor="#37aee2"/><stop offset="1" stopColor="#1e96c8"/></linearGradient></defs>
                                                        <circle cx="120" cy="120" r="120" fill="url(#tg-a)"/>
                                                        <path d="M98 175c-3.89 0-3.23-1.47-4.57-5.17L82.1 132.37 170.4 80" fill="#c8daea"/>
                                                        <path d="M98 175c3 0 4.33-1.37 6-3l16-15.56-19.97-12.04" fill="#a9c9dd"/>
                                                        <path d="M100.04 144.4l48.36 35.73c5.52 3.04 9.5 1.47 10.88-5.13l19.69-92.82c2.02-8.07-3.07-11.73-8.34-9.33L53.75 113.21c-7.87 3.16-7.83 7.55-1.43 9.5l29.93 9.34 69.27-43.68c3.27-1.98 6.27-.92 3.81 1.27" fill="white"/>
                                                    </svg>
                                                    Telegram
                                                </a>
                                            </Button>
                                            <Button size="sm" className="bg-white text-slate-800 hover:bg-slate-50 hover:scale-[1.03] hover:shadow-md border border-slate-200 shadow-sm transition-all duration-200" asChild>
                                                <a href={`mailto:info@insilicology.com?subject=${encodeURIComponent(service.title + ' Inquiry')}`}>
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
                                            <Button size="sm" variant="outline" asChild>
                                                <Link to={`/research/${service.slug}`}>
                                                    More Info
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container-custom text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-2xl mx-auto"
                        >
                            <h2 className="text-3xl font-bold mb-6">Need a Custom Research Solution?</h2>
                            <p className="text-muted-foreground text-lg mb-8">
                                Our team of experts is ready to assist with your specific research requirements.
                                Let's discuss how we can support your scientific goals.
                            </p>
                            <Button size="lg" className="px-8" asChild>
                                <Link to="/contact">Contact Our Research Team</Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Research;
