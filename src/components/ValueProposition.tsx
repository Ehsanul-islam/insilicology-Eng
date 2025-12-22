import { motion } from 'framer-motion';
import { GraduationCap, Target, Microscope, FileCheck } from 'lucide-react';

const ValueProposition = () => {
  const values = [
    {
      icon: GraduationCap,
      title: 'Expert-Led',
      description: 'Learn from PhD researchers and industry experts with years of real-world experience in bioinformatics.',
      gradient: 'from-bio-teal to-bio-cyan',
    },
    {
      icon: Target,
      title: 'Career-Focused',
      description: 'Build portfolio projects that employers want to see. Get job-ready with practical bioinformatics skills.',
      gradient: 'from-bio-gold to-yellow-400',
    },
    {
      icon: Microscope,
      title: 'Hands-On Labs',
      description: 'Work with real datasets and research tools. Practice with genomic data, protein structures, and more.',
      gradient: 'from-bio-purple to-purple-400',
    },
    {
      icon: FileCheck,
      title: 'Certificates',
      description: 'Industry-recognized credentials to showcase your skills. Stand out with verified bioinformatics expertise.',
      gradient: 'from-blue-500 to-bio-teal',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Researchers Choose{' '}
            <span className="gradient-bio-text">BioCADD</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to excel in bioinformatics research
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white border border-border rounded-2xl p-8 hover:border-bio-teal hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-bio-teal transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;

