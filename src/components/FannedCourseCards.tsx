import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUpcomingPrograms } from '@/hooks/useUpcomingPrograms';
import { useQuery } from '@tanstack/react-query';

// --- 1. STYLING & CONSTANTS ---
const GRADIENTS = [
  'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
  'linear-gradient(135deg, #111827 0%, #374151 100%)',
  'linear-gradient(135deg, #0f172a 0%, #2d1b69 100%)',
];
const ACCENTS = ['#38bdf8', '#facc15', '#c084fc'];

const TRANSFORMS = [
  { rotate: -14, x: -80, y: -15, zIndex: 1, scale: 0.88 }, // Back
  { rotate:  -4, x: -28, y:  12, zIndex: 2, scale: 0.94 }, // Middle
  { rotate:   7, x:  45, y:  -8, zIndex: 3, scale: 1.00 }, // Front
];

const VARIANTS = {
  front:   { opacity: 1, ...TRANSFORMS[2] },
  mid:     { opacity: 1, ...TRANSFORMS[1] },
  back:    { opacity: 1, ...TRANSFORMS[0] },
  leaving: { 
    opacity: 0, zIndex: 4, rotate: 25, x: 300, y: 50, scale: 1.1,
    transitionEnd: { x: -100, y: 80, rotate: -20, scale: 0.8, zIndex: 0 } 
  },
  hidden:  { opacity: 0, zIndex: 0, rotate: -20, x: -100, y: 80, scale: 0.8 },
};

// --- 2. FAST BLUR-UP IMAGE COMPONENT ---
function CardImage({ src, alt, gradient }: { src: string; alt: string; gradient: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div className="absolute inset-0 w-full h-full" style={{ background: gradient }} />
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
        }`}
      />
    </>
  );
}

// --- 3. MAIN HERO COMPONENT ---
export function FannedCourseCards() {
  const { fetchUpcomingPrograms } = useUpcomingPrograms();
  const navigate = useNavigate();

  // Elite UX: React Query with Fast Local Fallback
  const { data: fetchedCards, isLoading } = useQuery({
    queryKey: ['hero-cards'],
    queryFn: fetchUpcomingPrograms,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const cards = fetchedCards ?? [];
  const total = cards.length;
  
  // Carousel State
  const [offset, setOffset] = useState(0);

  // Rotate fan every 4.5 seconds ONLY if we have more than 3 cards
  useEffect(() => {
    if (total <= 3) return;
    const timer = setInterval(() => {
      setOffset((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [total]);
  
  if (isLoading) return null;

  const isReady = true;

  // Render placeholders if we lack sufficient static items
  const itemsToRender = total < 3 
    ? Array.from({ length: 3 }, (_, i) => ({ card: cards[i] ?? null, i }))
    : cards.map((c, i) => ({ card: c, i }));

  return (
    <div className="relative w-full h-[480px] flex items-center justify-center">
      {/* Ambient static glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 75% 65% at 55% 50%, rgba(124,58,237,0.18) 0%, transparent 80%)'
      }} />

      {itemsToRender.map(({ card, i }) => {
        const hasImage = !!card?.image_url;
        
        let pos = i;
        let animState = 'back';
        
        // --- 4. CAROUSEL POSITION MATH ---
        if (total < 4) {
          if (i === 0) { animState = 'back'; pos = 0; }
          else if (i === 1) { animState = 'mid'; pos = 1; }
          else if (i === 2) { animState = 'front'; pos = 2; }
        } else {
          pos = (i + offset) % total;
          if (pos === 0) animState = 'back';
          else if (pos === 1) animState = 'mid';
          else if (pos === 2) animState = 'front';
          else if (pos === 3) animState = 'leaving';
          else animState = 'hidden';
        }

        // Stagger first load; rotate flawlessly afterwards
        const entranceDelay = offset === 0 && pos < 3 ? 0.2 + pos * 0.18 : 0;

        return (
          <motion.div
            key={card?.id || i}
            variants={VARIANTS}
            initial="hidden"
            animate={animState}
            transition={{
              duration: 0.75,
              delay: entranceDelay,
              ease: [0.23, 1, 0.32, 1],
            }}
            whileHover={{
              y: VARIANTS[animState as keyof typeof VARIANTS]?.y! - 14,
              scale: VARIANTS[animState as keyof typeof VARIANTS]?.scale! * 1.04,
              zIndex: 10,
              transition: { duration: 0.25 },
            }}
            style={{ position: 'absolute' }}
            onClick={() => {
              if (hasImage && (card as any)?.registration_link) {
                const link = (card as any).registration_link;
                try {
                  const url = new URL(link);
                  if (url.hostname === window.location.hostname || url.hostname === 'www.insilicology.com') {
                    navigate(url.pathname);
                  } else { window.open(link, '_blank'); }
                } catch { navigate(link); }
              }
            }}
          >
            <div className="w-[390px] h-[240px] rounded-2xl overflow-hidden shadow-2xl relative cursor-pointer group"
              style={{
                background: hasImage ? 'transparent' : GRADIENTS[pos % 3],
                boxShadow: '0 24px 70px -12px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.07)',
              }}
            >
              {/* Blur-Up Background */}
              {hasImage && (
                <CardImage src={card!.image_url!} alt={card!.title} gradient={GRADIENTS[pos % 3]} />
              )}

              {/* Readability Scrim */}
              <div className="absolute inset-0" style={{
                background: hasImage
                  ? 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
              }} />

              {/* Text Layout */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                {!isReady ? (
                  <div className="h-6 w-20 rounded-full bg-white/20 animate-pulse self-start" />
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full self-start transition-all transform duration-500 scale-95 group-hover:scale-100"
                    style={{
                      background: `${ACCENTS[pos % 3]}28`,
                      color: ACCENTS[pos % 3],
                      border: `1px solid ${ACCENTS[pos % 3]}44`,
                    }}
                  >
                    {(card as any)?.subtitle ?? 'Program'}
                  </span>
                )}

                <div>
                  {!isReady ? (
                    <div className="space-y-2">
                      <div className="h-5 w-full bg-white/20 rounded animate-pulse" />
                      <div className="h-5 w-2/3 bg-white/20 rounded animate-pulse" />
                    </div>
                  ) : (
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md line-clamp-2">
                      {card?.title ?? ''}
                    </h3>
                  )}

                  {/* Expanding Accent Bar */}
                  <div className="mt-3 h-[3px] rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: ACCENTS[pos % 3] }}
                      initial={{ width: 0 }}
                      animate={{ width: isReady ? `${60 + pos * 12}%` : 0 }}
                      transition={{ delay: 0.9 + i * 0.18, duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default FannedCourseCards;
