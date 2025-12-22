import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, CreditCard, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LearningJourney = () => {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Explore',
      subtitle: 'Courses',
      description: 'Browse our extensive catalog of bioinformatics courses',
    },
    {
      number: '02',
      icon: CreditCard,
      title: 'Enroll',
      subtitle: 'Today',
      description: 'Choose your path and start your learning journey',
    },
    {
      number: '03',
      icon: BookOpen,
      title: 'Learn',
      subtitle: '& Practice',
      description: 'Master concepts with hands-on labs and projects',
    },
    {
      number: '04',
      icon: Award,
      title: 'Certify',
      subtitle: '& Get Hired',
      description: 'Earn credentials and advance your research career',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-yellow-50"></div>
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Your Learning Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to becoming a bioinformatics expert
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-bio-teal via-bio-cyan to-bio-gold opacity-20"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 border border-border hover:border-bio-teal hover:shadow-xl transition-all duration-300 h-full">
                  {/* Step Number */}
                  <div className="text-6xl font-bold text-bio-teal opacity-10 mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-bio-teal to-bio-gold rounded-xl flex items-center justify-center mb-4 relative z-10 -mt-12">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">
                      {step.title}
                    </h3>
                    <p className="text-lg font-medium text-bio-teal">
                      {step.subtitle}
                    </p>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-20">
                    <svg 
                      className="w-8 h-8 text-bio-teal" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-bio-teal to-bio-gold hover:from-bio-teal/90 hover:to-bio-gold/90 text-white font-semibold px-10 py-6 text-lg shadow-xl"
          >
            <Link to="/courses">
              Start Your Journey
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningJourney;

