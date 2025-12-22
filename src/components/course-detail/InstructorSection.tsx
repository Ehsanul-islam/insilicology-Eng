import { motion } from 'framer-motion';
import { 
  Twitter, Linkedin, Github, Globe, Youtube, Instagram,
  Award, Star, Briefcase
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  achievements,
}: InstructorSectionProps) => {
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
          Meet Your Instructor
        </h2>
        <p className="text-muted-foreground text-base">
          Learn from an expert who brings real-world experience
        </p>
      </motion.div>

      {/* Instructor Card - Centered Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
          {/* Top Section with Photo */}
          <div className="relative pt-12 pb-8 px-6 text-center">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-purple-50 to-transparent dark:from-pink-950/20 dark:via-purple-950/20 dark:to-transparent" />
            
            {/* Photo Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
              className="relative mx-auto mb-6"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-xl opacity-30" />
              
              {/* Photo */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl mx-auto">
                {photo ? (
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Name */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative text-2xl font-bold text-foreground mb-2"
            >
              {name}
            </motion.h3>

            {/* Title & Role Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="relative flex flex-wrap justify-center gap-2 mb-4"
            >
              {title && (
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300 border-0 px-4 py-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                  {title}
                </Badge>
              )}
              <Badge 
                variant="secondary"
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0 px-4 py-1.5"
              >
                Automation Expert
              </Badge>
            </motion.div>

            {/* Bio */}
            {bio && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative text-muted-foreground leading-relaxed max-w-md mx-auto"
              >
                {bio}
              </motion.p>
            )}
          </div>

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="px-6 pb-6"
            >
              <div className="flex flex-wrap justify-center gap-2">
                {achievements.map((achievement, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-medium border border-amber-200 dark:border-amber-800"
                  >
                    <Award className="w-3.5 h-3.5" />
                    {achievement}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Social Links */}
          {socialLinks && Object.keys(socialLinks).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="px-6 pb-8 flex justify-center gap-3"
            >
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
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400" />
                  </motion.a>
                );
              })}
            </motion.div>
          )}

          {/* Footer CTA */}
          <div className="px-6 py-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-t border-slate-100 dark:border-slate-800">
            <p className="text-center text-sm text-muted-foreground">
              Join {name}'s course to master automation
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructorSection;
