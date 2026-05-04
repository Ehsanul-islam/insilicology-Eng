import { motion } from 'framer-motion';
import { FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';

const Terms = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `
        <p>By accessing and using insilicology ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.</p>
        <p>We reserve the right to update and change these Terms of Service without notice. Any new features that augment or enhance the current Service shall be subject to the Terms of Service.</p>
      `,
    },
    {
      title: '2. Account Registration',
      content: `
        <p>To access certain features of the Service, you must register for an account. When you register, you agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and promptly update your account information</li>
          <li>Maintain the security of your password</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>
        <p>You must be at least 13 years old to use this Service. Accounts registered by automated means are not permitted.</p>
      `,
    },
    {
      title: '3. User Content and Conduct',
      content: `
        <p>You are responsible for all content you post, upload, or share on the Service. You agree not to post content that:</p>
        <ul>
          <li>Violates any law or regulation</li>
          <li>Infringes on intellectual property rights</li>
          <li>Contains malware or harmful code</li>
          <li>Is fraudulent, false, or misleading</li>
          <li>Harasses, threatens, or intimidates others</li>
          <li>Contains spam or unsolicited advertising</li>
        </ul>
        <p>We reserve the right to remove any content that violates these terms or is otherwise objectionable.</p>
      `,
    },
    {
      title: '4. Course Access and Licenses',
      content: `
        <p>When you enroll in a course, you receive a limited, non-exclusive, non-transferable license to access and view the course content for personal, non-commercial use only.</p>
        <p>You may not:</p>
        <ul>
          <li>Share your account credentials with others</li>
          <li>Copy, download, or distribute course materials without permission</li>
          <li>Modify, create derivative works, or reverse engineer course content</li>
          <li>Use courses for commercial purposes</li>
          <li>Resell or transfer your enrollment to another person</li>
        </ul>
      `,
    },
    {
      title: '5. Payments and Refunds',
      content: `
        <p>Certain features of the Service require payment of fees. You agree to provide accurate payment information and authorize us to charge the applicable fees.</p>
        <p><strong>Refund Policy:</strong></p>
        <ul>
          <li>30-day money-back guarantee for most courses</li>
          <li>Refunds processed within 5-10 business days</li>
          <li>Some promotional courses may have different refund terms</li>
          <li>Subscriptions may be cancelled at any time</li>
        </ul>
        <p>We reserve the right to refuse refunds in cases of abuse or violation of terms.</p>
      `,
    },
    {
      title: '6. Intellectual Property Rights',
      content: `
        <p>The Service and its original content (excluding user content), features, and functionality are and will remain the exclusive property of insilicology and its licensors.</p>
        <p>Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent. You may not use our intellectual property in any way that is likely to cause confusion or disparages insilicology.</p>
      `,
    },
    {
      title: '7. Certificates and Credentials',
      content: `
        <p>Upon successful completion of certain courses, you may receive a certificate of completion. These certificates:</p>
        <ul>
          <li>Verify your completion of the course</li>
          <li>Are issued electronically and can be verified online</li>
          <li>Remain the property of insilicology</li>
          <li>May be revoked if terms are violated</li>
          <li>Do not represent academic credit unless explicitly stated</li>
        </ul>
      `,
    },
    {
      title: '8. Limitation of Liability',
      content: `
        <p>To the maximum extent permitted by law, insilicology shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from:</p>
        <ul>
          <li>Your use or inability to use the Service</li>
          <li>Unauthorized access to your account</li>
          <li>Errors or omissions in course content</li>
          <li>Any third-party content or conduct</li>
        </ul>
      `,
    },
    {
      title: '9. Disclaimer of Warranties',
      content: `
        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. We do not warrant that:</p>
        <ul>
          <li>The Service will be uninterrupted or error-free</li>
          <li>Defects will be corrected</li>
          <li>The Service is free of viruses or other harmful components</li>
          <li>Course content is accurate, complete, or current</li>
        </ul>
      `,
    },
    {
      title: '10. Termination',
      content: `
        <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>
        <p>Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.</p>
      `,
    },
    {
      title: '11. Governing Law',
      content: `
        <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which insilicology operates, without regard to its conflict of law provisions.</p>
        <p>Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with applicable arbitration rules.</p>
      `,
    },
    {
      title: '12. Changes to Terms',
      content: `
        <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice before any new terms take effect.</p>
        <p>Your continued use of the Service after any changes to the Terms constitutes acceptance of those changes.</p>
      `,
    },
    {
      title: '13. Contact Information',
      content: `
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul>
          <li>Email: legal@insilicology.com</li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>Address: 123 Learning Street, Education City, EC 12345</li>
        </ul>
      `,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Terms of Service - User Agreement | insilicology"
        description="Read insilicology's terms of service to understand your rights and responsibilities when using our learning platform."
        url="/terms"
        type="website"
        tags={['terms of service', 'user agreement', 'terms and conditions', 'legal']}
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
              <FileText className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-white/90">
                Last Updated: March 15, 2024
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
                    Welcome to insilicology. These Terms of Service ("Terms") govern your use of our website, mobile applications, and services (collectively, the "Service"). Please read these Terms carefully before using our Service. By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Terms Sections */}
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
                          prose-strong:text-foreground prose-strong:font-semibold"
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
                  <h3 className="text-2xl font-bold mb-3">Questions About Our Terms?</h3>
                  <p className="text-white/90 mb-6">
                    If you have any questions or concerns about our Terms of Service, please don't hesitate to reach out.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    Contact Us
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

export default Terms;
