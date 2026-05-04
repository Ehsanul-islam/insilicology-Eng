import { motion } from 'framer-motion';
import { CreditCard, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';

const RefundPolicy = () => {
    const sections = [
        {
            title: '1. 30-Day Money-Back Guarantee',
            content: `
        <p>We want you to be completely satisfied with your learning experience. That's why we offer a comprehensive <strong>30-day money-back guarantee</strong> on all individual course purchases.</p>
        <p>If you're not satisfied with a course for any reason, you can request a full refund within 30 days of your purchase date, provided you meet the eligibility criteria below.</p>
      `,
        },
        {
            title: '2. Eligibility Criteria',
            content: `
        <p>To be eligible for a refund, the following conditions must be met:</p>
        <ul>
          <li>The refund request is made within 30 days of the purchase date.</li>
          <li>You have viewed less than 50% of the course content.</li>
          <li>You have not downloaded a certificate of completion for the course.</li>
          <li>The course was not purchased as part of a bundle or special promotion identified as non-refundable.</li>
        </ul>
      `,
        },
        {
            title: '3. Subscription Refunds',
            content: `
        <p>For monthly or annual subscriptions:</p>
        <ul>
          <li>You may cancel your subscription at any time.</li>
          <li>We do not offer refunds for partial subscription periods.</li>
          <li>If you cancel, you will continue to have access to the subscription content until the end of your current billing period.</li>
          <li>Exceptions may be made in cases of technical issues that prevent access to the service.</li>
        </ul>
      `,
        },
        {
            title: '4. How to Request a Refund',
            content: `
        <p>To request a refund, please follow these steps:</p>
        <ol>
          <li>Log in to your account and go to your Purchase History.</li>
          <li>Find the course you wish to refund.</li>
          <li>Click on "Request Refund" (if the option is available/eligible).</li>
          <li>Alternatively, you can email our support team at support@insilicology.com with your order details and reason for the refund.</li>
        </ol>
      `,
        },
        {
            title: '5. Processing Time',
            content: `
        <p>Once your refund request is approved, we will initiate the refund immediately. The funds will be returned to your original payment method.</p>
        <p>Please note that it may take <strong>5-10 business days</strong> for the refund to appear on your bank statement, depending on your bank or credit card issuer.</p>
      `,
        },
        {
            title: '6. Exceptions',
            content: `
        <p>We reserve the right to deny refund requests in cases of:</p>
        <ul>
          <li>Abuse of the refund policy (e.g., repeated refunds).</li>
          <li>Account bans due to violation of our Terms of Service.</li>
        </ul>
      `,
        },
    ];

    return (
        <div className="min-h-screen font-siliguri text-[16px]">
            <SEOHead
                title="Refund Policy - 30-Day Money-Back Guarantee | insilicology"
                description="Learn about our 30-day money-back guarantee and refund process. We want you to be satisfied with your learning journey."
                url="/refunds"
                type="website"
                tags={['refund policy', 'money back guarantee', 'purchase terms']}
            />
            <Navbar />

            <main className="pt-16">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-16">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <CreditCard className="w-16 h-16 mx-auto mb-6" />
                            <h1 className="text-5xl md:text-6xl font-bold mb-4">
                                Refund Policy
                            </h1>
                            <p className="text-xl text-white/90">
                                Transparent. Fair. Simple.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="container-custom py-16">
                    <div className="max-w-4xl mx-auto">
                        {/* Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-12"
                        >
                            <Card>
                                <CardContent className="p-8">
                                    <p className="text-lg text-foreground/80 leading-relaxed">
                                        At insilicology, we are committed to providing high-quality educational content. However, we understand that sometimes a course might not be the right fit. This Request Policy outlines the terms and conditions for refunds on our platform.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Policy Sections */}
                        <div className="space-y-8">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <Card>
                                        <CardContent className="p-8">
                                            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                                            <div
                                                className="prose prose-lg max-w-none
                          prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
                          prose-ul:my-4 prose-li:text-foreground/80 prose-li:mb-2
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6"
                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                            />
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-12"
                        >
                            <Card className="bg-gradient-to-br from-primary to-primary-dark text-white">
                                <CardContent className="p-8 text-center">
                                    <Mail className="w-12 h-12 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-3">Questions About Refunds?</h3>
                                    <p className="text-white/90 mb-6">
                                        If you have questions about a specific refund, please contact our support team.
                                    </p>
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                                    >
                                        Contact Support
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RefundPolicy;
