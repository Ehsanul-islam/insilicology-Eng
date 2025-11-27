import { motion } from 'framer-motion';
import { BookOpen, Trophy, Users, Video, Clock, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Content',
      description: 'Learn from industry professionals with years of real-world experience.',
    },
    {
      icon: Video,
      title: 'HD Video Lessons',
      description: 'Crystal-clear videos with lifetime access and downloadable resources.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a thriving community of learners and get help when you need it.',
    },
    {
      icon: Trophy,
      title: 'Certificates',
      description: 'Earn industry-recognized certificates upon course completion.',
    },
    {
      icon: Clock,
      title: 'Learn at Your Pace',
      description: 'Study on your schedule with flexible, self-paced learning.',
    },
    {
      icon: Shield,
      title: 'Money-Back Guarantee',
      description: '30-day refund policy if you\'re not satisfied with your purchase.',
    },
  ];

  return (
    <section className="py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">LearnCraft</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in your learning journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
