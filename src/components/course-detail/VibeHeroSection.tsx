import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Headphones, ChevronDown, Play, Calendar, Clock, BookOpen } from 'lucide-react';
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
  // New props for info sidebar
  startDate?: string;
  endDate?: string;
  courseTime?: string;
  participantCount?: number;
  capacity?: string;
  priceRegular?: number;
  priceOffer?: number;
  batch?: string;

  instructorName?: string;
  duration?: string;
  modulesCount?: number;
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

const VibeHeroSection = memo(({
  title,
  subtitle,
  promoVideoUrl,
  posterUrl,
  stats,
  onEnrollClick,
  isEnrolled,
  upcoming,
  startDate,
  endDate,
  courseTime,
  participantCount,
  capacity,
  priceRegular,
  priceOffer,
  batch,

  instructorName,
  duration,
  modulesCount,
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

  // Calculate discount percentage
  const discountPercent = priceRegular && priceOffer
    ? Math.round(((priceRegular - priceOffer) / priceRegular) * 100)
    : 0;

  const scrollToContent = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Animated Grid Pattern - Removed for white background */}


      {/* Gradient Orbs - Removed for white background */}

      <div className="container-custom relative z-10 pt-4 pb-0 lg:pt-8 lg:pb-0">
        {/* Title Section - Above Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-left mb-2"
        >
          {/* Title - Black & Bold */}
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-black mb-4">
            {title}
          </h1>

          {/* Meta Row: Batch & Instructor */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {batch && (
              <Badge variant="secondary" className="bg-[#dcfce7] text-[#166534] hover:bg-[#dcfce7]/80 px-2 py-0.5 text-xs font-medium border-0">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {batch}
              </Badge>
            )}

            {instructorName && (
              <div className="flex items-center text-gray-700 font-medium">
                <span className="text-gray-500 mr-2">Speaker:</span>
                {instructorName}
              </div>
            )}
          </div>
        </motion.div>

        {/* 72/28 Grid Layout with minimal gap */}
        <div className="grid lg:grid-cols-[72fr_28fr] gap-1">
          {/* Left Column (65%) - Poster Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.72, x: -50 }}
            animate={{ opacity: 1, scale: 0.8, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative origin-top-left"
          >
            {/* Video Container with Glow */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-500/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Video Frame */}
              <div className="relative rounded-2xl overflow-hidden vibe-glass">
                <div className="relative aspect-video bg-slate-900/80 rounded-2xl overflow-hidden">
                  {youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                      title="Course promo video"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : posterUrl ? (
                    <>
                      <img
                        src={posterUrl}
                        alt={title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                        >
                          <Play className="w-6 h-6 text-white ml-1" fill="white" />
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-900/50 to-purple-900/50">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 border-2 border-white/10 rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Contents Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-3 -bottom-3 lg:-right-6 lg:-bottom-5"
              >
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 shadow-xl">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-700 text-xs font-semibold">Premium Contents</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column (35%) - Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.72, x: 50 }}
            animate={{ opacity: 1, scale: 0.8, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative origin-top-left"
          >
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xl h-full flex flex-col">
              {/* Section Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Course Details
              </h3>

              {/* Info Items */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 flex-1">
                {/* Start Date */}
                {startDate && (
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Start</p>
                      <p className="text-sm text-gray-900 font-bold">{startDate}</p>
                    </div>
                  </div>
                )}

                {/* End Date */}
                {endDate && (
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">End</p>
                      <p className="text-sm text-gray-900 font-bold">{endDate}</p>
                    </div>
                  </div>
                )}

                {/* Time */}
                {courseTime && (
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Time</p>
                      <p className="text-sm text-gray-900 font-bold">{courseTime}</p>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {(capacity || participantCount) && (
                  <div className="flex gap-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Capacity</p>
                      <p className="text-sm text-gray-900 font-bold">
                        {capacity || `${participantCount} Seats`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Duration */}
                {duration && (
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Duration</p>
                      <p className="text-sm text-gray-900 font-bold">{duration}</p>
                    </div>
                  </div>
                )}

                {/* Modules Count */}
                {modulesCount && (
                  <div className="flex gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Modules</p>
                      <p className="text-sm text-gray-900 font-bold">{modulesCount} Modules</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-200 my-6" />

              {/* Pricing Section */}
              <div className="mb-6">
                {priceRegular && priceOffer ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-gray-400 line-through text-sm font-medium">
                      ৳{priceRegular.toLocaleString()}
                    </span>
                    <span className="text-red-600 text-2xl font-bold">
                      ৳{priceOffer.toLocaleString()}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* CTA Button */}
              <Button
                onClick={onEnrollClick}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold py-6 text-base rounded-md mt-auto transition-all"
              >
                {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-2 mt-4 mb-4 cursor-pointer relative z-20"
          onClick={scrollToContent}
        >
          <span className="text-gray-400 text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

VibeHeroSection.displayName = 'VibeHeroSection';

export default VibeHeroSection;
