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
            quote: "LearnCraft gave me the skills I needed to switch careers. I went from sales to a junior dev role in 6 months!",
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
                title="Success Stories - Student Results | LearnCraft"
                description="Read inspiring stories from LearnCraft students who have transformed their careers and lives through education."
                url="/stories"
                type="website"
            />
            <Navbar />

            <main className="pt-16">
                <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-20">
                    <div className="container-custom text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto"
                        >
                            <Badge variant="outline" className="text-white border-white mb-4">Student Success</Badge>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Real People. Real Results.
                            </h1>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                See how thousands of learners are changing their lives with LearnCraft.
                            </p>
                        </motion.div>
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
