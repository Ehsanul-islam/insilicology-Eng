import { motion } from 'framer-motion';
import {
  Check, ArrowRight, Flame, Users, Shield, Clock, Star, Video, Zap, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from './CountdownTimer';
import { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;

interface ValueItem {
  item: string;
  original_price: number;
}

interface Stats {
  fakeEnrollmentPadding?: string;
  genuineThreshold?: string;
  students?: string;
}

interface PricingSectionProps {
  priceRegular?: number | null;
  priceOffer?: number | null;
  earlyBirdPrice?: number | null;
  earlyBirdLimit?: number | null;
  valueBreakdown?: ValueItem[];
  countdownEndDate?: string | null;
  onEnrollClick: () => void;
  isEnrolled?: boolean;
  upcoming?: boolean;


  enrolledCount?: number;
  stats?: Stats | null;
  course?: Course | null;
}

const PricingSection = ({
  priceOffer,
  priceRegular,
  earlyBirdPrice,
  earlyBirdLimit,
  valueBreakdown,
  countdownEndDate,
  onEnrollClick,
  isEnrolled,
  upcoming,
  whatsIncluded,


  stats,
  course,
  enrolledCount,
}: PricingSectionProps) => {
  // Scarcity Logic
  const realEnrollmentCount = enrolledCount || 0;
  const padding = stats?.fakeEnrollmentPadding ? parseInt(stats.fakeEnrollmentPadding) : 0;
  const threshold = stats?.genuineThreshold ? parseInt(stats.genuineThreshold) : 0;

  // If we have padding configured and real count is less than threshold, show padded count
  // Otherwise show real count
  const displayedEnrollmentCount = (padding > 0 && realEnrollmentCount < threshold)
    ? realEnrollmentCount + padding
    : realEnrollmentCount;

  // Use the total students count from stats if available, otherwise use the batch enrollment count
  // This decoupling allows showing "12,500 Enrolled" (Social Proof) while having "8 Spots Left" (Scarcity)
  const totalEnrolledDisplay = stats?.students || displayedEnrollmentCount.toLocaleString();

  const isEarlyBirdActive = earlyBirdPrice && earlyBirdLimit && displayedEnrollmentCount < earlyBirdLimit;
  const effectivePrice = isEarlyBirdActive ? earlyBirdPrice : priceOffer;

  // Progress bar calculations
  const totalSpots = earlyBirdLimit || 1;
  const takenSpots = displayedEnrollmentCount || 0;
  const percentClaimed = Math.min(100, Math.round((takenSpots / totalSpots) * 100));
  const spotsLeft = Math.max(0, totalSpots - takenSpots);
  const progressWidth = `${percentClaimed}%`;


  const hasDiscount = priceRegular && effectivePrice && effectivePrice < priceRegular;
  const totalValue = valueBreakdown?.reduce((acc, item) => acc + Number(item.original_price || 0), 0) || 0;

  return (
    <div className="space-y-8" id="checkout">
      {/* Section Header with Fire Emoji */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 mb-4 shadow-lg shadow-orange-500/30">
          <Flame className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl lg:text-[30px] font-bold mb-3 text-foreground">
          Join the Program Today
        </h2>
      </motion.div>

      {/* Countdown Timer - Vibe Academy Minimalistic Style */}
      {countdownEndDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#f5f7ff] rounded-2xl p-4 border-2 border-dashed border-pink-300/50 text-center"
        >
          <p className="text-[#ec4899] mb-4 text-base font-medium">
            When the offer ends, the price will go up to ${Number(priceRegular).toLocaleString()}!
          </p>
          <CountdownTimer endDate={countdownEndDate} variant="hero" />
        </motion.div>
      )}

      {/* Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl relative"
      >
        {/* Card Header - Premium Design */}
        <div className="p-6 lg:p-8 pb-4 lg:pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Program Fee</h3>
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              <Users className="w-4 h-4" />
              <span>{totalEnrolledDisplay} Enrolled</span>
            </div>
          </div>

          {isEarlyBirdActive ? (
            /* PREMIUM EARLY BIRD CARD */
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-lg p-5 relative overflow-hidden mb-6">
              {/* LIMITED OFFER BADGE */}
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                LIMITED OFFER
              </div>

              {/* TITLE & PRICES */}
              <div className="flex justify-between items-end mb-4 pt-2">
                <div>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 animate-pulse" />
                    Early Bird Offer
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">${earlyBirdPrice}</span>
                    <span className="text-base text-gray-400 line-through font-medium translate-y-[-2px]">${priceRegular}</span>
                  </div>
                </div>
                <div className="text-right pb-1">
                  <p className="text-[11px] text-gray-500 font-medium mb-1 uppercase tracking-wide">Next Price</p>
                  <p className="text-2xl font-bold text-gray-400 decoration-gray-300 decoration-2">${priceOffer}</p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-orange-700">Only {spotsLeft} spots left!</span>
                  <span className="text-gray-400">{percentClaimed}% Claimed</span>
                </div>
                <div className="h-2.5 w-full bg-orange-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: progressWidth }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* REGULAR PRICING DISPLAY */
            <div className="flex items-end justify-between gap-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl lg:text-5xl font-bold vibe-gradient-text">
                  ${effectivePrice ? Number(effectivePrice).toLocaleString() : 'Free'}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${Number(priceRegular).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
            One-time payment, lifetime access
          </p>
        </div>

        {/* What's Included */}
        {
          whatsIncluded && whatsIncluded.length > 0 && (
            <div className="p-6 lg:p-8 py-4 lg:py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-3">
                {whatsIncluded.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-foreground text-sm">{String(item)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        }

        {/* Value Breakdown */}
        {
          valueBreakdown && valueBreakdown.length > 0 && (
            <div className="p-6 lg:p-8 pt-4 lg:pt-4 pb-4 lg:pb-4 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-foreground mb-4">What You're Getting</h4>
              <div className="space-y-3">
                {valueBreakdown.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="text-foreground/80 text-sm">{item.item}</span>
                    </div>
                    <span className="text-muted-foreground line-through text-sm">
                      ${item.original_price.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Total Value */}
              {totalValue > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total Value</span>
                  <span className="text-2xl font-bold vibe-gradient-text">
                    ${totalValue.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )
        }

        {/* Savings Summary Box */}
        {
          totalValue > 0 && effectivePrice && (
            <div className="px-6 lg:px-8 pb-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  <h4 className="font-bold text-green-900 dark:text-green-100 uppercase tracking-wide text-sm">Your Savings Today</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Total Value:</span>
                    <span className="font-semibold">${totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Pre-Registration Price:</span>
                    <span className="font-semibold">-${Number(effectivePrice).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-green-200 dark:bg-green-800 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-900 dark:text-green-100 text-base">YOU SAVE:</span>
                    <span className="font-black text-green-600 dark:text-green-400 text-xl">
                      ${(totalValue - Number(effectivePrice)).toLocaleString()} <span className="text-sm">(96%)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* CTA Section */}
        <div className="p-6 lg:p-8 pt-4 lg:pt-4">
          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onEnrollClick}
              className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-black text-lg font-extrabold py-6 rounded-xl shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 group"
              size="lg"
            >
              {isEnrolled ? (
                'Continue Learning'
              ) : upcoming ? (
                'Secure Your Spot'
              ) : (
                <>
                  <span>Enroll Now - ${effectivePrice ? Number(effectivePrice).toLocaleString() : 'Free'}</span>
                  <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <div className="mt-6 grid grid-cols-2 gap-x-32 gap-y-3 w-fit mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-600 shrink-0" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Best Instructor</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Class Recordings</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-muted-foreground">
              <p className="text-sm text-muted-foreground">
                Trusted by <span className="font-semibold text-foreground">{totalEnrolledDisplay}+</span> Students
              </p>
            </p>
          </div>
        </div>
      </motion.div >
    </div >
  );
};

export default PricingSection;
