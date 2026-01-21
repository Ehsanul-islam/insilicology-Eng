import { motion } from 'framer-motion';
import { Users, Target, Heart, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import ImpactStats from '@/components/ImpactStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const About = () => {
    const teamMembers = [
        { name: 'Sarah Johnson', role: 'Founder & CEO', image: '/placeholder.svg' },
        { name: 'David Chen', role: 'Head of Education', image: '/placeholder.svg' },
        { name: 'Maria Garcia', role: 'CTO', image: '/placeholder.svg' },
        { name: 'James Wilson', role: 'Lead Instructor', image: '/placeholder.svg' },
    ];

    const values = [
        {
            icon: Target,
            title: 'Our Mission',
            description: 'To democratize education and make high-quality skills training accessible to everyone, everywhere.'
        },
        {
            icon: Globe,
            title: 'Our Vision',
            description: 'A world where professional growth has no boundaries, and anyone can build the career of their dreams.'
        },
        {
            icon: Heart,
            title: 'Our Values',
            description: 'We believe in student success, continuous innovation, inclusivity, and the power of community.'
        }
    ];

    return (
        <div className="min-h-screen font-siliguri text-[16px]">
            <SEOHead
                title="About Us - Empowering Futures Through Education | Zymios"
                description="Learn about our mission to transform lives through education. Meet the team behind Zymios and discover our story."
                url="/about"
                type="website"
            />
            <Navbar />

            <main className="pt-16">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-20">
                    <div className="container-custom text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Empowering Futures Through Education
                            </h1>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                We're on a mission to help people learn the skills they need to succeed in the modern world.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Mission, Vision, Values */}
                <section className="py-20 bg-background">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-3 gap-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                                        <CardContent className="p-8 text-center">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <value.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                                            <p className="text-muted-foreground">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-20 bg-secondary/30">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                                <div className="space-y-4 text-muted-foreground text-lg">
                                    <p>
                                        Founded in 2020, Zymios began with a simple idea: that quality education should be accessible to everyone. What started as a small collection of coding tutorials has grown into a comprehensive learning platform serving thousands of students worldwide.
                                    </p>
                                    <p>
                                        We've brought together industry experts, passionate educators, and cutting-edge technology to create a learning experience that truly works. Our focus has always been on practical, job-ready skills that help our students advance their careers.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative h-[400px] rounded-2xl overflow-hidden bg-muted"
                            >
                                {/* Placeholder for story image */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                    <Globe className="w-24 h-24 text-gray-300" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Impact Stats */}
                <ImpactStats />

                {/* Team Section */}
                <section className="py-20 bg-background">
                    <div className="container-custom">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Meet the Minds</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Our diverse team of experts is passionate about education and technology.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden bg-muted">
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-primary font-medium">{member.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-primary text-primary-foreground">
                    <div className="container-custom text-center">
                        <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Whether you want to learn with us or work with us, we'd love to have you on board.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link to="/academy">Explore Courses</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10" asChild>
                                <Link to="/careers">View Careers</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
