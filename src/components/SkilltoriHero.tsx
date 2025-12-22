import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SkilltoriHero = () => {
    // Animated words that cycle through
    const animatedWords = [
        'সাফল্যে',      // success
        'স্বপ্নে',      // dreams
        'অর্জনে',      // achievements
        'আস্থায়'       // trust
    ];

    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % animatedWords.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'শুভ সকাল';      // Good morning
        if (hour < 17) return 'শুভ বিকাল';    // Good afternoon
        return 'শুভ সন্ধ্যা';                  // Good evening
    };

    return (
        <section className="relative min-h-screen flex items-center py-20 overflow-hidden bg-[#F9FAFB]">
            {/* Background Blobs with Animation */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Mint Green - Bottom Left */}
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-[100px] opacity-40"
                />

                {/* Soft Yellow - Bottom Center */}
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[-15%] left-[35%] w-[600px] h-[600px] bg-gradient-to-r from-yellow-100 to-amber-200 rounded-full blur-[120px] opacity-30"
                />

                {/* Pale Pink/Purple - Top Left */}
                <motion.div
                    animate={{
                        x: [0, 20, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-[110px] opacity-35"
                />

                {/* Pale Purple - Top Right */}
                <motion.div
                    animate={{
                        x: [0, -25, 0],
                        y: [0, -35, 0],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-r from-purple-200 to-violet-200 rounded-full blur-[100px] opacity-30"
                />
            </div>

            <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                <div className="grid gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Time-based Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
                        >
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                                {getGreeting()}
                            </span>
                        </motion.div>

                        {/* Main Heading with Animated Word */}
                        <div>
                            <h1
                                className="text-5xl md:text-6xl font-bold leading-tight text-gray-900"
                                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                            >
                                আপনার{' '}
                                <span className="inline-flex items-center relative align-bottom min-w-[180px]" style={{ height: '1.2em' }}>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={currentWordIndex}
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -30, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="absolute left-0 top-0 text-[#7C3AED]"
                                        >
                                            {animatedWords[currentWordIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                {' '} সঙ্গী{' '}
                                <span className="inline-flex items-center gap-1">
                                    skillt
                                    <span className="inline-flex items-center justify-center w-[0.85em] h-[0.85em] bg-[#7C3AED] rounded-full">
                                        <PlayCircle className="w-[0.5em] h-[0.5em] text-white fill-white" />
                                    </span>
                                    ri
                                </span>
                            </h1>
                        </div>

                        {/* Subheading */}
                        <p
                            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl"
                            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                            স্কিল শেখা এখন আরও সহজ। ছোট ছোট লেসনে শিখুন কাজে লাগার মতো স্কিল — জব হোক বা ফ্রিল্যান্সিং, আপনি তৈরি তো?
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button
                                size="lg"
                                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                            >
                                রিসার্চ ওয়ার্কশপ
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/80 backdrop-blur-sm border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 font-semibold px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                            >
                                একাউন্ট খুলুন
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SkilltoriHero;
