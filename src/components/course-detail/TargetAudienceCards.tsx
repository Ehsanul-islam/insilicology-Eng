import { motion } from 'framer-motion';
import { 
  GraduationCap, Briefcase, Code, Lightbulb, TrendingUp, Users, 
  Rocket, Brain, Target, Zap, BookOpen, Award, Star, Heart,
  Building2, Laptop, Globe, Palette, Settings, Database
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TargetAudienceItem {
  title: string;
  description: string;
  icon: string;
}

interface TargetAudienceCardsProps {
  audience: TargetAudienceItem[];
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

// Gradient color pairs for cards
const gradients = [
  'from-purple-500 to-indigo-500',
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-violet-500 to-purple-500',
];

const TargetAudienceCards = ({ audience }: TargetAudienceCardsProps) => {
  if (!audience || audience.length === 0) return null;

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Users;
    return IconComponent;
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          🎯 Who Is This Course For?
        </h2>
        <p className="text-muted-foreground">
          This course is perfect for anyone looking to upskill
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {audience.map((item, index) => {
          const Icon = getIcon(item.icon);
          const gradient = gradients[index % gradients.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full overflow-hidden group cursor-pointer border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300">
                <CardContent className="p-6">
                  {/* Icon Container */}
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Hover Effect Line */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${gradient} mt-4 rounded-full`}
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TargetAudienceCards;

