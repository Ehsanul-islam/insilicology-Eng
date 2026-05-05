import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Microscope, Atom, Dna, Database, ArrowRight, BadgeDollarSign, CheckCircle2, MessageCircle, PackageCheck, Network, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResearchInsights from '@/components/ResearchInsights';

const Research = () => {
    const whatsappNumber = '8801617082936';

    const services = [
        {
            id: "molecular-docking",
            title: "Molecular Docking",
            description: "Predict the preferred orientation of one molecule to a second when bound to each other to form a stable complex.",
            icon: Atom,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            cardClass: "bg-blue-500/[0.04] border-blue-500/20",
            accent: "from-blue-500 to-cyan-500",
            image: "/images/molecular-docking.png",
            price: "Custom quote",
            timeline: "3-7 working days",
            summary: "Ligand preparation, receptor setup, binding pose analysis, and ranked interaction reports for early-stage drug discovery decisions.",
            deliverables: ["Prepared ligand and receptor files", "Docking score table with ranked poses", "2D/3D interaction visuals", "Concise interpretation report"],
            tools: ["AutoDock Vina", "PyMOL", "Discovery Studio", "Open Babel"]
        },
        {
            id: "molecular-dynamics",
            title: "Molecular Dynamics (MD)",
            description: "Simulate the physical movements of atoms and molecules to understand dynamic evolution of the system.",
            icon: Microscope,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            cardClass: "bg-purple-500/[0.04] border-purple-500/20",
            accent: "from-purple-500 to-fuchsia-500",
            image: "/images/molecular-dynamics-simulation.png",
            price: "Custom quote",
            timeline: "7-14 working days",
            summary: "Production-ready MD workflows for stability, flexibility, RMSD/RMSF, radius of gyration, hydrogen bonding, and trajectory interpretation.",
            deliverables: ["System setup and minimization notes", "Trajectory analysis plots", "Stability and interaction interpretation", "Publication-ready figures"],
            tools: ["GROMACS", "CHARMM-GUI", "VMD", "Grace/Xmgrace"]
        },
        {
            id: "dft-calculations",
            title: "DFT Calculations",
            description: "Density Functional Theory calculations to investigate the electronic structure (principally the ground state) of many-body systems.",
            icon: Database,
            color: "text-green-500",
            bg: "bg-green-500/10",
            cardClass: "bg-green-500/[0.04] border-green-500/20",
            accent: "from-green-500 to-emerald-500",
            image: "/images/dft-calculations.png",
            price: "Custom quote",
            timeline: "5-12 working days",
            summary: "Electronic structure analysis for molecular properties, orbital visualization, optimization, thermodynamic descriptors, and reactivity insights.",
            deliverables: ["Optimized molecular geometries", "HOMO-LUMO and energy gap analysis", "Molecular electrostatic potential visuals", "Method and basis set summary"],
            tools: ["Gaussian", "GaussView", "ORCA", "Multiwfn"]
        },
        {
            id: "bioinformatics",
            title: "Bioinformatics",
            description: "Interdisciplinary field that develops methods and software tools for understanding biological data.",
            icon: Dna,
            color: "text-red-500",
            bg: "bg-red-500/10",
            cardClass: "bg-red-500/[0.04] border-red-500/20",
            accent: "from-red-500 to-orange-500",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=80",
            price: "Custom quote",
            timeline: "4-10 working days",
            summary: "Sequence, protein, pathway, and dataset analysis that turns biological data into clean, interpretable research outputs.",
            deliverables: ["Sequence or dataset quality overview", "Alignment, annotation, or pathway outputs", "Figures and result tables", "Actionable interpretation report"],
            tools: ["BLAST", "Clustal Omega", "MEGA", "R/Bioconductor"]
        },
        {
            id: "network-pharmacology",
            title: "Network Pharmacology",
            description: "Map compound-target-pathway relationships to understand multi-target mechanisms and therapeutic potential.",
            icon: Network,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
            cardClass: "bg-cyan-500/[0.04] border-cyan-500/20",
            accent: "from-cyan-500 to-sky-500",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
            price: "Custom quote",
            timeline: "5-10 working days",
            summary: "Integrated compound, target, disease, and pathway analysis to identify likely mechanisms, hub genes, and actionable biological networks.",
            deliverables: ["Compound-target network maps", "PPI and hub gene analysis", "GO/KEGG enrichment outputs", "Mechanism-focused interpretation report"],
            tools: ["Cytoscape", "STRING", "SwissTargetPrediction", "DAVID/Enrichr"]
        },
        {
            id: "vaccine-design",
            title: "Vaccine Design",
            description: "In-silico vaccine discovery workflows covering antigen selection, epitope prediction, and construct evaluation.",
            icon: ShieldCheck,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            cardClass: "bg-amber-500/[0.04] border-amber-500/20",
            accent: "from-amber-500 to-yellow-500",
            image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=900&q=80",
            price: "Custom quote",
            timeline: "7-14 working days",
            summary: "Reverse vaccinology and immunoinformatics workflows for antigen screening, epitope prioritization, construct design, and immune response prediction.",
            deliverables: ["Antigen and epitope screening report", "Vaccine construct design", "Allergenicity and antigenicity assessment", "Structure and docking summary"],
            tools: ["IEDB", "VaxiJen", "AllerTOP", "ClusPro"]
        },
        {
            id: "cadd",
            title: "CADD",
            description: "Computer-aided drug design support from virtual screening and hit prioritization to lead optimization insights.",
            icon: Cpu,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            cardClass: "bg-indigo-500/[0.04] border-indigo-500/20",
            accent: "from-indigo-500 to-blue-500",
            image: "https://images.unsplash.com/photo-1631556097152-c39479bbff93?auto=format&fit=crop&w=900&q=80",
            price: "Custom quote",
            timeline: "5-12 working days",
            summary: "End-to-end CADD workflows for target preparation, ligand library handling, screening, ADMET profiling, and hit-to-lead decision support.",
            deliverables: ["Virtual screening workflow summary", "Ranked hit list and interaction visuals", "ADMET/drug-likeness report", "Lead prioritization recommendations"],
            tools: ["AutoDock Vina", "SwissADME", "pkCSM", "PyMOL"]
        },
        {
            id: "metagenomics",
            title: "Metagenomics",
            description: "Microbiome and environmental sequencing analysis for taxonomy, diversity, and functional interpretation.",
            icon: Layers,
            color: "text-teal-500",
            bg: "bg-teal-500/10",
            cardClass: "bg-teal-500/[0.04] border-teal-500/20",
            accent: "from-teal-500 to-emerald-500",
            image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80",
            price: "Custom quote",
            timeline: "7-15 working days",
            summary: "Amplicon or shotgun metagenomics analysis for community profiling, diversity metrics, differential abundance, and functional insight.",
            deliverables: ["Quality control and preprocessing summary", "Taxonomic profile and abundance tables", "Alpha/beta diversity plots", "Functional or pathway interpretation"],
            tools: ["QIIME 2", "Kraken2", "MetaPhlAn", "R/Phyloseq"]
        }
    ];

    const getWhatsappLink = (serviceTitle: string) => {
        const message = encodeURIComponent(`Hi, I want more information about ${serviceTitle}.`);
        return `https://wa.me/${whatsappNumber}?text=${message}`;
    };

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
                    <div className="container-custom">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {services.map((service, index) => (
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
                                                <a href={`#${service.id}`}>
                                                    View Details
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                </a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Service Details */}
                <section className="bg-muted/20 py-12">
                    <div className="container-custom space-y-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">Service Details</p>
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Explore Each Research Service</h2>
                            <p className="mt-3 text-muted-foreground">
                                Review the scope, expected outputs, pricing approach, and tools for each service before starting a conversation.
                            </p>
                        </div>

                        {services.map((service, index) => (
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
                                                {service.deliverables.map((item) => (
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

                                        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                                            <Button size="sm" asChild>
                                                <a href={getWhatsappLink(service.title)} target="_blank" rel="noreferrer">
                                                    <MessageCircle className="mr-2 h-4 w-4" />
                                                    WhatsApp for More Info
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="outline" asChild>
                                                <Link to="/contact">Send Detailed Inquiry</Link>
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
