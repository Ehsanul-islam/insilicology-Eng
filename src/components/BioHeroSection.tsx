import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BioHeroSection = () => {
  const stats = [
    { icon: BookOpen, value: '35+', label: 'Courses' },
    { icon: Users, value: '8', label: 'Batches' },
    { icon: Users, value: '10k+', label: 'Learners' },
    { icon: Star, value: '4.9', label: 'Rated' },
  ];

  return (
    <section className="relative bg-white pt-24 pb-16 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-yellow-200/30 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-bio-off-white border border-cyan-200 rounded-full"
            >
              <Star className="w-4 h-4 text-bio-gold fill-bio-gold" />
              <span className="text-sm font-medium text-foreground">
                Trusted by 10,000+ researchers & students
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                The #1 Platform for{' '}
                <span className="relative inline-block">
                  <span className="gradient-bio-text">Bioinformatics Education</span>
                  {/* Animated underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-bio-teal via-bio-cyan to-bio-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Master genomics, proteomics, and drug discovery with expert-led courses 
                designed for real research.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-bio-gold hover:opacity-90 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-bio-teal text-bio-teal hover:bg-bio-teal hover:text-white font-semibold px-8 py-6 text-lg transition-all"
              >
                <Link to="/contact">Book Consultation</Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-5 h-5 text-bio-teal" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-bio-teal/10 to-bio-gold/10 p-8">
              {/* DNA Helix Illustration */}
              <div className="aspect-square flex items-center justify-center">
                <svg 
                  viewBox="0 0 400 400" 
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* DNA Strand visualization */}
                  <defs>
                    <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(188 100% 42%)" />
                      <stop offset="50%" stopColor="hsl(191 97% 77%)" />
                      <stop offset="100%" stopColor="hsl(45 93% 58%)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Left strand */}
                  <motion.path
                    d="M 100 50 Q 120 150 100 250 T 100 450"
                    stroke="url(#dnaGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  
                  {/* Right strand */}
                  <motion.path
                    d="M 300 50 Q 280 150 300 250 T 300 450"
                    stroke="url(#dnaGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  
                  {/* Base pairs */}
                  {[...Array(8)].map((_, i) => (
                    <motion.line
                      key={i}
                      x1="100"
                      y1={70 + i * 40}
                      x2="300"
                      y2={70 + i * 40}
                      stroke="url(#dnaGradient)"
                      strokeWidth="3"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 0.6, scaleX: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    />
                  ))}
                  
                  {/* Molecules */}
                  {[...Array(8)].map((_, i) => (
                    <motion.g key={i}>
                      <motion.circle
                        cx="100"
                        cy={70 + i * 40}
                        r="8"
                        fill="hsl(188 100% 42%)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      />
                      <motion.circle
                        cx="300"
                        cy={70 + i * 40}
                        r="8"
                        fill="hsl(45 93% 58%)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      />
                    </motion.g>
                  ))}
                </svg>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-6 right-6 bg-white rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-bio-teal to-bio-gold rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Certificate Ready</div>
                    <div className="text-xs text-muted-foreground">Industry Recognized</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BioHeroSection;

