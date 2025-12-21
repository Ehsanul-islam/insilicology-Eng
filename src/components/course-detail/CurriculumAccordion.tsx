import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, PlayCircle, Lock, Clock, BookOpen, 
  CheckCircle2, Folder
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Lesson {
  id: string;
  title: string;
  duration_minutes?: number | null;
  is_preview?: boolean | null;
  video_url?: string | null;
  lesson_order?: number | null;
  description?: string | null;
}

interface CurriculumAccordionProps {
  lessons: Lesson[];
  isEnrolled?: boolean;
}

interface Module {
  name: string;
  lessons: Lesson[];
  totalDuration: number;
}

const CurriculumAccordion = ({ lessons, isEnrolled = false }: CurriculumAccordionProps) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['module-0']));
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null);

  // Group lessons by module (inferred from lesson title pattern like "Module 1: Title")
  const modules = useMemo(() => {
    const moduleMap = new Map<string, Lesson[]>();
    let currentModule = 'Module 1';
    let moduleIndex = 0;

    // Sort lessons by order first
    const sortedLessons = [...lessons].sort(
      (a, b) => (a.lesson_order || 0) - (b.lesson_order || 0)
    );

    sortedLessons.forEach((lesson) => {
      // Check if lesson title contains module info
      const moduleMatch = lesson.title.match(/^(Module\s*\d+|Week\s*\d+|Part\s*\d+|Chapter\s*\d+)[:.-]?\s*/i);
      
      if (moduleMatch) {
        currentModule = moduleMatch[1];
        if (!moduleMap.has(currentModule)) {
          moduleMap.set(currentModule, []);
        }
        // Remove module prefix from lesson title
        const cleanTitle = lesson.title.replace(moduleMatch[0], '').trim();
        moduleMap.get(currentModule)!.push({ ...lesson, title: cleanTitle || lesson.title });
      } else {
        // If no module pattern, group lessons in batches of 5-8
        const batchSize = 6;
        const currentBatch = Math.floor(moduleIndex / batchSize);
        const batchName = `Module ${currentBatch + 1}`;
        
        if (!moduleMap.has(batchName)) {
          moduleMap.set(batchName, []);
        }
        moduleMap.get(batchName)!.push(lesson);
        moduleIndex++;
      }
    });

    // If only one module with all lessons, try to split by count
    if (moduleMap.size === 1 && lessons.length > 6) {
      const allLessons = Array.from(moduleMap.values()).flat();
      moduleMap.clear();
      
      const lessonsPerModule = Math.ceil(allLessons.length / Math.ceil(allLessons.length / 6));
      allLessons.forEach((lesson, idx) => {
        const moduleNum = Math.floor(idx / lessonsPerModule) + 1;
        const moduleName = `Module ${moduleNum}`;
        if (!moduleMap.has(moduleName)) {
          moduleMap.set(moduleName, []);
        }
        moduleMap.get(moduleName)!.push(lesson);
      });
    }

    // Convert to array with calculated totals
    const result: Module[] = [];
    moduleMap.forEach((moduleLessons, name) => {
      const totalDuration = moduleLessons.reduce(
        (sum, l) => sum + (l.duration_minutes || 0), 0
      );
      result.push({ name, lessons: moduleLessons, totalDuration });
    });

    return result;
  }, [lessons]);

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
  const totalDuration = lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);
  const previewCount = lessons.filter(l => l.is_preview).length;

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?/]+)/
    );
    return match ? match[1] : null;
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Course Curriculum</h2>
                  <p className="text-white/70 text-sm mt-1">
                    {modules.length} modules • {totalLessons} lessons
                    {totalDuration > 0 && ` • ${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`}
                  </p>
                </div>
              </div>
              
              {previewCount > 0 && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  {previewCount} Free Preview{previewCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {/* Modules */}
          <div className="divide-y divide-border">
            {modules.map((module, moduleIndex) => {
              const moduleId = `module-${moduleIndex}`;
              const isExpanded = expandedModules.has(moduleId);

              return (
                <div key={moduleId} className="bg-card">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(moduleId)}
                    className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {moduleIndex + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{module.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {module.lessons.length} lessons
                          {module.totalDuration > 0 && ` • ${module.totalDuration} min`}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {/* Module Lessons */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => {
                            const canPlay = lesson.is_preview || isEnrolled;
                            const hasVideo = !!lesson.video_url;

                            return (
                              <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: lessonIndex * 0.03 }}
                                className={`flex items-center gap-4 p-4 rounded-xl border ${
                                  canPlay && hasVideo
                                    ? 'hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-200 dark:hover:border-purple-800 cursor-pointer'
                                    : ''
                                } transition-all`}
                                onClick={() => {
                                  if (canPlay && hasVideo && lesson.video_url) {
                                    setPreviewVideo({ url: lesson.video_url, title: lesson.title });
                                  }
                                }}
                              >
                                {/* Play/Lock Icon */}
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                  canPlay
                                    ? 'bg-purple-100 dark:bg-purple-900/50'
                                    : 'bg-muted'
                                }`}>
                                  {canPlay ? (
                                    <PlayCircle className={`w-5 h-5 ${
                                      hasVideo ? 'text-purple-600 dark:text-purple-400' : 'text-muted-foreground'
                                    }`} />
                                  ) : (
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>

                                {/* Lesson Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {String(lessonIndex + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-medium text-foreground truncate">
                                      {lesson.title}
                                    </span>
                                    {lesson.is_preview && !isEnrolled && (
                                      <Badge variant="outline" className="text-xs shrink-0 border-green-500 text-green-600">
                                        Free Preview
                                      </Badge>
                                    )}
                                  </div>
                                  {lesson.description && (
                                    <p className="text-sm text-muted-foreground truncate mt-1">
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>

                                {/* Duration */}
                                {lesson.duration_minutes && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                                    <Clock className="w-4 h-4" />
                                    <span>{lesson.duration_minutes} min</span>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Video Preview Modal */}
      <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          {previewVideo && (
            <div className="aspect-video bg-black">
              {getYouTubeId(previewVideo.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(previewVideo.url)}?autoplay=1&rel=0`}
                  title={previewVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={previewVideo.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CurriculumAccordion;

