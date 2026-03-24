import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUpcomingPrograms, UpcomingProgram } from '@/hooks/useUpcomingPrograms';

// Fallback gradients when no image is uploaded yet
const fallbackGradients = [
    'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0e4d7b 100%)',
    'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)',
    'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2d1b69 100%)',
];

const fallbackAccents = ['#38bdf8', '#facc15', '#c084fc'];

// Fan transforms: back → middle → front
const cardTransforms = [
    { rotate: -14, x: -80, y: -15, zIndex: 1, scale: 0.88 },
    { rotate: -4,  x: -28, y:  12, zIndex: 2, scale: 0.94 },
    {  rotate: 7,  x:  45, y:  -8, zIndex: 3, scale: 1    },
];

const FannedCourseCards = () => {
    const { fetchUpcomingPrograms } = useUpcomingPrograms();
    const [programs, setPrograms] = useState<UpcomingProgram[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        fetchUpcomingPrograms().then((data) => {
            // Take only the first 3 published programs (ordered by display_order)
            setPrograms(data.slice(0, 3));
            setReady(true);
        });
    }, []);

    // Always render 3 slots — fill with placeholders if data not loaded yet
    const slots = Array.from({ length: 3 }, (_, i) => programs[i] ?? null);

    return (
        <div className="relative w-full h-[440px] flex items-center justify-center select-none">
            {/* Ambient glow behind cards */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 75% 65% at 55% 50%, rgba(124,58,237,0.22) 0%, transparent 80%)',
                }}
            />

            {slots.map((program, index) => {
                const t = cardTransforms[index];
                const hasImage = !!program?.image_url;
                const accent = fallbackAccents[index];
                const fallbackGradient = fallbackGradients[index];

                return (
                    <motion.div
                        key={index}
                        // Entrance animation: each card flies in from below, staggered
                        initial={{ opacity: 0, y: 80, rotate: t.rotate, scale: t.scale * 0.85 }}
                        animate={
                            ready
                                ? { opacity: 1, y: t.y, rotate: t.rotate, scale: t.scale }
                                : { opacity: 0, y: 80, rotate: t.rotate, scale: t.scale * 0.85 }
                        }
                        transition={{
                            duration: 0.75,
                            delay: 0.2 + index * 0.18,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        whileHover={{
                            y: t.y - 14,
                            scale: t.scale * 1.04,
                            zIndex: 10,
                            transition: { duration: 0.25 },
                        }}
                        style={{
                            position: 'absolute',
                            zIndex: t.zIndex,
                            x: t.x,
                        }}
                        className="cursor-pointer"
                    >
                        {/* Card */}
                        <div
                            className="w-[390px] h-[240px] rounded-2xl overflow-hidden shadow-2xl relative"
                            style={{
                                background: hasImage ? 'transparent' : fallbackGradient,
                                boxShadow: `0 24px 70px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)`,
                            }}
                        >
                            {/* Background image (if available) */}
                            {hasImage && (
                                <img
                                    src={program!.image_url!}
                                    alt={program!.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )}

                            {/* Dark scrim over image so text is readable */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: hasImage
                                        ? 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.08) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)',
                                }}
                            />

                            {/* Accent blob (only for gradient cards) */}
                            {!hasImage && (
                                <>
                                    <div
                                        className="absolute top-[-24px] right-[-24px] w-40 h-40 rounded-full opacity-20 blur-2xl"
                                        style={{ background: accent }}
                                    />
                                    <div
                                        className="absolute bottom-[-18px] left-[-18px] w-28 h-28 rounded-full opacity-15 blur-xl"
                                        style={{ background: accent }}
                                    />
                                </>
                            )}

                            {/* Content */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                                {/* Top row */}
                                <div className="flex items-start justify-between">
                                    {program ? (
                                        <span
                                            className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm"
                                            style={{
                                                background: `${accent}28`,
                                                color: accent,
                                                border: `1px solid ${accent}44`,
                                            }}
                                        >
                                            Program
                                        </span>
                                    ) : (
                                        <div className="h-5 w-20 rounded-full bg-white/10 animate-pulse" />
                                    )}
                                </div>

                                {/* Bottom text */}
                                <div>
                                    {program ? (
                                        <>
                                            <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
                                                {program.title}
                                            </h3>
                                            {/* Thin accent line */}
                                            <div className="mt-3 h-[3px] rounded-full bg-white/10 overflow-hidden w-full">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ background: accent }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: ready ? `${60 + index * 12}%` : 0 }}
                                                    transition={{
                                                        delay: 0.9 + index * 0.18,
                                                        duration: 0.9,
                                                        ease: 'easeOut',
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-5 w-48 rounded bg-white/10 animate-pulse mb-2" />
                                            <div className="h-3 w-32 rounded bg-white/10 animate-pulse" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default FannedCourseCards;
