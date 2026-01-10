import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseDescriptionProps {
  title: string;
  description: string;
  maxLength?: number;
  onEnrollClick?: () => void;
  showCta?: boolean;
}

const CourseDescription = ({
  title,
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
          <h3 key={pIndex} className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-4 first:mt-0">
            {paragraph.replace('## ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h4 key={pIndex} className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-5 mb-3">
            {paragraph.replace('### ', '')}
          </h4>
        );
      }

      // Check if it's a horizontal line
      if (paragraph.trim() === '---' || paragraph.trim().match(/^-{3,}$/)) {
        return (
          <hr key={pIndex} className="my-6 border-t-2 border-slate-300 dark:border-slate-700" />
        );
      }

      // Check if it's a list
      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(item => item.startsWith('- '));
        return (
          <ul key={pIndex} className="my-4 space-y-3">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-purple-600 mt-2 shrink-0" />
                <span className="leading-relaxed">{renderInlineFormatting(item.replace('- ', ''))}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Handle single newlines as line breaks
      const lines = paragraph.split('\n');

      return (
        <p key={pIndex} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 last:mb-0">
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

  // Handle inline formatting like **bold**, [link](url), and [text]{color}
  const renderInlineFormatting = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let currentIndex = 0;

    // Combined regex to match bold, links, and colored text
    const combinedRegex = /(\*\*.*?\*\*)|(\[([^\]]+)\]\(([^)]+)\))|(\[([^\]]+)\]\{([^}]+)\})/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }

      if (match[1]) {
        // Bold: **text**
        const boldText = match[1].slice(2, -2);
        parts.push(
          <strong key={`bold-${match.index}`} className="font-semibold text-purple-600 dark:text-purple-400">
            {boldText}
          </strong>
        );
      } else if (match[2]) {
        // Link: [text](url)
        const linkText = match[3];
        const linkUrl = match[4];
        parts.push(
          <a
            key={`link-${match.index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {linkText}
          </a>
        );
      } else if (match[5]) {
        // Custom color: [text]{color}
        const colorText = match[6];
        const color = match[7];
        parts.push(
          <span key={`color-${match.index}`} style={{ color: color, fontWeight: 500 }}>
            {colorText}
          </span>
        );
      }

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Premium Gradient Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Icon */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-300" />
              </div>

              {/* Title */}
              <h2 className="text-xl lg:text-2xl font-bold text-white truncate">
                {title}
              </h2>
            </div>

            {/* Expand/Collapse Button (in header) */}
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label={isExpanded ? 'Show less' : 'Show more'}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-white" />
                </motion.div>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          <div className="px-6 lg:px-8 py-6 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isExpanded ? 'expanded' : 'collapsed'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="prose prose-slate dark:prose-invert max-w-none"
              >
                {renderFormattedText(displayText)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fade overlay when collapsed */}
          {needsTruncation && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Read Full button at bottom */}
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'Read Full Description'}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>
        )}
      </motion.div>

      {/* CTA Button - Centered below card */}
      {showCta && onEnrollClick && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <Button
            onClick={onEnrollClick}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-12 py-6 text-lg font-bold rounded-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
          >
            Enroll Now
          </Button>
        </motion.div>
      )}
    </section>
  );
};

export default CourseDescription;
