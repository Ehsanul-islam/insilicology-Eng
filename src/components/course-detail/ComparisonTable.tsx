import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ComparisonFeature {
  feature: string;
  us: boolean;
  others: boolean;
}

interface ComparisonTableProps {
  features: ComparisonFeature[];
  courseTitle?: string;
}

const ComparisonTable = ({ features, courseTitle = 'This Course' }: ComparisonTableProps) => {
  if (!features || features.length === 0) return null;

  return (
    <Card className="overflow-hidden border-2 border-purple-100 dark:border-purple-900/50">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <motion.h2 
            className="text-2xl font-bold text-center flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="w-6 h-6" />
            What We Offer vs Others
          </motion.h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-border">
          <div className="font-semibold text-muted-foreground">Feature</div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              {courseTitle}
            </div>
          </div>
          <div className="text-center font-semibold text-muted-foreground">Others</div>
        </div>

        {/* Feature Rows */}
        <div className="divide-y divide-border">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="grid grid-cols-3 gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="font-medium text-foreground flex items-center">
                {item.feature}
              </div>
              
              <div className="flex justify-center items-center">
                {item.us ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.1, type: 'spring' }}
                    className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.1, type: 'spring' }}
                    className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex justify-center items-center">
                {item.others ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.15, type: 'spring' }}
                    className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.15, type: 'spring' }}
                    className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 text-center">
          <p className="text-sm text-muted-foreground">
            Choose the best learning experience with our comprehensive course content
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;

