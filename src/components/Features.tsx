import { motion } from 'framer-motion';
import { BookOpen, Trophy, Users, Video, Clock, Shield } from 'lucide-react';
import { useState } from 'react';

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Content',
      description: 'Learn from industry professionals with years of real-world experience.',
      gradient: 'from-violet-500 to-purple-500',
      span: 'md:col-span-1',
    },
    {
      icon: Video,
      title: 'HD Video Lessons',
      description: 'Crystal-clear videos with lifetime access and downloadable resources.',
      gradient: 'from-blue-500 to-cyan-500',
      span: 'md:col-span-1',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a thriving community of learners and get help when you need it.',
      gradient: 'from-pink-500 to-rose-500',
      span: 'md:col-span-1',
    },
    {
      icon: Trophy,
      title: 'Certificates',
      description: 'Earn industry-recognized certificates upon course completion.',
      gradient: 'from-amber-500 to-orange-500',
      span: 'md:col-span-1',
    },
    {
      icon: Clock,
      title: 'Learn at Your Pace',
      description: 'Study on your schedule with flexible, self-paced learning.',
      gradient: 'from-emerald-500 to-teal-500',
      span: 'md:col-span-1',
    },
    {
      icon: Shield,
      title: 'Money-Back Guarantee',
      description: '30-day refund policy if you\'re not satisfied with your purchase.',
      gradient: 'from-indigo-500 to-blue-500',
      span: 'md:col-span-1',
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Why Choose <span className="gradient-text">LearnCraft</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in your learning journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className={`${feature.span} group relative`}
            >
              {/* Animated gradient border */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

              {/* Card content */}
              <div className="relative h-full p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 overflow-hidden">
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                {/* Icon container with gradient */}
                <div className="relative mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                    <feature.icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold mb-1.5 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full -translate-y-8 translate-x-8`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-xs font-medium text-muted-foreground">
              Join <span className="text-primary font-bold">10,000+</span> learners already growing their skills
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
