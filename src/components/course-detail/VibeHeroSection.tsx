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
          className="text-left mb-4"
        >
          {/* Title - Black & Bold */}
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-black mb-4">
            {title}
          </h1>

          {/* Meta Row: Batch & Instructor */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {batch && (
              <Badge variant="secondary" className="bg-[#dcfce7] text-[#166534] hover:bg-[#dcfce7]/80 px-2.5 py-0.5 text-xs font-semibold border-0 rounded-md">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {batch}
              </Badge>
            )}

            {instructorName && (
              <div className="flex items-center text-gray-900 font-medium">
                <span className="text-gray-500 mr-1.5">Speaker:</span>
                <span className='font-semibold text-[#6d28d9]'>{instructorName}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 65/35 Grid Layout for wider card */}
        <div className="grid lg:grid-cols-[65fr_35fr] gap-6 lg:gap-8 items-start">
          {/* Left Column (65%) - Poster Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            {/* Video Container with Glow */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Video Frame */}
              <div className="relative rounded-2xl overflow-hidden vibe-glass shadow-lg">
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
                        loading="eager"
                        fetchPriority="high"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer border border-white/30"
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

              {/* Premium Contents Badge - Re-positioned */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute right-4 bottom-4"
              >
                <div className="px-3 py-1.5 rounded-full bg-emerald-50/90 backdrop-blur-md border border-emerald-100 shadow-sm">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
              {/* Section Title */}
              <h3 className="text-2xl font-bold text-blue-600 mb-6">
                Course Details
              </h3>

              {/* Info Items - Optimized Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 flex-1 mb-8">
                {/* Start Date */}
                {startDate && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Start</p>
                    </div>
                    <p className="text-[15px] font-extrabold text-gray-900 pl-7">{startDate}</p>
                  </div>
                )}

                {/* End Date */}
                {endDate && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">End</p>
                    </div>
                    <p className="text-[15px] font-extrabold text-gray-900 pl-7">{endDate}</p>
                  </div>
                )}

                {/* Time */}
                {courseTime && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Time</p>
                    </div>
                    <p className="text-[15px] font-extrabold text-gray-900 pl-7">{courseTime}</p>
                  </div>
                )}

                {/* Capacity */}
                {(capacity || participantCount) && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Capacity</p>
                    </div>
                    <p className="text-[15px] font-extrabold text-gray-900 pl-7">
                      {capacity || `${participantCount} Seats`}
                    </p>
                  </div>
                )}

                {/* Duration */}
                {duration && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Duration</p>
                    </div>
                    <p className="text-[15px] font-extrabold text-gray-900 pl-7">{duration}</p>
                  </div>
                )}

                {/* Modules Count */}
                {modulesCount && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Modules</p>
                    </div>
                    <p className="text-[15px] font-extrabold text-gray-900 pl-7">{modulesCount} Modules</p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 w-full mb-6" />

              {/* Pricing Section */}
              <div className="mb-6">
                {priceRegular && priceOffer ? (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 line-through text-lg font-semibold">
                      ${priceRegular}
                    </span>
                    <span className="text-[#ef4444] text-[32px] font-black tracking-tight leading-none">
                      ${priceOffer}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* CTA Button */}
              <Button
                onClick={onEnrollClick}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-extrabold py-3.5 text-[15px] rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
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
          className="flex flex-col items-center gap-2 mt-8 mb-4 cursor-pointer relative z-20"
          onClick={scrollToContent}
        >
          <span className="text-gray-400 text-xs font-medium uppercase tracking-widest opacity-70">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-gray-300" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

VibeHeroSection.displayName = 'VibeHeroSection';

export default VibeHeroSection;
