import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Star, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Testimonial {
  name: string;
  role?: string;
  video_url?: string;
  thumbnail?: string;
  image_url?: string;
  text?: string;
  rating?: number;
}

interface VideoTestimonialsProps {
  testimonials: Testimonial[];
}

const VideoTestimonials = ({ testimonials }: VideoTestimonialsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeMedia, setActiveMedia] = useState<{ type: 'video' | 'image'; url: string; name: string } | null>(null);

  if (!testimonials || testimonials.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?/]+)/
    );
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  return (
    <>
      <div className="space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl lg:text-[30px] font-bold mb-3 text-foreground">
            Student Reviews
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            These reviews are directly from our Facebook page. See what real students have said—no edits. You can visit our page to verify for yourself.
          </p>
        </motion.div>

        {/* Navigation Header */}
        {testimonials.length > 3 && (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full w-10 h-10 border-slate-200 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-pink-950/30 hover:border-pink-300 dark:hover:border-pink-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full w-10 h-10 border-slate-200 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-pink-950/30 hover:border-pink-300 dark:hover:border-pink-800"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Testimonials Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial, index) => {
            const hasVideo = !!testimonial.video_url;
            const hasImage = !!testimonial.image_url || !!testimonial.thumbnail;
            const thumbnail = testimonial.thumbnail || 
              testimonial.image_url ||
              (testimonial.video_url ? getYouTubeThumbnail(testimonial.video_url) : null);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex-shrink-0 w-[300px] snap-center"
              >
                <div className="h-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-xl hover:border-pink-200 dark:hover:border-pink-800 transition-all duration-300">
                  {/* Image/Video Thumbnail */}
                  {thumbnail && (
                    <div
                      className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-800"
                      onClick={() => {
                        if (hasVideo && testimonial.video_url) {
                          setActiveMedia({ type: 'video', url: testimonial.video_url, name: testimonial.name });
                        } else if (thumbnail) {
                          setActiveMedia({ type: 'image', url: thumbnail, name: testimonial.name });
                        }
                      }}
                    >
                      <img
                        src={thumbnail}
                        alt={`${testimonial.name}'s review`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Play Button for Videos */}
                      {hasVideo && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                        >
                          <div className="w-14 h-14 rounded-full bg-white/90 shadow-xl flex items-center justify-center group-hover:bg-white transition-colors">
                            <Play className="w-6 h-6 text-pink-600 ml-0.5" fill="currentColor" />
                          </div>
                        </motion.div>
                      )}

                      {/* Zoom Icon for Images */}
                      {!hasVideo && (
                        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Content */}
                  {(testimonial.text || testimonial.name) && (
                    <div className="p-4">
                      {/* Rating */}
                      {testimonial.rating && (
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating!
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Text */}
                      {testimonial.text && (
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3 line-clamp-3">
                          "{testimonial.text}"
                        </p>
                      )}

                      {/* Author */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                          {testimonial.role && (
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Media Modal */}
      <Dialog open={!!activeMedia} onOpenChange={() => setActiveMedia(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-0">
          {activeMedia && activeMedia.type === 'video' && (
            <div className="aspect-video">
              {getYouTubeId(activeMedia.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeMedia.url)}?autoplay=1&rel=0`}
                  title={`${activeMedia.name}'s testimonial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
          )}
          {activeMedia && activeMedia.type === 'image' && (
            <div className="relative max-h-[90vh] overflow-auto">
              <img
                src={activeMedia.url}
                alt={`${activeMedia.name}'s review`}
                className="w-full h-auto"
              />
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoTestimonials;
