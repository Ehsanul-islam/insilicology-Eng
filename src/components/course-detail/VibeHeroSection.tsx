import { motion } from 'framer-motion';
import { Sparkles, Users, MessageCircle, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?/]+)/
    );
    return match ? match[1] : null;
  };

  const youtubeId = promoVideoUrl ? getYouTubeId(promoVideoUrl) : null;

  return (
    <section className="relative overflow-hidden bg-[#f5f7ff] dark:bg-slate-900/50">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      
      <div className="container-custom relative py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Subtitle Badge */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <Badge 
                  variant="secondary" 
                  className="px-4 py-2 text-sm font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                  {subtitle}
                </Badge>
              </motion.div>
            )}

            {/* Animated Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {title}
              </span>
            </motion.h1>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Button
                onClick={onEnrollClick}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-7 text-lg font-semibold rounded-xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
              >
                {isEnrolled ? 'Continue Learning' : upcoming ? 'Pre-Register Now' : 'Enroll Now'}
              </Button>
            </motion.div>

            {/* Stats Bar */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8"
              >
                {stats.students && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{stats.students.toLocaleString()}+</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                  </div>
                )}
                
                {stats.community && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
                      <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{stats.community}</p>
                      <p className="text-sm text-muted-foreground">Community</p>
                    </div>
                  </div>
                )}
                
                {stats.support && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/50">
                      <Headphones className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{stats.support}</p>
                      <p className="text-sm text-muted-foreground">Support</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Video/Poster Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
              {/* Decorative Border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl opacity-75 blur" />
              
              <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden">
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title="Course promo video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
                    <Sparkles className="w-16 h-16 text-white/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl opacity-20 blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VibeHeroSection;

