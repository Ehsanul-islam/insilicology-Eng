/**
 * Shared constants for Course management
 * Used by both Admin and Instructor course editors
 */

import {
    GraduationCap,
    Briefcase,
    BookOpen,
    Laptop,
    Rocket,
    Code,
    Users,
    Star,
    HelpCircle,
    Database,
    Globe,
    Bot,
    Share2,
    Mic,
    Layers,
    Smartphone,
    Shield,
    Zap,
    Target,
    Brain,
    Settings,
    Award,
} from 'lucide-react';

// Icons for target audience cards
export const AVAILABLE_ICONS = [
    { value: 'GraduationCap', label: 'Graduation Cap', icon: GraduationCap },
    { value: 'Briefcase', label: 'Briefcase', icon: Briefcase },
    { value: 'BookOpen', label: 'Book', icon: BookOpen },
    { value: 'Laptop', label: 'Laptop', icon: Laptop },
    { value: 'Rocket', label: 'Rocket', icon: Rocket },
    { value: 'Code', label: 'Code', icon: Code },
    { value: 'Users', label: 'Users', icon: Users },
    { value: 'Star', label: 'Star', icon: Star },
    { value: 'HelpCircle', label: 'Help', icon: HelpCircle },
];

// Icons for module cards (matching CurriculumAccordion)
export const MODULE_ICONS = [
    { value: 'Database', label: 'Database', icon: Database },
    { value: 'Globe', label: 'Globe', icon: Globe },
    { value: 'Bot', label: 'Bot/AI', icon: Bot },
    { value: 'Share2', label: 'Share', icon: Share2 },
    { value: 'Mic', label: 'Microphone', icon: Mic },
    { value: 'Code', label: 'Code', icon: Code },
    { value: 'Layers', label: 'Layers', icon: Layers },
    { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
    { value: 'Shield', label: 'Shield', icon: Shield },
    { value: 'Zap', label: 'Zap', icon: Zap },
    { value: 'BookOpen', label: 'Book', icon: BookOpen },
    { value: 'Target', label: 'Target', icon: Target },
    { value: 'Rocket', label: 'Rocket', icon: Rocket },
    { value: 'Brain', label: 'Brain', icon: Brain },
    { value: 'Settings', label: 'Settings', icon: Settings },
    { value: 'Users', label: 'Users', icon: Users },
    { value: 'Star', label: 'Star', icon: Star },
    { value: 'Award', label: 'Award', icon: Award },
];

// Payment methods available for course enrollment
export const PAYMENT_METHODS = [
    { value: 'bkash', label: 'bKash' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Credit/Debit Card' },
];
