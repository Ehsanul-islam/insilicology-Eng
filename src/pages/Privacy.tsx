import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
          <li>Account information (name, email, password)</li>
          <li>Profile information (bio, avatar, preferences)</li>
          <li>Course progress and learning data</li>
          <li>Payment and billing information</li>
          <li>Communications with us</li>
        </ul>
        <p>We also automatically collect certain information about your device and usage:</p>
        <ul>
          <li>Device information (IP address, browser type, operating system)</li>
          <li>Usage data (pages visited, features used, time spent)</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      `,
    },
    {
      title: '2. How We Use Your Information',
      content: `
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices, updates, and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Personalize your learning experience</li>
          <li>Monitor and analyze trends, usage, and activities</li>
          <li>Detect, prevent, and address technical issues or fraudulent activity</li>
        </ul>
      `,
    },
    {
      title: '3. Information Sharing and Disclosure',
      content: `
        <p>We may share your information in the following circumstances:</p>
        <ul>
          <li><strong>With your consent:</strong> We may share your information with third parties when you give us permission</li>
          <li><strong>Service providers:</strong> We work with third-party service providers who perform services on our behalf</li>
          <li><strong>Legal requirements:</strong> We may disclose information if required by law or in response to legal requests</li>
          <li><strong>Business transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      `,
    },
    {
      title: '4. Data Security',
      content: `
        <p>We take reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Employee training on data protection</li>
        </ul>
        <p>However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
      `,
    },
    {
      title: '5. Your Rights and Choices',
      content: `
        <p>You have certain rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Data portability:</strong> Request a copy of your data in a machine-readable format</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
        </ul>
        <p>To exercise these rights, please contact us at privacy@zymios.com</p>
      `,
    },
    {
      title: '6. Cookies and Tracking Technologies',
      content: `
        <p>We use cookies and similar tracking technologies to collect and store information. You can control cookies through your browser settings and other tools. Please note that disabling cookies may limit your ability to use certain features of our service.</p>
      `,
    },
    {
      title: '7. Children\'s Privacy',
      content: `
        <p>Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
      `,
    },
    {
      title: '8. International Data Transfers',
      content: `
        <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take appropriate safeguards to ensure that your personal information remains protected.</p>
      `,
    },
    {
      title: '9. Changes to This Privacy Policy',
      content: `
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.</p>
      `,
    },
    {
      title: '10. Contact Us',
      content: `
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul>
          <li>Email: privacy@zymios.com</li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>Address: 123 Learning Street, Education City, EC 12345</li>
        </ul>
      `,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Privacy Policy - Your Data Security | Zymios"
        description="Learn how Zymios collects, uses, and protects your personal information. Read our comprehensive privacy policy and data protection practices."
        url="/privacy"
        type="website"
        tags={['privacy policy', 'data protection', 'privacy', 'security']}
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
              <Shield className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Privacy Policy
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
                    At Zymios, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our learning platform. Please read this privacy policy carefully. By using our services, you agree to the collection and use of information in accordance with this policy.
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
                  <h3 className="text-2xl font-bold mb-3">Questions About Privacy?</h3>
                  <p className="text-white/90 mb-6">
                    If you have any questions or concerns about our privacy practices, we're here to help.
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

export default Privacy;
