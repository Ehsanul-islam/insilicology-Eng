import { motion } from 'framer-motion';
import { Gift, Crown, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValueBreakdownItem {
  item: string;
  original_price: number;
  is_premium?: boolean;
  sub_text?: string;
}

interface EverythingYoureGettingSectionProps {
  valueBreakdown: ValueBreakdownItem[];
  totalValue: number;
  priceOffer?: number | null;
  priceRegular?: number | null;
  onEnrollClick: () => void;
  isEnrolled?: boolean;
}

const EverythingYoureGettingSection = ({
  valueBreakdown,
  totalValue,
  priceOffer,
  priceRegular,
  onEnrollClick,
  isEnrolled,
}: EverythingYoureGettingSectionProps) => {
  const hasDiscount = priceRegular && priceOffer && priceOffer < priceRegular;
  const finalPrice = priceOffer || priceRegular || 0;

  return (
    <section className="pt-4 lg:pt-8 pb-8 lg:pb-12 bg-[#f5f7ff] relative overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Everything you're getting
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Not just programs, but complete business packages that will make you a successful automation expert
            </p>
          </div>

          {/* Priceless Value Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-t-2xl p-4 text-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold uppercase tracking-wider mb-1">
                  Priceless Value
                </div>
                <div className="text-sm text-white/90">
                  The complete package priced at ${totalValue.toLocaleString()} is available for just ${finalPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Items List */}
          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200 overflow-hidden">
            {valueBreakdown.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="p-3 lg:p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon - Minimalistic */}
                  <div className="shrink-0">
                    {item.is_premium ? (
                      <Crown className="w-5 h-5 text-yellow-500" fill="currentColor" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-400 flex items-center justify-center">
                        <Check className="w-3 h-3 text-slate-600" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-hind-siliguri text-sm font-medium text-[#0a2463]">
                      {item.item}
                    </h4>
                    {item.sub_text && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.sub_text}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="ml-4 shrink-0">
                  <div className="text-sm font-medium text-[#8b5cf6]">
                    ${item.original_price.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total Value Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-b-2xl p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wider mb-2">
                  Total Value
                </div>
                <div className="text-3xl lg:text-4xl font-bold">
                  ${totalValue.toLocaleString()}/-
                </div>
              </div>
              <div className="text-sm text-white/90 text-right max-w-xs">
                You get a complete package worth ${totalValue.toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Final Pricing and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-1 text-center"
          >
            {/* Pricing Text */}
            <div className="mb-4">
              <span className="text-xl text-[#ec4899] font-medium mr-2">
                The program fee is only
              </span>
              <span className="text-2xl lg:text-3xl font-bold text-[#ec4899]">
                ${finalPrice.toLocaleString()}
              </span>
            </div>

            {/* Enroll Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex justify-center"
            >
              <Button
                onClick={onEnrollClick}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 group"
                size="lg"
              >
                {isEnrolled ? (
                  'Continue Learning'
                ) : (
                  <>
                    <span>Enroll Now</span>
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EverythingYoureGettingSection;

