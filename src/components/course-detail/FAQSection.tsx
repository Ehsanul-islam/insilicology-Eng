import { motion } from 'framer-motion';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 text-white">
          <motion.h2 
            className="text-2xl font-bold flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HelpCircle className="w-6 h-6" />
            Frequently Asked Questions
          </motion.h2>
          <p className="text-white/70 mt-1">
            Got questions? We've got answers!
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`faq-${index}`}
                  className="border rounded-xl px-6 overflow-hidden data-[state=open]:bg-purple-50 dark:data-[state=open]:bg-purple-950/30 data-[state=open]:border-purple-200 dark:data-[state=open]:border-purple-800 transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline py-5 [&[data-state=open]>svg]:rotate-45 [&>svg]:hidden group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 group-data-[state=open]:bg-purple-500 transition-colors">
                        <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400 group-data-[state=open]:text-white group-data-[state=open]:rotate-45 transition-all" />
                      </div>
                      <span className="font-semibold text-foreground group-data-[state=open]:text-purple-700 dark:group-data-[state=open]:text-purple-300">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-12">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-foreground/80 leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="p-6 pt-0">
          <div className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-800 text-center">
            <p className="text-muted-foreground">
              Still have questions?{' '}
              <a 
                href="/contact" 
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Contact us
              </a>
              {' '}and we'll help you out!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FAQSection;

