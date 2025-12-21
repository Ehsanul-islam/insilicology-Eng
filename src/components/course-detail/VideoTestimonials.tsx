import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Star, Quote, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Testimonial {
  name: string;
  role?: string;
  video_url?: string;
  thumbnail?: string;
  text?: string;
  rating?: number;
}

interface VideoTestimonialsProps {
  testimonials: Testimonial[];
}

const VideoTestimonials = ({ testimonials }: VideoTestimonialsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<{ url: string; name: string } | null>(null);

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              ⭐ What Our Students Say
            </h2>
            <p className="text-muted-foreground mt-1">
              Hear from our successful students
            </p>
          </motion.div>

          {/* Navigation Buttons */}
          {testimonials.length > 3 && (
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Testimonials Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial, index) => {
            const hasVideo = !!testimonial.video_url;
            const thumbnail = testimonial.thumbnail || 
              (testimonial.video_url ? getYouTubeThumbnail(testimonial.video_url) : null);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[320px] snap-center"
              >
                <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800">
                  {/* Video Thumbnail / Play Button */}
                  {hasVideo && (
                    <div
                      className="relative aspect-video cursor-pointer overflow-hidden bg-slate-900"
                      onClick={() => {
                        if (testimonial.video_url) {
                          setActiveVideo({ url: testimonial.video_url, name: testimonial.name });
                        }
                      }}
                    >
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt={`${testimonial.name}'s testimonial`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                      
                      {/* Play Button */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/90 shadow-xl flex items-center justify-center group-hover:bg-white transition-colors">
                          <Play className="w-7 h-7 text-purple-600 ml-1" fill="currentColor" />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  <CardContent className="p-5">
                    {/* Rating */}
                    {testimonial.rating && (
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating!
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Text Testimonial */}
                    {testimonial.text && (
                      <div className="relative mb-4">
                        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-purple-200 dark:text-purple-800 rotate-180" />
                        <p className="text-sm text-foreground/80 leading-relaxed pl-5 line-clamp-4">
                          {testimonial.text}
                        </p>
                      </div>
                    )}

                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      {/* Avatar Placeholder */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        {testimonial.role && (
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-2 md:hidden">
          {testimonials.slice(0, 5).map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-purple-500 transition-colors"
              onClick={() => {
                if (scrollContainerRef.current) {
                  const cardWidth = 320 + 24; // card width + gap
                  scrollContainerRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth',
                  });
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black">
          {activeVideo && (
            <div className="aspect-video">
              {getYouTubeId(activeVideo.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=1&rel=0`}
                  title={`${activeVideo.name}'s testimonial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={activeVideo.url}
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

export default VideoTestimonials;

