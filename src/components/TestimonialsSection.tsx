import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  institution: string;
  rating: number;
  quote: string;
  avatar?: string;
}

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample testimonials - in production, this would be fetched from database
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'PhD Researcher',
      institution: 'Stanford University',
      rating: 5,
      quote: 'The genomics course transformed my research approach. The hands-on labs with real datasets were invaluable for my dissertation work.',
    },
    {
      id: 2,
      name: 'Amit Patel',
      role: 'Bioinformatics Analyst',
      institution: 'Genentech',
      rating: 5,
      quote: 'Outstanding CADD courses! I landed my dream job in drug discovery thanks to the practical skills I learned here.',
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      role: 'Postdoctoral Fellow',
      institution: 'MIT',
      rating: 5,
      quote: 'The ML/AI courses are perfectly tailored for biological data. Expert instructors with deep understanding of both fields.',
    },
    {
      id: 4,
      name: 'Raj Kumar',
      role: 'MSc Student',
      institution: 'Cambridge University',
      rating: 5,
      quote: 'Best investment in my career. The certificate helped me secure multiple research positions. Highly recommend!',
    },
    {
      id: 5,
      name: 'Dr. Maria Garcia',
      role: 'Research Scientist',
      institution: 'NIH',
      rating: 5,
      quote: 'Comprehensive proteomics content with excellent support. The community is incredibly helpful and collaborative.',
    },
    {
      id: 6,
      name: 'David Kim',
      role: 'Computational Biology PhD',
      institution: 'Harvard Medical School',
      rating: 5,
      quote: 'The quality of instruction is phenomenal. Real-world applications and cutting-edge techniques taught by industry experts.',
    },
  ];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of satisfied researchers advancing their careers
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-border rounded-2xl p-6 hover:border-bio-teal hover:shadow-xl transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-10 h-10 text-bio-teal opacity-20" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 text-bio-gold fill-bio-gold" 
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-bio-teal to-bio-gold rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-bio-teal">
                      {testimonial.institution}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-bio-teal' 
                    : 'bg-border hover:bg-bio-teal hover:opacity-50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-border"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-bio-teal mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-bio-gold mb-2">10k+</div>
            <div className="text-sm text-muted-foreground">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-bio-purple mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">85%</div>
            <div className="text-sm text-muted-foreground">Career Success</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

