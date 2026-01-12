import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Help Center', href: '/help' },
      { name: 'Success Stories', href: '/stories' },
      { name: 'Contact', href: '/contact' },
    ],
    Resources: [
      { name: 'Academy', href: '/academy' },
      { name: 'Blog', href: '/blog' },
      { name: 'Community', href: '/community' },
      { name: 'Verify Certificate', href: '/verify-certificate' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Research', href: '/research' },
      { name: 'Publications', href: '/publications' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-[#1877F2] hover:text-white', ring: 'group-hover:ring-[#1877F2]/20' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-[#1DA1F2] hover:text-white', ring: 'group-hover:ring-[#1DA1F2]/20' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-[#0A66C2] hover:text-white', ring: 'group-hover:ring-[#0A66C2]/20' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-[#E4405F] hover:text-white', ring: 'group-hover:ring-[#E4405F]/20' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 font-siliguri">
      <div className="container-custom pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-6">
          {/* Brand - Span 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                Zymios
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed max-w-sm text-sm">
              Empowering professionals worldwide with cutting-edge skills and knowledge through expert-led online courses.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`group w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 transition-all duration-300 ${social.color} hover:shadow-md hover:-translate-y-1`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-base mb-4 text-slate-900">Company</h3>
            <ul className="space-y-3">
              {footerLinks.Company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-500 hover:text-blue-600 transition-colors block text-xs font-medium hover:translate-x-1 duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-base mb-4 text-slate-900">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.Resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-500 hover:text-blue-600 transition-colors block text-xs font-medium hover:translate-x-1 duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-base mb-4 text-slate-900">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.Legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-500 hover:text-blue-600 transition-colors block text-xs font-medium hover:translate-x-1 duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Zymios. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
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
