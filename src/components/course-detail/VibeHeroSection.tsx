import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Headphones, ChevronDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Stats {
  students?: number;
  community?: string;
  support?: string;
}

interface VibeHeroSectionProps {
  title: string;
  subtitle?: string;
  promoVideoUrl?: string;
  posterUrl?: string;
  stats?: Stats;
  onEnrollClick: () => void;
  isEnrolled?: boolean;
  upcoming?: boolean;
}

// Text scramble effect hook
const useTextScramble = (text: string, duration: number = 1500) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  
  const scramble = useCallback(() => {
    let iteration = 0;
    const originalText = text;
    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, duration / (text.length * 3));

    return () => clearInterval(interval);
  }, [text, duration, chars]);

  useEffect(() => {
    const cleanup = scramble();
    return cleanup;
  }, [scramble]);

  return displayText;
};

const VibeHeroSection = ({
  title,
  subtitle,
  promoVideoUrl,
  posterUrl,
  stats,
  onEnrollClick,
  isEnrolled,
  upcoming,
}: VibeHeroSectionProps) => {
  const scrambledTitle = useTextScramble(title, 3000);
  
  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?/]+)/
    );
    return match ? match[1] : null;
  };

  const youtubeId = promoVideoUrl ? getYouTubeId(promoVideoUrl) : null;

  const scrollToContent = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen overflow-hidden vibe-hero-bg">
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 vibe-grid-dark opacity-40" />
      
      {/* Gradient Orbs */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px]"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
        animate={{ 
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container-custom relative z-10 py-16 lg:py-24 flex flex-col min-h-[90vh] lg:min-h-screen">
        {/* Main Content Grid */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Subtitle Badge */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <span className="px-4 py-2 text-sm font-medium text-white/80 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  {subtitle}
                </span>
              </motion.div>
            )}

            {/* Animated Headline with Scramble Effect */}
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-[48px] font-bold mb-5 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-white">{scrambledTitle}</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-base md:text-lg text-white/60 mb-6 max-w-xl mx-auto lg:mx-0"
            >
              Transform your skills with our comprehensive learning program
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-10"
            >
              <Button
                onClick={onEnrollClick}
                size="lg"
                className="vibe-cta-gradient text-white px-10 py-6 text-base font-semibold rounded-xl shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
              >
                {isEnrolled ? 'Continue Learning' : upcoming ? 'Pre-Register Now' : 'Enroll Now'}
              </Button>
            </motion.div>

            {/* Stats Bar - Pill Style */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                {stats.students && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span className="text-white font-semibold">{stats.students.toLocaleString()}+</span>
                    <span className="text-white/50 text-sm">Students</span>
                  </div>
                )}
                
                {stats.community && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-semibold">{stats.community}</span>
                  </div>
                )}
                
                {stats.support && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                    <Headphones className="w-4 h-4 text-indigo-400" />
                    <span className="text-white font-semibold">{stats.support}</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Video/Poster Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative order-1 lg:order-2"
          >
            {/* Video Container with Glow */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Video Frame */}
              <div className="relative rounded-2xl overflow-hidden vibe-glass">
                <div className="relative aspect-video bg-slate-900/80 rounded-2xl overflow-hidden">
                  {youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                      title="Course promo video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : posterUrl ? (
                    <>
                      <img
                        src={posterUrl}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                        >
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-900/50 to-purple-900/50">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-white/10 rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-4 -bottom-4 lg:-right-8 lg:-bottom-6"
              >
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-sm font-medium">Live Support</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-2 mt-8 cursor-pointer"
          onClick={scrollToContent}
        >
          <span className="text-white/50 text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VibeHeroSection;
