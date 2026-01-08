import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Help Center', href: '/help' },
    ],
    Resources: [
      { name: 'Academy', href: '/academy' },
      { name: 'Research', href: '/research' },
      { name: 'Publications', href: '/publications' },
      { name: 'Blog', href: '/blog' },
      { name: 'Community', href: '/community' },
      { name: 'Success Stories', href: '/stories' },
      { name: 'Verify Certificate', href: '/verify-certificate' },
      { name: 'Contact', href: '/contact' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-[#1877F2] hover:text-white', ring: 'group-hover:ring-[#1877F2]/20' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-[#1DA1F2] hover:text-white', ring: 'group-hover:ring-[#1DA1F2]/20' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-[#0A66C2] hover:text-white', ring: 'group-hover:ring-[#0A66C2]/20' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-[#E4405F] hover:text-white', ring: 'group-hover:ring-[#E4405F]/20' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 font-siliguri relative overflow-hidden">

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <div className="container-custom py-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-2">
          {/* Brand - Span 4 cols */}
          <div className="lg:col-span-4 space-y-1">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                LearnCraft
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-xs">
              Empowering professionals worldwide with cutting-edge skills and knowledge through expert-led online courses.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`group w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color} hover:shadow-lg hover:-translate-y-1`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links - Span 8 cols */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:pl-12">
            {/* Company */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-sm mb-2 text-foreground">Company</h3>
              <ul className="space-y-1">
                {footerLinks.Company.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-muted-foreground hover:text-blue-600 transition-colors block text-xs font-medium hover:translate-x-1 duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources (wider) */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-sm mb-2 text-foreground">Resources</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {footerLinks.Resources.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-muted-foreground hover:text-blue-600 transition-colors block text-xs font-medium hover:translate-x-1 duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-sm mb-2 text-foreground">Legal</h3>
              <ul className="space-y-1">
                {footerLinks.Legal.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-muted-foreground hover:text-blue-600 transition-colors block text-xs font-medium hover:translate-x-1 duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} LearnCraft. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-2.5 py-1 rounded-full">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>for lifelong learners</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
