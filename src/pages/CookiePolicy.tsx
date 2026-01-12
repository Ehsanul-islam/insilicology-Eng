import { motion } from 'framer-motion';
import { Cookie, Mail } from 'lucide-react'; // Changed Shield to Cookie
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';

const CookiePolicy = () => {
  const sections = [
    {
      title: '1. What Are Cookies?',
      content: `
        <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.</p>
        <p>We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.</p>
      `,
    },
    {
      title: '2. Types of Cookies We Use',
      content: `
        <p>We use the following types of cookies:</p>
        <ul>
          <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.</li>
          <li><strong>Performance & Analytics Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
          <li><strong>Functionality Cookies:</strong> These allow the website to remember choices you make (such as your username, language, or region) and provide enhanced features.</li>
          <li><strong>Marketing Cookies:</strong> These are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
        </ul>
      `,
    },
    {
      title: '3. Third-Party Cookies',
      content: `
        <p>In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.</p>
        <p>Common third-party services we use include:</p>
        <ul>
          <li>Google Analytics (for site analysis)</li>
          <li>Stripe (for payment processing)</li>
          <li>Meta Pixel (for advertising effectiveness)</li>
        </ul>
      `,
    },
    {
      title: '4. Managing Cookies',
      content: `
        <p>You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</p>
        <p>As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.</p>
      `,
    },
    {
      title: '5. Changes to This Cookie Policy',
      content: `
        <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.</p>
      `,
    },
    {
      title: '6. Contact Us',
      content: `
        <p>If you have any questions about our use of cookies, please contact us:</p>
        <ul>
          <li>Email: privacy@zymios.com</li>
          <li>Address: 123 Learning Street, Education City, EC 12345</li>
        </ul>
      `,
    },
  ];

  return (
    <div className="min-h-screen font-siliguri text-[16px]">
      <SEOHead
        title="Cookie Policy - How We Use Cookies | Zymios"
        description="Understand how Zymios uses cookies to improve your learning experience. Read our detailed Cookie Policy."
        url="/cookies"
        type="website"
        tags={['cookie policy', 'cookies', 'tracking', 'privacy']}
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
              <Cookie className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Cookie Policy
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
                    This Cookie Policy explains how Zymios ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
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
                  <h3 className="text-2xl font-bold mb-3">Have Questions?</h3>
                  <p className="text-white/90 mb-6">
                    If you have questions about our Cookie Policy, please contact us.
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

export default CookiePolicy;
