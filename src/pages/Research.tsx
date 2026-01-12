import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Microscope, Atom, Dna, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResearchInsights from '@/components/ResearchInsights';

const Research = () => {
    const services = [
        {
            title: "Molecular Docking",
            description: "Predict the preferred orientation of one molecule to a second when bound to each other to form a stable complex.",
            icon: Atom,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Molecular Dynamics (MD)",
            description: "Simulate the physical movements of atoms and molecules to understand dynamic evolution of the system.",
            icon: Microscope,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "DFT Calculations",
            description: "Density Functional Theory calculations to investigate the electronic structure (principally the ground state) of many-body systems.",
            icon: Database,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Bioinformatics",
            description: "Interdisciplinary field that develops methods and software tools for understanding biological data.",
            icon: Dna,
            color: "text-red-500",
            bg: "bg-red-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Research Services - Docking, MD, DFT & Bioinformatics | Zymios"
                description="Expert research services including Molecular Docking, Molecular Dynamics, DFT calculations, and Bioinformatics analysis."
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
                                    { label: 'Research Areas', value: '4+' },
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
                <section className="py-20">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 gap-8">
                            {services.map((service, index) => (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full hover:shadow-lg transition-all border-border/50 group">
                                        <CardHeader>
                                            <div className={`w-12 h-12 rounded-lg ${service.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <service.icon className={`w-6 h-6 ${service.color}`} />
                                            </div>
                                            <CardTitle className="text-2xl">{service.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base mb-6">
                                                {service.description}
                                            </CardDescription>
                                            <Button variant="outline" className="group/btn" asChild>
                                                <Link to="/contact">
                                                    Inquire Service
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
