import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  endDate: string;
  onExpire?: () => void;
  variant?: 'default' | 'compact' | 'hero';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const CountdownTimer = ({ endDate, onExpire, variant = 'default' }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        onExpire?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-red-500 font-semibold"
      >
        <AlertTriangle className="w-5 h-5" />
        <span>Offer Expired</span>
      </motion.div>
    );
  }

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-yellow-500" />
        <span className="font-mono font-semibold">
          {String(timeLeft.days).padStart(2, '0')}d{' '}
          {String(timeLeft.hours).padStart(2, '0')}h{' '}
          {String(timeLeft.minutes).padStart(2, '0')}m{' '}
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    );
  }

  // Hero variant with larger display
  if (variant === 'hero') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-yellow-300">
          <Clock className="w-4 h-4" />
          <span>Limited Time Offer Ends In</span>
        </div>
        <div className="flex gap-3">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Mins' },
            { value: timeLeft.seconds, label: 'Secs' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-2xl font-bold font-mono text-white"
                  >
                    {String(item.value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-xs text-white/70 mt-1">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-white/80">
        <Clock className="w-4 h-4 animate-pulse" />
        <span>Offer ends in</span>
      </div>
      <div className="flex gap-2">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Min' },
          { value: timeLeft.seconds, label: 'Sec' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <AnimatePresence mode="wait">
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold font-mono text-white"
                >
                  {String(item.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-xs text-white/60 mt-1">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;

