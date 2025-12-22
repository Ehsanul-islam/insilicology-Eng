import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const barHeights = [40, 55, 30, 70, 50, 80];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-white" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-7xl mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center"
      >
        {/* Left content */}
        <motion.div variants={item}>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-slate-900">
            Master <br />
            <span className="text-emerald-500">Research Design</span>
          </h1>

          <p className="mt-6 text-slate-700 max-w-xl text-base md:text-lg leading-relaxed">
            A modern learning platform for students and researchers. Learn
            qualitative research, data analysis, and academic workflows through
            concise, practical courses.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 md:px-7 py-3 rounded-full bg-emerald-400 text-slate-900 font-medium shadow-lg shadow-emerald-200 transition"
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 md:px-7 py-3 rounded-full border border-slate-200 text-slate-900 font-medium bg-white transition"
            >
              Explore Courses
            </motion.button>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Free 14-day trial · Cancel anytime
          </p>
        </motion.div>

        {/* Right card */}
        <motion.div
          variants={item}
          whileHover={{ y: -8 }}
          className="relative"
        >
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">Search methods</span>
              <span className="bg-emerald-400 text-xs px-3 py-1 rounded-full font-medium text-slate-900">
                Live
              </span>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Qualitative Research
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              A clear, practical introduction to qualitative research design,
              data interpretation, and academic writing.
            </p>

            {/* Fake chart line */}
            <div className="h-24 bg-slate-50 rounded-xl flex items-end p-3 gap-2">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-4 rounded bg-emerald-400"
                />
              ))}
            </div>

            {/* Students */}
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="w-8 h-8 rounded-full bg-slate-300" />
                <div className="w-8 h-8 rounded-full bg-slate-400" />
              </div>
              <span>+2k active learners</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl leading-tight font-semibold text-gray-900"
          >
            Master <br />
            <span className="text-emerald-500">Research Design</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-gray-700 max-w-xl text-base leading-relaxed"
          >
            A modern learning platform for students and researchers. Learn
            qualitative research, data analysis, and academic workflows
            through concise, practical courses.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="px-7 py-3 rounded-full bg-emerald-400 text-black font-medium shadow-lg shadow-emerald-200 transition"
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="px-7 py-3 rounded-full border border-gray-300 text-gray-900 transition"
            >
              Explore Courses
            </motion.button>
          </motion.div>

          <motion.p variants={item} className="text-sm text-gray-500">
            Free 14-day trial · Cancel anytime
          </motion.p>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          whileHover={{ y: -8 }}
          className="relative"
        >
          <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Search methods</span>
              <span className="bg-emerald-400 text-xs px-3 py-1 rounded-full font-medium text-black">
                Live
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Qualitative Research
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              A clear, practical introduction to qualitative research design,
              data interpretation, and academic writing.
            </p>

            {/* Fake chart line */}
            <div className="h-24 bg-gray-50 rounded-xl flex items-end p-3 gap-2">
              {[40, 55, 30, 70, 50, 80].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-4 rounded bg-emerald-400"
                />
              ))}
            </div>

            {/* Students */}
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-200 border border-white" />
                <div className="w-8 h-8 rounded-full bg-emerald-300 border border-white" />
                <div className="w-8 h-8 rounded-full bg-emerald-400 border border-white" />
              </div>
              <span>+2k active learners</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

