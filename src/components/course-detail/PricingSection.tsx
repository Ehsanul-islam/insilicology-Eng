import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Gift, Zap, Shield, ArrowRight, Sparkles,
  Clock, Tag, BadgeCheck
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
}: PricingSectionProps) => {
  const hasDiscount = priceRegular && priceOffer && priceOffer < priceRegular;
  const discountPercent = hasDiscount
    ? Math.round(((Number(priceRegular) - Number(priceOffer)) / Number(priceRegular)) * 100)
    : 0;

  // Calculate total value from breakdown
  const totalValue = valueBreakdown?.reduce(
    (sum, item) => sum + (item.original_price || 0), 0
  ) || 0;

  const savings = totalValue > 0 && priceOffer 
    ? totalValue - Number(priceOffer) 
    : hasDiscount 
    ? Number(priceRegular) - Number(priceOffer)
    : 0;

  return (
    <Card className="overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-xl">
      <CardContent className="p-0">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Special Offer</h2>
              {hasDiscount && (
                <Badge className="bg-red-500 text-white border-0 ml-auto">
                  {discountPercent}% OFF
                </Badge>
              )}
            </div>

            {/* Countdown Timer */}
            {countdownEndDate && (
              <div className="mb-4">
                <CountdownTimer endDate={countdownEndDate} />
              </div>
            )}

            {/* Price Display */}
            <div className="flex items-end gap-3 mb-2">
              <span className="text-5xl font-bold">
                {priceOffer ? `৳${Number(priceOffer).toLocaleString()}` : 'Free'}
              </span>
              {hasDiscount && (
                <span className="text-xl line-through text-white/60 mb-2">
                  ৳{Number(priceRegular).toLocaleString()}
                </span>
              )}
            </div>

            {savings > 0 && (
              <p className="text-white/90 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                You save ৳{savings.toLocaleString()}!
              </p>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Value Breakdown */}
          {valueBreakdown && valueBreakdown.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                What You'll Get
              </h3>
              
              <div className="space-y-3">
                {valueBreakdown.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">{item.item}</span>
                    </div>
                    <span className="text-muted-foreground line-through text-sm">
                      ৳{item.original_price.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Total Value */}
              {totalValue > 0 && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-800">
                  <span className="font-semibold">Total Value</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ৳{totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What's Included */}
          {whatsIncluded && whatsIncluded.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-purple-500" />
                Course Includes
              </h3>
              <ul className="space-y-2">
                {whatsIncluded.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{String(item)}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="w-4 h-4 text-purple-600" />
              <span>Certificate</span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onEnrollClick}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-7 text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/25 group"
              size="lg"
            >
              {isEnrolled ? (
                'Continue Learning'
              ) : upcoming ? (
                'Pre-Register Now'
              ) : (
                <>
                  Enroll Now
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Money Back Guarantee */}
          <p className="text-center text-sm text-muted-foreground">
            🔒 100% Secure Checkout • 7-Day Money Back Guarantee
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;

