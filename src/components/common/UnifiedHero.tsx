import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, PlayCircle, Users, BookOpen, Star, Award, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeroVariant = 'default' | 'skilltori' | 'bio' | 'vibe';

interface UnifiedHeroProps {
    variant?: HeroVariant;
    title?: string;
    subtitle?: string;
    ctaPrimary?: { text: string; href: string };
    ctaSecondary?: { text: string; href: string };
}

const UnifiedHero = memo(({
    variant = 'skilltori',
    title,
    subtitle,
    ctaPrimary,
    ctaSecondary
}: UnifiedHeroProps) => {

    // Skilltori variant state
    const animatedWords = ['Research', 'Innovation', 'Career', 'Future', 'Success'];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        if (variant === 'skilltori') {
            const interval = setInterval(() => {
                setCurrentWordIndex((prev) => (prev + 1) % animatedWords.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [variant]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Skilltori variant
    if (variant === 'skilltori') {
        return (
            <section className="relative min-h-screen flex items-center py-20 overflow-hidden bg-[#F9FAFB]">
                {/* Background Blobs with Animation */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-[100px] opacity-40"
                    />
                    <motion.div
                        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-15%] left-[35%] w-[600px] h-[600px] bg-gradient-to-r from-yellow-100 to-amber-200 rounded-full blur-[120px] opacity-30"
                    />
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, 40, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-[110px] opacity-35"
                    />
                    <motion.div
                        animate={{ x: [0, -25, 0], y: [0, -35, 0] }}
                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-r from-purple-200 to-violet-200 rounded-full blur-[100px] opacity-30"
                    />
                </div>

                <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
                        >
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-gray-700">
                                {getGreeting()}
                            </span>
                        </motion.div>

                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                                <div className="flex flex-wrap items-baseline gap-3">
                                    <span>Your Partner in</span>
                                    <span className="relative inline-block min-w-[200px]">
                                        {/* Invisible spacer ensures perfect baseline alignment */}
                                        <span className="opacity-0 select-none pointer-events-none" aria-hidden="true">
                                            {animatedWords[currentWordIndex]}
                                        </span>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={currentWordIndex}
                                                initial={{ y: 30, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -30, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                                className="absolute left-0 top-0 text-[#7C3AED]"
                                            >
                                                {animatedWords[currentWordIndex]}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                </div>
                                <div className="mt-2 text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                                    Insilicology
                                </div>
                            </h1>
                        </div>

                        <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                            {subtitle || "We don't just teach skills — we build research-ready scientists."}
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <div className="flex items-center gap-2 bg-purple-50/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-default">
                                <div className="flex items-center justify-center w-4 h-4 bg-[#7C3AED] rounded-full flex-shrink-0">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Thesis</span>
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-default">
                                <div className="flex items-center justify-center w-4 h-4 bg-[#7C3AED] rounded-full flex-shrink-0">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Publications</span>
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-default">
                                <div className="flex items-center justify-center w-4 h-4 bg-[#7C3AED] rounded-full flex-shrink-0">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Industry & Freelancing</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button
                                size="lg"
                                asChild
                                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                <Link to={ctaPrimary?.href || '/courses'}>
                                    {ctaPrimary?.text || 'Explore Courses'}
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="bg-white/80 backdrop-blur-sm border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 font-semibold px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                <Link to={ctaSecondary?.href || '/auth'}>
                                    {ctaSecondary?.text || 'Get Started'}
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    // Bio variant
    if (variant === 'bio') {
        const stats = [
            { icon: BookOpen, value: '35+', label: 'Courses' },
            { icon: Users, value: '8', label: 'Batches' },
            { icon: Users, value: '10k+', label: 'Learners' },
            { icon: Star, value: '4.9', label: 'Rated' },
        ];

        return (
            <section className="relative bg-white pt-24 pb-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-yellow-200/30 rounded-full blur-3xl"></div>

                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-bio-off-white border border-cyan-200 rounded-full"
                            >
                                <Star className="w-4 h-4 text-bio-gold fill-bio-gold" />
                                <span className="text-sm font-medium text-foreground">
                                    Trusted by 10,000+ researchers & students
                                </span>
                            </motion.div>

                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    {title || (
                                        <>
                                            The #1 Platform for{' '}
                                            <span className="gradient-bio-text">Bioinformatics Education</span>
                                        </>
                                    )}
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                    {subtitle || 'Master genomics, proteomics, and drug discovery with expert-led courses designed for real research.'}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-bio-gold hover:opacity-90 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Link to={ctaPrimary?.href || '/courses'}>
                                        {ctaPrimary?.text || 'Explore Courses'}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-bio-teal text-bio-teal hover:bg-bio-teal hover:text-white font-semibold px-8 py-6 text-lg transition-all"
                                >
                                    <Link to={ctaSecondary?.href || '/contact'}>
                                        {ctaSecondary?.text || 'Book Consultation'}
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="bg-white border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-center mb-2">
                                            <stat.icon className="w-5 h-5 text-bio-teal" />
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    // Default variant
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />

            <div className="container-custom relative z-10 flex min-h-screen items-center py-20 pt-28">
                <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 border border-emerald-200"
                        >
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-medium text-emerald-700">
                                Welcome to LearnCraft
                            </span>
                        </motion.div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                                {title || 'Build Your Career With Expert-Led Courses'}
                            </h1>
                        </div>

                        <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                            {subtitle || 'Join thousands of learners mastering research design, data analysis, and professional skills through our practical, hands-on courses.'}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="group rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                                asChild
                            >
                                <Link to={ctaPrimary?.href || '/courses'}>
                                    {ctaPrimary?.text || 'Explore Courses'}
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="group rounded-full border-2 border-slate-300 px-8 py-6 text-lg font-semibold text-foreground hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                                asChild
                            >
                                <Link to={ctaSecondary?.href || '/demo'}>
                                    <Play className="mr-2 h-5 w-5 text-purple-600" />
                                    {ctaSecondary?.text || 'Watch Demo'}
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

UnifiedHero.displayName = 'UnifiedHero';

export default UnifiedHero;
