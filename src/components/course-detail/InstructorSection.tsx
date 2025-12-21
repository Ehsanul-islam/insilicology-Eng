import { motion } from 'framer-motion';
import { 
  Twitter, Linkedin, Github, Globe, Youtube, Instagram,
  Award, Star, Users, BookOpen, Quote
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  youtube?: string;
  instagram?: string;
}

interface InstructorSectionProps {
  name: string;
  title?: string;
  bio?: string;
  photo?: string;
  socialLinks?: SocialLinks;
  quote?: string;
  achievements?: string[];
  studentsCount?: number;
  coursesCount?: number;
  rating?: number;
}

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  youtube: Youtube,
  instagram: Instagram,
};

const InstructorSection = ({
  name,
  title,
  bio,
  photo,
  socialLinks,
  quote,
  achievements,
  studentsCount,
  coursesCount,
  rating,
}: InstructorSectionProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-6">
          <motion.h2 
            className="text-2xl font-bold text-white flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            👨‍🏫 Meet Your Instructor
          </motion.h2>
        </div>

        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Photo Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-shrink-0"
            >
              <div className="relative mx-auto lg:mx-0">
                {/* Gradient Border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl blur opacity-75" />
                
                {/* Photo Container */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900">
                  {photo ? (
                    <img
                      src={photo}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl font-bold text-purple-600/30 dark:text-purple-400/30">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Floating Badge */}
                {rating && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute -bottom-3 -right-3 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 shadow-lg flex items-center gap-1"
                  >
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">{rating}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Name & Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {name}
              </h3>
              {title && (
                <p className="text-lg text-purple-600 dark:text-purple-400 font-medium mb-4">
                  {title}
                </p>
              )}

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
                {studentsCount && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold">{studentsCount.toLocaleString()}</span>
                    <span className="text-muted-foreground">students</span>
                  </div>
                )}
                {coursesCount && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold">{coursesCount}</span>
                    <span className="text-muted-foreground">courses</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {bio && (
                <p className="text-foreground/80 leading-relaxed mb-6">
                  {bio}
                </p>
              )}

              {/* Achievements */}
              {achievements && achievements.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    {achievements.map((achievement, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-medium"
                      >
                        <Award className="w-3.5 h-3.5" />
                        {achievement}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {socialLinks && Object.keys(socialLinks).length > 0 && (
                <div className="flex justify-center lg:justify-start gap-3">
                  {Object.entries(socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIconMap[platform] || Globe;
                    
                    return (
                      <motion.a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-xl bg-muted hover:bg-purple-100 dark:hover:bg-purple-900/50 flex items-center justify-center transition-colors"
                      >
                        <Icon className="w-5 h-5 text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Quote Section */}
          {quote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-900/50"
            >
              <div className="flex gap-4">
                <Quote className="w-8 h-8 text-purple-400 shrink-0 rotate-180" />
                <blockquote className="text-lg italic text-foreground/80">
                  {quote}
                </blockquote>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorSection;

