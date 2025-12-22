import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingCircles = [
  { size: 300, color: 'bg-purple-400/20', top: '10%', left: '5%', delay: 0 },
  { size: 200, color: 'bg-blue-400/20', top: '60%', left: '15%', delay: 0.5 },
  { size: 250, color: 'bg-emerald-400/20', top: '20%', right: '10%', delay: 1 },
  { size: 150, color: 'bg-amber-400/20', bottom: '20%', right: '5%', delay: 1.5 },
];

const animatedWords = ['ক্যারিয়ার', 'Skills', 'Future'];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Floating Animated Circles */}
      {floatingCircles.map((circle, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${circle.color}`}
          style={{
            width: circle.size,
            height: circle.size,
            top: circle.top,
            left: circle.left,
            right: circle.right,
            bottom: circle.bottom,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: circle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="container-custom relative z-10 flex min-h-screen items-center py-20 pt-28">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            {/* Greeting Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 border border-emerald-200"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">
                Welcome to LearnCraft
              </span>
            </motion.div>

            {/* Headline with Animated Word */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl font-siliguri">
                Build Your{' '}
                <motion.span
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {animatedWords[0]}
                </motion.span>
              </h1>
              <h2 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                With Expert-Led Courses
              </h2>
            </div>

            {/* Description */}
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              Join thousands of learners mastering research design, data analysis, 
              and professional skills through our practical, hands-on courses.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="group rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                asChild
              >
                <Link to="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group rounded-full border-2 border-slate-300 px-8 py-6 text-lg font-semibold text-foreground hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                asChild
              >
                <Link to="/demo">
                  <Play className="mr-2 h-5 w-5 text-purple-600" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Trust Text */}
            <p className="text-sm text-muted-foreground">
              ✓ Free 14-day trial · ✓ Cancel anytime · ✓ Certificate included
            </p>
          </motion.div>

          {/* Right Card - Dark Gradient Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl"
            >
              {/* Glow Effect */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

              {/* Live Badge */}
              <div className="relative mb-6 flex items-center justify-between">
                <span className="text-sm text-slate-400">Live Learning</span>
                <span className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Stats Row */}
              <div className="relative mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                      <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">2.5K+</div>
                      <div className="text-xs text-slate-400">Active Learners</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">50+</div>
                      <div className="text-xs text-slate-400">Workshops</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Course Preview */}
              <div className="relative rounded-xl bg-white/5 p-5 backdrop-blur-sm border border-white/10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-400">
                    Currently Trending
                  </span>
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Qualitative Research Methods
                </h3>
                <p className="mb-4 text-sm text-slate-400">
                  Master research design, data analysis & academic workflows
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Enrollment Progress</span>
                    <span className="text-purple-400">78%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Enrolled Users */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-7 w-7 rounded-full border-2 border-slate-800 bg-gradient-to-br from-purple-400 to-blue-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    +847 enrolled this week
                  </span>
                </div>
              </div>

              {/* Floating Labels */}
              <motion.div
                className="absolute -left-4 top-1/3 rounded-lg bg-white px-3 py-2 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-xs font-medium text-slate-700">
                  🎓 Certificate Ready
                </span>
              </motion.div>

              <motion.div
                className="absolute -right-4 bottom-1/4 rounded-lg bg-white px-3 py-2 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <span className="text-xs font-medium text-slate-700">
                  ⭐ 4.9 Rating
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
