import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronRight,
  Database, Globe, Bot, Share2, Mic, Code, Layers,
  Smartphone, Shield, Zap, BookOpen, Target, Rocket,
  Brain, Settings, Users, Star, Award
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  lesson_order?: number | null;
  description?: string | null;
}

interface ModuleData {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
}

interface CurriculumAccordionProps {
  lessons: Lesson[];
  modules?: ModuleData[];
  isEnrolled?: boolean;
  onEnrollClick?: () => void;
  courseTitle?: string;
}

// Icon mapping for modules
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  Globe,
  Bot,
  Share: Share2,
  Share2,
  Mic,
  Code,
  Layers,
  Smartphone,
  Shield,
  Zap,
  BookOpen,
  Target,
  Rocket,
  Brain,
  Settings,
  Users,
  Star,
  Award,
};

// Default icons to cycle through if not specified
const defaultIcons = ['Database', 'Globe', 'Bot', 'Share2', 'Mic', 'Code', 'Layers', 'Smartphone'];

interface GroupedModule {
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

const CurriculumAccordion = ({
  lessons,
  modules = [],
  isEnrolled = false,
  onEnrollClick,
  courseTitle = 'our course'
}: CurriculumAccordionProps) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Group lessons by module
  const groupedModules = useMemo(() => {
    const moduleMap = new Map<number, Lesson[]>();

    // Sort lessons by order first
    const sortedLessons = [...lessons].sort(
      (a, b) => (a.lesson_order || 0) - (b.lesson_order || 0)
    );

    // Try to parse module number from lesson title
    sortedLessons.forEach((lesson) => {
      const moduleMatch = lesson.title.match(/^(Module\s*(\d+)|Week\s*(\d+)|Part\s*(\d+)|Chapter\s*(\d+))[:.-]?\s*/i);

      if (moduleMatch) {
        const moduleNum = parseInt(moduleMatch[2] || moduleMatch[3] || moduleMatch[4] || moduleMatch[5] || '1');
        if (!moduleMap.has(moduleNum)) {
          moduleMap.set(moduleNum, []);
        }
        // Remove module prefix from lesson title
        const cleanTitle = lesson.title.replace(moduleMatch[0], '').trim();
        moduleMap.get(moduleNum)!.push({ ...lesson, title: cleanTitle || lesson.title });
      } else {
        // Default to module 1 if no pattern
        if (!moduleMap.has(1)) {
          moduleMap.set(1, []);
        }
        moduleMap.get(1)!.push(lesson);
      }
    });

    // If only one module with many lessons, split them
    if (moduleMap.size === 1 && lessons.length > 10) {
      const allLessons = Array.from(moduleMap.values()).flat();
      moduleMap.clear();

      const lessonsPerModule = Math.ceil(allLessons.length / Math.ceil(allLessons.length / 8));
      allLessons.forEach((lesson, idx) => {
        const moduleNum = Math.floor(idx / lessonsPerModule) + 1;
        if (!moduleMap.has(moduleNum)) {
          moduleMap.set(moduleNum, []);
        }
        moduleMap.get(moduleNum)!.push(lesson);
      });
    }

    // Build result with module metadata
    const result: GroupedModule[] = [];

    if (modules && modules.length > 0) {
      // If we have explicit modules metadata, respect that structure
      modules.forEach((moduleData, idx) => {
        const moduleNum = idx + 1;
        const moduleLessons = moduleMap.get(moduleNum) || [];

        result.push({
          name: moduleData.title || `Module ${moduleNum}`,
          subtitle: moduleData.subtitle || '',
          description: moduleData.description || '',
          icon: moduleData.icon || defaultIcons[idx % defaultIcons.length],
          lessons: moduleLessons,
        });
      });
    } else {
      // Fallback: Determine modules from found lessons
      const sortedModuleNums = Array.from(moduleMap.keys()).sort((a, b) => a - b);

      sortedModuleNums.forEach((moduleNum, idx) => {
        const moduleLessons = moduleMap.get(moduleNum)!;
        const moduleData = modules[idx] || modules[moduleNum - 1];

        result.push({
          name: moduleData?.title || `Module ${moduleNum}`,
          subtitle: moduleData?.subtitle || '',
          description: moduleData?.description || '',
          icon: moduleData?.icon || defaultIcons[idx % defaultIcons.length],
          lessons: moduleLessons,
        });
      });
    }

    return result;
  }, [lessons, modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const totalLessons = lessons.length;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-2xl lg:text-[30px] font-bold mb-3 text-foreground">
          Course Modules
        </h2>
        <p className="text-muted-foreground text-base">
          <span className="italic">Season 1</span> of {courseTitle} has{' '}
          <span className="font-semibold text-foreground">{groupedModules.length}</span> detailed modules designed to help you master the course content.
        </p>
      </motion.div>

      {/* Module Cards */}
      <div className="space-y-4">
        {groupedModules.map((module, moduleIndex) => {
          const moduleId = `module-${moduleIndex}`;
          const isExpanded = expandedModules.has(moduleId);
          const IconComponent = iconMap[module.icon] || Database;

          return (
            <motion.div
              key={moduleId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: moduleIndex * 0.05 }}
              className="rounded-2xl overflow-hidden"
            >
              {/* Module Card Header - Purple Gradient */}
              <button
                onClick={() => toggleModule(moduleId)}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-5 text-left transition-all hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600"
              >
                <div className="flex items-start gap-4">
                  {/* Module Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base">
                      Module {moduleIndex + 1}: {module.name}
                    </h3>
                    {module.subtitle && (
                      <p className="text-white/80 text-sm mt-0.5">
                        {module.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Expand Icon */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 mt-1"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                {/* Module Description - Below the main content */}
                {module.description && (
                  <p className="text-white/70 text-sm mt-3 pl-16">
                    {module.description}
                  </p>
                )}
              </button>

              {/* Expanded Lessons - Bullet List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white dark:bg-slate-900"
                  >
                    <ul className="py-5 px-6 space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <motion.li
                          key={lesson.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: lessonIndex * 0.02 }}
                          className="flex items-start gap-3"
                        >
                          {/* Blue Bullet Point */}
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />

                          {/* Lesson Title */}
                          <span className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {lesson.title}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      {onEnrollClick && !isEnrolled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-4"
        >
          <button
            onClick={onEnrollClick}
            className="vibe-cta-gradient text-white px-8 py-3.5 text-base font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300"
          >
            Enroll Now
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CurriculumAccordion;
