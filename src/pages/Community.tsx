import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, HeartHandshake, ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Community = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Community - Students, Collaborators & Mentors | insilicology"
                description="Join our vibrant community of students, researchers, and mentors. Collaborate, learn, and grow together."
                url="/community"
            />
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden bg-[#0a0a0a] text-white">
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

                    <div className="container-custom relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-medium mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
                                </span>
                                Global Community
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                                Connect, Collaborate, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Grow Together</span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                                A thriving ecosystem of students, mentors, and collaborators pushing the boundaries of scientific research and learning.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Community Segments */}
                <section className="py-20">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "For Students",
                                    icon: Users,
                                    desc: "Access exclusive resources, study groups, and peer support networks.",
                                    action: "Join as Student",
                                    link: "/auth?type=student",
                                    color: "text-blue-500",
                                    bg: "bg-blue-500/10"
                                },
                                {
                                    title: "Collaborators",
                                    icon: HeartHandshake,
                                    desc: "Partner with us on groundbreaking research projects and initiatives.",
                                    action: "Partner With Us",
                                    link: "/contact",
                                    color: "text-purple-500",
                                    bg: "bg-purple-500/10"
                                },
                                {
                                    title: "Mentors",
                                    icon: UserPlus,
                                    desc: "Share your expertise and guide the next generation of scientists.",
                                    action: "Become a Mentor",
                                    link: "/contact?type=mentor",
                                    color: "text-green-500",
                                    bg: "bg-green-500/10"
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full hover:shadow-lg transition-all border-border/50 text-center p-6">
                                        <CardContent className="pt-6">
                                            <div className={`w-16 h-16 mx-auto rounded-full ${item.bg} flex items-center justify-center mb-6`}>
                                                <item.icon className={`w-8 h-8 ${item.color}`} />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                            <p className="text-muted-foreground mb-8">{item.desc}</p>
                                            <Button className="w-full" variant="outline" asChild>
                                                <Link to={item.link}>{item.action}</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Community Stats/CTA */}
                <section className="py-20 bg-secondary/30">
                    <div className="container-custom">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-background p-8 md:p-12 rounded-2xl border border-border shadow-sm">
                            <div className="max-w-xl">
                                <h2 className="text-3xl font-bold mb-4">Join Our Discord Community</h2>
                                <p className="text-muted-foreground text-lg">
                                    Get real-time support, network with peers, and stay updated with the latest announcements in our dedicated Discord server.
                                </p>
                            </div>
                            <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white min-w-[200px]">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Join Discord
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Community;
