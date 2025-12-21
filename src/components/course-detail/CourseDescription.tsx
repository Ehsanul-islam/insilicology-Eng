import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      // Handle single newlines as line breaks
      const lines = paragraph.split('\n');
      
      return (
        <p key={pIndex} className="text-foreground/80 leading-relaxed mb-4 last:mb-0">
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
    <Card className="overflow-hidden">
      <CardContent className="p-8">
        <motion.h2 
          className="text-2xl font-bold mb-6 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📚 About This Course
        </motion.h2>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={isExpanded ? 'expanded' : 'collapsed'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderFormattedText(displayText)}
            </motion.div>
          </AnimatePresence>
        </div>

        {needsTruncation && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 mt-4 text-primary font-medium hover:text-primary/80 transition-colors group"
            whileHover={{ x: 5 }}
          >
            {isExpanded ? (
              <>
                <span>Read Less</span>
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              </>
            ) : (
              <>
                <span>Read More</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </>
            )}
          </motion.button>
        )}

        {showCta && onEnrollClick && (
          <motion.div
            className="mt-8 pt-6 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={onEnrollClick}
              variant="outline"
              className="group border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950"
            >
              <span>Start Learning Today</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseDescription;

