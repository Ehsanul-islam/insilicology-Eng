import { motion } from 'framer-motion';
import { Users, BookOpen, Award, Briefcase, TrendingUp, Clock, Globe, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

// Animated counter with decimals support
const useCounter = (end: number, duration: number = 2000, startCounting: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
};

// Floating orb component for background
const FloatingOrb = ({ delay, color, size }: { delay: number; color: string; size: string }) => (
  <motion.div
    className={`absolute ${size} ${color} rounded-full blur-3xl opacity-20`}
    animate={{
      x: [0, 100, 0],
      y: [0, -100, 0],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 20,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const ImpactStats = () => {
  const [startCounting, setStartCounting] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const stats = [
    {
      icon: Users,
      count: 1100,
      label: 'Students',
      sublabel: 'Active Learners',
      gradient: 'from-orange-500 via-orange-600 to-red-500',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      borderColor: 'border-t-orange-500',
      growth: '+25%',
      sparkline: [20, 40, 30, 60, 45, 80, 100],
      milestone: { current: 1100, target: 2000 },
    },
    {
      icon: Users,
      count: 10,
      label: 'Instructors',
      sublabel: 'Expert Teachers',
      gradient: 'from-purple-500 via-purple-600 to-pink-500',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      borderColor: 'border-t-purple-500',
      growth: '+15%',
      sparkline: [10, 20, 15, 35, 30, 50, 100],
      milestone: { current: 10, target: 20 },
    },
    {
      icon: Briefcase,
      count: 5,
      label: 'Workshops',
      sublabel: 'Hands-on Sessions',
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-t-blue-500',
      growth: '+100%',
      sparkline: [5, 15, 10, 40, 35, 70, 100],
      milestone: { current: 5, target: 10 },
    },
    {
      icon: BookOpen,
      count: 4,
      label: 'Courses',
      sublabel: 'Premium Content',
      gradient: 'from-yellow-500 via-yellow-600 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
      borderColor: 'border-t-yellow-500',
      growth: '+33%',
      sparkline: [15, 25, 20, 45, 40, 75, 100],
      milestone: { current: 4, target: 10 },
    },
  ];

  const additionalStats = [
    { icon: Clock, value: '10K+', label: 'Hours of Content' },
    { icon: Award, value: '95%', label: 'Satisfaction Rate' },
    { icon: Globe, value: '25+', label: 'Countries Reached' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
  ];

  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} color="bg-orange-500" size="w-96 h-96 -top-48 -left-48" />
        <FloatingOrb delay={5} color="bg-purple-500" size="w-80 h-80 top-1/2 -right-40" />
        <FloatingOrb delay={10} color="bg-blue-500" size="w-72 h-72 -bottom-36 left-1/3" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setStartCounting(true)}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-2"
          >
            <div className="px-3 py-1 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10 border border-orange-500/20 rounded-full">
              <p className="text-xs font-semibold bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider">
                🚀 Our Impact
              </p>
            </div>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Our Success Story
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto mb-4">
            Empowering thousands of learners to build skills and shape their future
          </p>

          {/* Live Stats Badge with pulse animation */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-green-500/30 rounded-full shadow-md shadow-green-500/10">
              <div className="relative">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">LIVE STATS — UPDATING REAL-TIME</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Stats Grid - Compact & Centered */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-5 mb-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const count = useCounter(stat.count, 2500, startCounting);
            const progress = (stat.milestone.current / stat.milestone.target) * 100;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={`relative group bg-card rounded-2xl border-t-4 ${stat.borderColor} border-x border-b border-border overflow-hidden hover:shadow-2xl shadow-lg transition-all duration-300 cursor-pointer w-full sm:w-[calc(50%-0.5rem)] lg:w-[220px]`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={hoveredIndex === index ? {
                    x: ['-100%', '100%'],
                  } : {}}
                  transition={{ duration: 1.5 }}
                />

                <div className="relative p-3">
                  {/* Icon */}
                  <motion.div
                    animate={hoveredIndex === index ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`relative w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300`}></div>
                  </motion.div>

                  {/* Count */}
                  <div className="relative mb-1">
                    <motion.div
                      className={`text-4xl font-black mb-1 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}
                      animate={hoveredIndex === index ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {count}+
                    </motion.div>

                    {/* Growth badge */}
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full mb-2`}>
                      <TrendingUp className="w-2.5 h-2.5 text-green-600" />
                      <span className="text-xs font-bold text-green-600">{stat.growth}</span>
                    </div>
                  </div>

                  {/* Labels */}
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">
                    {stat.sublabel}
                  </p>
                  <p className="text-sm font-bold mb-2">
                    {stat.label}
                  </p>

                  {/* Mini sparkline chart */}
                  <div className="flex items-end gap-1 h-12 mb-2">
                    {stat.sparkline.map((value, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${value}%` }}
                        transition={{ duration: 0.5, delay: startCounting ? i * 0.1 : 0 }}
                        className={`flex-1 bg-gradient-to-t ${stat.gradient} rounded-md opacity-50 group-hover:opacity-80 transition-all duration-300 shadow-sm`}
                      />
                    ))}
                  </div>

                  {/* Progress bar to milestone */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="text-[10px]">Progress to {stat.milestone.target}</span>
                      <span className="font-semibold text-[10px]">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full shadow-sm`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary Stats Row - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-8 max-w-5xl mx-auto"
        >
          {additionalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg hover:shadow-md transition-all duration-300 w-full sm:w-[calc(50%-0.375rem)] lg:w-[200px]"
              >
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Call to Action - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary via-cyan-500 to-primary bg-[length:200%_100%] text-white font-bold text-sm rounded-full overflow-hidden transition-all duration-500 hover:bg-[position:100%_0] shadow-lg hover:shadow-xl"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            <span className="relative">Join Our Growing Community</span>
            <motion.svg
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.button>

          <p className="mt-2 text-xs text-muted-foreground">
            🎉 Join 1,100+ learners already transforming their careers
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;

