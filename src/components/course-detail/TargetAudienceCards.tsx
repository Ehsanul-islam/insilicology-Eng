import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Briefcase, Code, Lightbulb, TrendingUp, Users,
  Rocket, Brain, Target, Zap, BookOpen, Award, Star, Heart,
  Building2, Laptop, Globe, Palette, Settings, Database, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TargetAudienceItem {
  title: string;
  description: string;
  icon: string;
}

interface TargetAudienceCardsProps {
  audience: TargetAudienceItem[];
  onEnrollClick?: () => void;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Briefcase,
  Code,
  Lightbulb,
  TrendingUp,
  Users,
  Rocket,
  Brain,
  Target,
  Zap,
  BookOpen,
  Award,
  Star,
  Heart,
  Building2,
  Laptop,
  Globe,
  Palette,
  Settings,
  Database,
};

// Icon colors for each card
const iconColors = [
  { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
];

const TargetAudienceCards = ({ audience, onEnrollClick }: TargetAudienceCardsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!audience || audience.length === 0) return null;

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Users;
    return IconComponent;
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 w-[75%] mx-auto">
      {/* Section Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl lg:text-2xl font-bold mb-2 text-foreground">
          Who Is This Course For?
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          This course is for anyone who wants to learn AI automation for business, career, or freelancing
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audience.map((item, index) => {
          const Icon = getIcon(item.icon);
          const colors = iconColors[index % iconColors.length];
          const isExpanded = expandedIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              layout
              className="h-full"
            >
              <motion.div
                onClick={() => toggleExpand(index)}
                className={`relative bg-white dark:bg-slate-900/50 rounded-xl border ${isExpanded ? colors.border : 'border-slate-200 dark:border-slate-800'} overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md h-full flex flex-col`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                layout
              >
                {/* Card Header - Always Visible */}
                <div className="p-4 flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>

                  {/* Title & Short Preview */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground mb-0.5 pr-4">
                      {item.title}
                    </h3>
                    <p className={`text-xs text-muted-foreground ${!isExpanded ? 'line-clamp-2' : ''}`}>
                      {!isExpanded && item.description.length > 50
                        ? item.description.slice(0, 50) + '...'
                        : !isExpanded
                          ? item.description
                          : null}
                    </p>
                  </div>

                  {/* Expand Indicator */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 mt-0.5"
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-foreground/80 leading-relaxed text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gradient Accent Line at Bottom */}
                <div className={`mt-auto h-0.5 w-full transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="h-full w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Button */}
      {onEnrollClick && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center pt-4"
        >
          <Button
            onClick={onEnrollClick}
            className="vibe-cta-gradient text-white px-8 py-4 text-sm font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300"
          >
            Enroll Now
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TargetAudienceCards;
