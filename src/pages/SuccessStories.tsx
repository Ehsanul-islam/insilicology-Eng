import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import SuccessMetrics from '@/components/SuccessMetrics';

const SuccessStories = () => {
    // Mock data for stories
    const stories = [
        {
            name: "Alex Thompson",
            role: "Frontend Developer",
            company: "Tech Corp",
            image: "/placeholder.svg",
            quote: "insilicology gave me the skills I needed to switch careers. I went from sales to a junior dev role in 6 months!",
            course: "Full Stack Web Development"
        },
        {
            name: "Emily Rodriguez",
            role: "Data Analyst",
            company: "DataViz Inc",
            image: "/placeholder.svg",
            quote: "The practical projects in the data science track were exactly what I needed to build my portfolio.",
            course: "Data Science Fundamentals"
        },
        // Add more mock stories
        {
            name: "Michael Chang",
            role: "UX Designer",
            company: "Creative Studio",
            image: "/placeholder.svg",
            quote: "I learned best practices and industry standards that I apply every day in my new job.",
            course: "UI/UX Design Masterclass"
        }
    ];

    return (
        <div className="min-h-screen font-siliguri text-[16px]">
            <SEOHead
                title="Success Stories - Student Results | insilicology"
                description="Read inspiring stories from insilicology students who have transformed their careers and lives through education."
                url="/stories"
                type="website"
            />
            <Navbar />

            <main className="pt-16">
                {/* Hero Section - Success & Achievement Theme */}
                <section className="relative bg-[#1a0a1f] text-white pt-2 pb-8 overflow-hidden border-b border-white/5">
                    {/* Velvet Noise Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

                    {/* Ambient Glows: Purple & Indigo */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-[50%] -left-[10%] w-[80%] h-[100%] bg-purple-600/15 blur-[130px] rounded-full animate-pulse" />
                        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[90%] bg-indigo-600/20 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
                    </div>

                    <div className="container-custom relative z-10">
                        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                            {/* Left Column: Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="max-w-2xl"
                            >
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/5 border border-purple-500/20 text-[9px] font-bold text-purple-200/80 mb-3 backdrop-blur-md">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                                    </span>
                                    STUDENT SUCCESS
                                </div>

                                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter leading-tight">
                                    Real People. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-400 to-purple-200 bg-[length:200%_auto] animate-gradient-x">Real Results.</span>
                                </h1>

                                <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed font-medium">
                                    See how thousands of learners are changing their lives with insilicology.
                                </p>
                            </motion.div>

                            {/* Right Column: Compact Horizontal Stats */}
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {[
                                    { label: 'Success Stories', value: '1000+' },
                                    { label: 'Career Changes', value: '500+' },
                                    { label: 'Avg. Salary Increase', value: '40%' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px] p-2 md:p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all hover:scale-105 group backdrop-blur-sm"
                                    >
                                        <span className="text-lg md:text-xl font-bold text-white group-hover:text-purple-400 transition-colors tracking-tight">{stat.value}</span>
                                        <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{stat.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <SuccessMetrics />

                <section className="py-20">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.map((story, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full">
                                        <CardContent className="p-8">
                                            <div className="flex gap-1 text-yellow-500 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 fill-current" />
                                                ))}
                                            </div>
                                            <p className="text-lg italic mb-6">"{story.quote}"</p>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                                                    {/* Placeholder image logic or component */}
                                                    <div className="w-full h-full bg-secondary flex items-center justify-center text-xs font-bold">
                                                        {story.name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{story.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{story.role} at {story.company}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t">
                                                <p className="text-xs text-muted-foreground">Graduate of <span className="text-primary">{story.course}</span></p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default SuccessStories;
