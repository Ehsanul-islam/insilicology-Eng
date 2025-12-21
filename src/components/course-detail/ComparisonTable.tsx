import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ComparisonFeature {
  feature: string;
  us: boolean;
  others: boolean;
}

interface ComparisonTableProps {
  features: ComparisonFeature[];
  courseTitle?: string;
}

const ComparisonTable = ({ features, courseTitle = 'We are' }: ComparisonTableProps) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="relative flex flex-col items-center">
      {/* Section Header - Positioned on top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 w-full"
      >
        <h2 className="text-2xl lg:text-[30px] font-bold text-foreground mb-2">
          What We Offer <span className="vibe-gradient-text">vs</span> Others
        </h2>
        <p className="text-muted-foreground text-sm">
          Why our program is unique?
        </p>
      </motion.div>

      {/* Comparison Table */}
      <div className="w-full flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
          style={{ width: '700.4px', maxWidth: '100%' }}
        >
          {/* Table Header - Dark Purple */}
          <div className="grid grid-cols-[1fr_180px_180px] gap-3 p-3 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white">
            <div className="text-xs font-semibold uppercase tracking-wide">
              Features
            </div>
            <div className="text-center text-xs font-semibold uppercase tracking-wide px-2">
              {courseTitle}
            </div>
            <div className="text-center text-xs font-semibold uppercase tracking-wide px-2">
              Others
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {features.map((item, index) => (
              <motion.div
                key={index}
                className="grid grid-cols-[1fr_180px_180px] gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Feature Name */}
                <div className="font-medium text-foreground flex items-center text-sm">
                  {item.feature}
                </div>
                
                {/* Us Column - Green Circle with White Checkmark - Centered */}
                <div className="flex justify-center items-center px-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {item.us ? (
                      <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center">
                        <X className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </motion.div>
                </div>
                
                {/* Others Column - Red Circle with White X - Centered */}
                <div className="flex justify-center items-center px-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 + 0.15, type: 'spring', stiffness: 200 }}
                  >
                    {item.others ? (
                      <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center">
                        <X className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 border-t border-slate-200 dark:border-slate-800">
            <p className="text-center text-sm text-muted-foreground">
              Not just learning automation, learn <span className="font-semibold text-foreground">real-world skills</span>!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComparisonTable;
