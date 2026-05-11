import {
  Atom,
  Cpu,
  Database,
  Dna,
  FlaskConical,
  Layers,
  Microscope,
  Network,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Map a stable string name (stored in DB) to a Lucide icon component.
// To add new icons, register them here and they become selectable in the
// admin editor automatically.
export const researchIconRegistry: Record<string, LucideIcon> = {
  Atom,
  Cpu,
  Database,
  Dna,
  FlaskConical,
  Layers,
  Microscope,
  Network,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Zap,
};

export const researchIconNames = Object.keys(researchIconRegistry);

export const getResearchIcon = (name?: string | null): LucideIcon => {
  if (name && researchIconRegistry[name]) return researchIconRegistry[name];
  return Atom;
};
