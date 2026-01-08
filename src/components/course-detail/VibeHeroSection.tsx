import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Headphones, ChevronDown, Play, Calendar, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';
import { Sparkles, Flame } from 'lucide-react';

type Course = Tables<'courses'>;

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
  earlyBirdPrice?: number | null;
  earlyBirdLimit?: number | null;
  enrollmentCount?: number;

  instructorName?: string;
  duration?: string;
  modulesCount?: number;
  course?: Course | null;
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
  earlyBirdPrice,
  earlyBirdLimit,
  enrollmentCount,

  instructorName,
  duration,
  modulesCount,
  course,
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

  const isEarlyBirdActive = earlyBirdPrice && earlyBirdLimit && (enrollmentCount || 0) < earlyBirdLimit;
  const effectivePrice = isEarlyBirdActive ? earlyBirdPrice : priceOffer;
  const spotsLeft = isEarlyBirdActive && earlyBirdLimit ? earlyBirdLimit - (enrollmentCount || 0) : 0;

  // Progress bar calculations
  const totalSpots = earlyBirdLimit || 1;
  const takenSpots = enrollmentCount || 0;
  const percentClaimed = Math.min(100, Math.round((takenSpots / totalSpots) * 100));
  const progressWidth = `${percentClaimed}%`;




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

        {/* 65/35 Grid Layout for wider card - increased gap */}
        <div className="grid lg:grid-cols-[65fr_35fr] gap-8 lg:gap-12 items-stretch">
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
                          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer border border-white/30"
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
                <div className="px-4 py-2 rounded-full bg-emerald-50/90 backdrop-blur-md border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-700 text-sm font-semibold">Premium Contents</span>
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
            <div className="bg-white rounded-3xl p-6 border-0 ring-1 ring-gray-100 shadow-xl h-full flex flex-col w-full max-w-[350px] ml-auto">
              {/* Section Title */}
              <h3 className="text-2xl font-bold text-blue-600 mb-5">
                Course Details
              </h3>

              {/* Info Items - Optimized Grid */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 flex-1 mb-4">
                {/* Start Date */}
                {startDate && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Start</p>
                    </div>
                    <p className="text-base font-extrabold text-gray-900 pl-6">{startDate}</p>
                  </div>
                )}

                {/* End Date */}
                {endDate && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">End</p>
                    </div>
                    <p className="text-base font-extrabold text-gray-900 pl-6">{endDate}</p>
                  </div>
                )}

                {/* Time */}
                {courseTime && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Time</p>
                    </div>
                    <p className="text-base font-extrabold text-gray-900 pl-6">{courseTime}</p>
                  </div>
                )}

                {/* Capacity */}
                {(capacity || participantCount) && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Capacity</p>
                    </div>
                    <p className="text-base font-extrabold text-gray-900 pl-6">
                      {capacity || `${participantCount} Seats`}
                    </p>
                  </div>
                )}

                {/* Duration */}
                {duration && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Duration</p>
                    </div>
                    <p className="text-base font-extrabold text-gray-900 pl-6">{duration}</p>
                  </div>
                )}

                {/* Modules Count */}
                {modulesCount && (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Modules</p>
                    </div>
                    <p className="text-base font-extrabold text-gray-900 pl-6">{modulesCount} Modules</p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 w-full mb-5" />

              {/* Pricing Section */}
              <div className="mb-5">
                {isEarlyBirdActive ? (
                  /* PREMIUM EARLY BIRD CARD */
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-lg p-4 relative overflow-hidden">
                    {/* LIMITED OFFER BADGE */}
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                      LIMITED OFFER
                    </div>
                    {/* TITLE & PRICES */}
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 animate-pulse" />
                          Early Bird Offer
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-gray-900">${earlyBirdPrice}</span>
                          <span className="text-sm text-gray-400 line-through font-medium">${priceRegular}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-medium mb-0.5">Next Price</p>
                        <p className="text-lg font-bold text-gray-400 decoration-gray-300">${priceOffer}</p>
                      </div>
                    </div>
                    {/* PROGRESS BAR */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-orange-700">Only {spotsLeft} spots left!</span>
                        <span className="text-gray-400">{percentClaimed}% Claimed</span>
                      </div>
                      <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: progressWidth }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* REGULAR PRICING DISPLAY */
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-gray-400 line-through text-lg font-semibold">
                        ${priceRegular}
                      </span>
                      <span className="text-[#ef4444] text-4xl font-black tracking-tight leading-none">
                        ${effectivePrice}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                onClick={onEnrollClick}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-extrabold py-3.5 text-lg rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
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
