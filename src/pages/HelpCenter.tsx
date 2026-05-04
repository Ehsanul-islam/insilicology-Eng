import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, Book, MessageCircle, CreditCard, Monitor, Lock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { icon: Book, title: 'Getting Started', description: 'New to insilicology? Start here.' },
        { icon: CreditCard, title: 'Billing & Plans', description: 'Manage your subscription and payments.' },
        { icon: Monitor, title: 'Course Access', description: 'Troubleshoot video and content issues.' },
        { icon: Lock, title: 'Account Security', description: 'Password reset and 2FA help.' },
    ];

    const faqs = [
        {
            question: "How do I access my courses?",
            answer: "After purchasing a course, you can access it by logging into your account and visiting your Dashboard. All your enrolled courses will be listed there."
        },
        {
            question: "Can I download videos for offline viewing?",
            answer: "Currently, our video content is available for streaming only to ensure the most up-to-date content. However, many course resources and exercises are downloadable."
        },
        {
            question: "Do you offer certificates?",
            answer: "Yes! Upon successfully completing a course (watching all lessons and passing any quizzes), you will receive a verifiable digital certificate."
        },
        {
            question: "What is the refund policy?",
            answer: "We offer a 30-day money-back guarantee on all individual course purchases if you've viewed less than 50% of the content. See our Refund Policy for full details."
        },
        {
            question: "How do I reset my password?",
            answer: "Click 'Login' in the navigation bar, then select 'Forgot Password?'. Enter your email address, and we'll send you instructions to reset your password."
        }
    ];

    return (
        <div className="min-h-screen font-siliguri text-[16px]">
            <SEOHead
                title="Help Center - Support & FAQs | insilicology"
                description="Find answers to common questions about insilicology courses, billing, and account management. We're here to help."
                url="/help"
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
                            className="max-w-3xl mx-auto"
                        >
                            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                How can we help you?
                            </h1>
                            <div className="relative max-w-xl mx-auto">
                                <Input
                                    type="text"
                                    placeholder="Search for answers..."
                                    className="h-14 pl-12 pr-4 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 transition-all rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-16">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <category.icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold mb-2">{category.title}</h3>
                                            <p className="text-sm text-muted-foreground">{category.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section className="py-16 bg-secondary/30">
                    <div className="container-custom max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground">
                                Quick answers to common questions about our platform.
                            </p>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-left font-medium">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Still Need Help? */}
                <section className="py-16">
                    <div className="container-custom">
                        <Card className="bg-primary text-primary-foreground overflow-hidden relative">
                            {/* Pattern overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('/placeholder.svg')] bg-repeat opacity-5" />

                            <CardContent className="p-12 text-center relative z-10">
                                <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                                    Our support team is just a message away. We usually reply within 24 hours.
                                </p>
                                <Button size="lg" variant="secondary" asChild>
                                    <Link to="/contact">Contact Support</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HelpCenter;
