import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseDescriptionProps {
  description: string;
  maxLength?: number;
  onEnrollClick?: () => void;
  showCta?: boolean;
}

const CourseDescription = ({
  description,
  maxLength = 500,
  onEnrollClick,
  showCta = true,
}: CourseDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { needsTruncation, displayText } = useMemo(() => {
    const trimmedDescription = description.trim();
    const needsTruncation = trimmedDescription.length > maxLength;
    
    if (!needsTruncation || isExpanded) {
      return { needsTruncation, displayText: trimmedDescription };
    }

    // Find a good breakpoint near maxLength (end of sentence or word)
    let breakpoint = maxLength;
    const periodIndex = trimmedDescription.lastIndexOf('.', maxLength);
    const spaceIndex = trimmedDescription.lastIndexOf(' ', maxLength);
    
    if (periodIndex > maxLength * 0.7) {
      breakpoint = periodIndex + 1;
    } else if (spaceIndex > 0) {
      breakpoint = spaceIndex;
    }

    return {
      needsTruncation,
      displayText: trimmedDescription.slice(0, breakpoint) + '...',
    };
  }, [description, maxLength, isExpanded]);

  // Parse description for basic markdown/formatting
  const renderFormattedText = (text: string) => {
    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/);

    return paragraphs.map((paragraph, pIndex) => {
      // Check if it's a heading (starts with #)
      if (paragraph.startsWith('## ')) {
        return (
          <h3 key={pIndex} className="text-lg font-bold text-foreground mt-5 mb-2.5 first:mt-0">
            {paragraph.replace('## ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h4 key={pIndex} className="text-base font-semibold text-foreground mt-3 mb-2">
            {paragraph.replace('### ', '')}
          </h4>
        );
      }

      // Check if it's a list
      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(item => item.startsWith('- '));
        return (
          <ul key={pIndex} className="my-4 space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-foreground/80 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{renderInlineFormatting(item.replace('- ', ''))}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Handle single newlines as line breaks
      const lines = paragraph.split('\n');
      
      return (
        <p key={pIndex} className="text-foreground/80 leading-relaxed mb-3 last:mb-0 text-[15px]">
          {lines.map((line, lIndex) => (
            <span key={lIndex}>
              {lIndex > 0 && <br />}
              {renderInlineFormatting(line)}
            </span>
          ))}
        </p>
      );
    });
  };

  // Handle inline formatting like **bold**, *italic*, and emojis
  const renderInlineFormatting = (text: string) => {
    // Handle bold text (**text**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-foreground">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="relative">
      {/* Decorative Gradient Line */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500 rounded-full" />
      
      <div className="ml-6 lg:ml-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Course Details
            </h2>
          </div>
          <p className="text-muted-foreground">
            Everything you need to know about this program
          </p>
        </motion.div>

        {/* Expandable Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
        >
          {/* Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isExpanded ? 'expanded' : 'collapsed'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="prose prose-slate dark:prose-invert max-w-none"
              >
                {renderFormattedText(displayText)}
              </motion.div>
            </AnimatePresence>

            {/* Fade Overlay when collapsed */}
            {needsTruncation && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
            )}
          </div>

          {/* Expand/Collapse Button */}
          {needsTruncation && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-foreground font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              whileTap={{ scale: 0.99 }}
            >
              <span>{isExpanded ? 'Show Less' : 'Read Full Description'}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.button>
          )}
        </motion.div>

        {/* CTA Button */}
        {showCta && onEnrollClick && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 flex justify-center lg:justify-start"
          >
            <Button
              onClick={onEnrollClick}
              className="vibe-cta-gradient text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 group"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseDescription;
