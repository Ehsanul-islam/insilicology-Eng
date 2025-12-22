import { motion } from 'framer-motion';

const TrustBadges = () => {
  // Partner/Institution names (would be replaced with actual logos in production)
  const partners = [
    { name: 'NCBI', subtitle: 'Collaboration' },
    { name: 'UniProt', subtitle: 'Integration' },
    { name: 'PDB', subtitle: 'Resources' },
    { name: 'EMBL-EBI', subtitle: 'Partner' },
    { name: 'PyMOL', subtitle: 'Tools' },
    { name: 'BioPython', subtitle: 'Framework' },
  ];

  return (
    <section className="py-12 bg-white border-y border-border">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted by Leading Research Institutions & Tools
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Logo Placeholder - would be replaced with actual logos */}
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-muted-foreground opacity-50 group-hover:text-bio-teal group-hover:opacity-100 transition-all duration-300">
                  {partner.name}
                </div>
                <div className="text-xs text-muted-foreground opacity-40 mt-1">
                  {partner.subtitle}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-border"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-5 h-5 text-bio-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">10,000+ Active Researchers</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-5 h-5 text-bio-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Industry Recognized Certificates</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-5 h-5 text-bio-purple" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <span className="text-sm font-medium">PhD-Led Curriculum</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBadges;

