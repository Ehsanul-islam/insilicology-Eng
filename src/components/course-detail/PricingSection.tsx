import { motion } from 'framer-motion';
import { 
  Check, ArrowRight, Flame, Users, Shield, Clock, RefreshCw, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountdownTimer from './CountdownTimer';

interface ValueItem {
  item: string;
  original_price: number;
}

interface PricingSectionProps {
  priceOffer?: number | null;
  priceRegular?: number | null;
  valueBreakdown?: ValueItem[];
  countdownEndDate?: string | null;
  onEnrollClick: () => void;
  isEnrolled?: boolean;
  upcoming?: boolean;
  whatsIncluded?: string[];
  enrolledCount?: number;
}

const PricingSection = ({
  priceOffer,
  priceRegular,
  valueBreakdown,
  countdownEndDate,
  onEnrollClick,
  isEnrolled,
  upcoming,
  whatsIncluded,
  enrolledCount = 3000,
}: PricingSectionProps) => {
  const hasDiscount = priceRegular && priceOffer && priceOffer < priceRegular;

  // Calculate total value from breakdown
  const totalValue = valueBreakdown?.reduce(
    (sum, item) => sum + (item.original_price || 0), 0
  ) || 0;

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
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Join the n8n AI program today — learn automation and build a new skill for yourself
        </p>
      </motion.div>

      {/* Countdown Timer - Vibe Academy Minimalistic Style */}
      {countdownEndDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#f5f7ff] rounded-2xl p-6 border-2 border-dashed border-pink-300/50 text-center"
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
        className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl"
      >
        {/* Card Header */}
        <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Program Fee</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{enrolledCount.toLocaleString()} Enrolled</span>
            </div>
          </div>

          {/* Price Display */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl lg:text-5xl font-bold vibe-gradient-text">
              ${priceOffer ? Number(priceOffer).toLocaleString() : 'Free'}
            </span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                ${Number(priceRegular).toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold">
                Special Offer
              </span>
            )}
          </div>
          <p className="text-muted-foreground">One-time payment, lifetime access</p>
        </div>

        {/* What's Included */}
        {whatsIncluded && whatsIncluded.length > 0 && (
          <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800">
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
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-foreground">{String(item)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Value Breakdown */}
        {valueBreakdown && valueBreakdown.length > 0 && (
          <div className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
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
                    <span className="text-foreground/80">{item.item}</span>
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
        )}

        {/* CTA Section */}
        <div className="p-6 lg:p-8">
          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onEnrollClick}
              className="w-full vibe-cta-gradient text-white py-6 text-base font-semibold rounded-xl shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 group"
              size="lg"
            >
              {isEnrolled ? (
                'Continue Learning'
              ) : upcoming ? (
                'Pre-Register Now'
              ) : (
                <>
                  <span>Enroll Now ${priceOffer ? Number(priceOffer).toLocaleString() : 'Free'}</span>
                  <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              <span>100% Money Back</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Free Season 2</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">{enrolledCount.toLocaleString()}+</span> Students
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingSection;
