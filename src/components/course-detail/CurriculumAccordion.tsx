import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Database, Globe, Bot, Share2, Mic, Code, Layers,
  Smartphone, Shield, Zap, BookOpen, Target, Rocket,
  Brain, Settings, Users, Star, Award, Lock, Sparkles
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
  early_bird_only?: boolean;
}

interface CurriculumAccordionProps {
  lessons: Lesson[];
  modules?: ModuleData[];
  isEnrolled?: boolean;
  /** True when the signed-in user has an active enrollment marked as Early Bird. */
  hasEarlyBirdEnrollment?: boolean;
  /** True when Early Bird pricing/slots are still available (marketing context). */
  isEarlyBirdOfferActive?: boolean;
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
  earlyBirdOnly: boolean;
}

const CurriculumAccordion = ({
  lessons,
  modules = [],
  isEnrolled = false,
  hasEarlyBirdEnrollment = false,
  isEarlyBirdOfferActive = false,
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
          earlyBirdOnly: !!moduleData.early_bird_only,
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
          earlyBirdOnly: !!moduleData?.early_bird_only,
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

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-xl md:text-2xl lg:text-[30px] font-bold mb-2 md:mb-3 text-foreground">
          Course Modules
        </h2>
        <p className="text-muted-foreground text-sm md:text-base px-2 md:px-0 max-w-2xl mx-auto">
          <span className="italic">Season 1</span> of {courseTitle} has{' '}
          <span className="font-semibold text-foreground">{groupedModules.length}</span> detailed modules designed to help you master the course content.
        </p>
      </motion.div>

      {/* Module Cards */}
      <div className="space-y-3 md:space-y-4 w-full px-4 md:px-0 md:w-[85%] lg:w-[75%] mx-auto">
        {groupedModules.map((module, moduleIndex) => {
          const moduleId = `module-${moduleIndex}`;
          const isExpanded = expandedModules.has(moduleId);
          const IconComponent = iconMap[module.icon] || Database;
          const hasLessons = module.lessons && module.lessons.length > 0;
          const isEarlyBirdModule = module.earlyBirdOnly;
          const lockedForUser = isEarlyBirdModule && isEnrolled && !hasEarlyBirdEnrollment;
          const ebUnlocked = isEarlyBirdModule && hasEarlyBirdEnrollment;
          /** No Early Bird entitlement: visitors + enrolled students who missed EB */
          const ebRestricted = isEarlyBirdModule && !hasEarlyBirdEnrollment;
          const visitorEbTeaser = isEarlyBirdModule && !isEnrolled;

          return (
            <motion.div
              key={moduleId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: moduleIndex * 0.05 }}
              className={`rounded-xl overflow-hidden shadow-sm ${
                ebRestricted
                  ? 'ring-2 ring-amber-500/35 shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_12px_40px_-12px_rgba(245,158,11,0.25)]'
                  : ''
              } ${ebUnlocked ? 'ring-2 ring-amber-400/45 shadow-amber-950/20' : ''}`}
            >
              {/* Module Card Header */}
              <button
                onClick={() => toggleModule(moduleId)}
                className={`relative w-full p-3.5 md:p-5 text-left flex items-start gap-3 md:gap-4 transition-all ${
                  ebRestricted
                    ? 'bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 border border-amber-600/25 hover:brightness-[1.03] shadow-inner'
                    : ebUnlocked
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:brightness-110 ring-1 ring-amber-400/30'
                      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:brightness-110'
                }`}
              >
                {ebRestricted && (
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-600"
                    aria-hidden
                  />
                )}
                {ebRestricted && (
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(251,191,36,0.12),transparent_55%)]"
                    aria-hidden
                  />
                )}

                {/* Module Icon Container */}
                <div
                  className={`relative z-[1] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    ebRestricted
                      ? 'border-amber-500/35 bg-black/35 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                      : 'bg-white/10 backdrop-blur-sm border-white/20'
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 md:w-6 md:h-6 ${ebRestricted ? 'text-white/75' : 'text-white'}`}
                  />
                  {ebRestricted && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-amber-500 text-indigo-950 shadow-md ring-2 ring-slate-950">
                      <Lock className="h-3 w-3" aria-hidden />
                    </span>
                  )}
                </div>

                {/* Module Info */}
                <div className="relative z-[1] flex-1 min-w-0 flex flex-col justify-center min-h-[40px] md:min-h-[48px]">
                  {ebRestricted && (
                    <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400/90 mb-1">
                      Early Bird vault · not in standard enrollment
                    </p>
                  )}
                  {ebUnlocked && (
                    <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/95 mb-1">
                      Included with your Early Bird access
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mb-0.5 md:mb-1">
                    <h3
                      className={`font-bold text-sm md:text-base leading-snug ${
                        ebRestricted ? 'text-white/95' : 'text-white'
                      }`}
                    >
                      {module.name}
                    </h3>
                    {isEarlyBirdModule && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full text-[10px] md:text-xs font-extrabold px-2 py-0.5 uppercase tracking-wide shadow-sm ${
                          ebRestricted
                            ? 'bg-amber-950/90 text-amber-300 ring-1 ring-amber-500/40'
                            : ebUnlocked
                              ? 'bg-emerald-500/90 text-white ring-1 ring-emerald-300/50'
                              : 'bg-amber-400/95 text-indigo-950'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 shrink-0" aria-hidden />
                        {ebRestricted ? 'Locked' : ebUnlocked ? 'Unlocked' : 'Early Bird'}
                      </span>
                    )}
                  </div>
                  {module.subtitle ? (
                    <p
                      className={`text-xs md:text-sm font-normal leading-snug line-clamp-2 md:line-clamp-none ${
                        ebRestricted ? 'text-amber-100/55' : 'text-white/80'
                      }`}
                    >
                      {module.subtitle}
                    </p>
                  ) : (
                    <p className="text-white/80 text-xs md:text-sm font-normal uppercase tracking-wide">
                      Module {moduleIndex + 1}
                    </p>
                  )}
                  {ebRestricted && (
                    <p className="mt-1.5 text-[11px] md:text-xs text-amber-200/70 leading-snug">
                      {visitorEbTeaser
                        ? isEarlyBirdOfferActive
                          ? 'Full lesson breakdown is withheld for Early Bird members — enroll before seats run out.'
                          : 'Full lesson breakdown was reserved for Early Bird enrollments only.'
                        : 'This bonus track was not part of your enrollment tier.'}
                    </p>
                  )}
                </div>

                {/* Expand Icon */}
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`relative z-[1] shrink-0 mt-0.5 md:mt-1 ${
                    ebRestricted ? 'text-amber-200/80' : 'text-white'
                  }`}
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              </button>

              {/* Expanded Content - White Background */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={`border-x border-b ${
                      ebRestricted
                        ? 'border-amber-200/60 bg-gradient-to-b from-amber-50/40 to-white dark:from-amber-950/25 dark:to-slate-900 dark:border-amber-900/40'
                        : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
                      {/* Module Description — visitor EB gets “preview” framing */}
                      {module.description && (
                        <div
                          className={`${
                            hasLessons && !lockedForUser && !(visitorEbTeaser)
                              ? 'mb-4 border-b border-gray-100 dark:border-slate-800 pb-4'
                              : lockedForUser || (visitorEbTeaser)
                                ? 'mb-4'
                                : ''
                          } ${visitorEbTeaser ? 'relative' : ''}`}
                        >
                          {visitorEbTeaser && (
                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                              <Lock className="h-3 w-3" aria-hidden />
                              Overview preview · lesson list withheld
                            </div>
                          )}
                          <div
                            className={
                              visitorEbTeaser
                                ? 'opacity-80 saturate-[0.85]'
                                : ''
                            }
                          >
                            {module.description.includes('•') ? (
                              <ul className="space-y-1">
                                {module.description.split('•').filter(Boolean).map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0" />
                                    <span className="text-muted-foreground text-xs md:text-sm font-normal leading-relaxed">
                                      {item.trim()}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground text-xs md:text-sm font-normal leading-relaxed">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Enrolled but not Early Bird — hard stop */}
                      {lockedForUser ? (
                        <div className="rounded-xl border-2 border-dashed border-amber-400/70 bg-gradient-to-br from-amber-50 to-orange-50/80 dark:from-amber-950/50 dark:to-slate-900/80 dark:border-amber-600/50 px-4 py-5 mb-3 md:mb-4 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 ring-4 ring-amber-200/50 dark:ring-amber-800/30">
                            <Lock className="h-6 w-6 text-amber-800 dark:text-amber-400" aria-hidden />
                          </div>
                          <p className="font-semibold text-amber-950 dark:text-amber-100 mb-1">
                            You don&apos;t have this track
                          </p>
                          <p className="text-sm text-amber-900/85 dark:text-amber-200/80 leading-relaxed max-w-md mx-auto">
                            This module was bundled only for Early Bird enrollments. Your current access includes the
                            standard curriculum — this bonus stays locked.
                            {!isEarlyBirdOfferActive && (
                              <span className="block mt-2 text-xs opacity-90">
                                Early Bird enrollment is closed; this tier is no longer sold.
                              </span>
                            )}
                          </p>
                        </div>
                      ) : visitorEbTeaser ? (
                        <div className="pb-3 md:pb-4">
                          <p className="text-center text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {isEarlyBirdOfferActive ? (
                              <>
                                {hasLessons ? (
                                  <>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                      {module.lessons.length} lessons
                                    </span>{' '}
                                    are reserved for Early Bird students. Enroll while spots last to unlock the full breakdown.
                                  </>
                                ) : (
                                  <>
                                    This module is reserved for Early Bird students. Enroll while spots last to unlock
                                    the full breakdown.
                                  </>
                                )}
                              </>
                            ) : (
                              'This extended module was only offered during Early Bird. Standard enrollment does not include it.'
                            )}
                          </p>
                        </div>
                      ) : (
                        hasLessons && (
                          <ul className="space-y-2 md:space-y-3 pb-3 md:pb-4">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <motion.li
                                key={lesson.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: lessonIndex * 0.05 }}
                                className="flex items-start gap-3 group/lesson"
                              >
                                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 md:mt-2 shrink-0 group-hover/lesson:scale-125 transition-transform" />
                                <span className="text-gray-700 dark:text-gray-300 font-normal text-sm md:text-base leading-snug group-hover/lesson:text-blue-600 dark:group-hover/lesson:text-blue-400 transition-colors">
                                  {lesson.title}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
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
          className="text-center pt-8"
        >
          <button
            onClick={onEnrollClick}
            className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-8 py-3.5 text-base font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1"
          >
            Enroll Now
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CurriculumAccordion;
