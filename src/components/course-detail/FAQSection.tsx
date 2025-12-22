import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
        <h2 className="text-2xl lg:text-[30px] font-bold mb-3 text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Answers to questions you might have about the course
        </p>
      </motion.div>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full flex items-center gap-4 p-5 text-left transition-colors ${
                  isOpen 
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
              >
                {/* Number Badge */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold transition-colors ${
                  isOpen 
                    ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground'
                }`}>
                  {index + 1}
                </div>

                {/* Question Text */}
                <h3 className={`flex-1 font-semibold transition-colors ${
                  isOpen ? 'text-foreground' : 'text-foreground/80'
                }`}>
                  {faq.question}
                </h3>

                {/* Expand Icon */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className={`w-5 h-5 transition-colors ${
                    isOpen ? 'text-pink-500' : 'text-muted-foreground'
                  }`} />
                </motion.div>
              </button>

              {/* Answer Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 pl-[4.5rem]">
                      <p className="text-foreground/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;
