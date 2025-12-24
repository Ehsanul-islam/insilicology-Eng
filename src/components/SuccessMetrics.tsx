import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Briefcase, Users, DollarSign } from 'lucide-react';

// Animated Counter Hook
const useCounter = (end: number, duration: number = 2000, startCounting: boolean = false) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!startCounting) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, startCounting]);

    return count;
};

const SuccessMetrics = () => {
    const [startCounting, setStartCounting] = useState(false);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            setStartCounting(true);
        }
    }, [isInView]);

    // Animated counters
    const placementCount = useCounter(94, 2000, startCounting);
    const partnersCount = useCounter(500, 2000, startCounting);
    const switchesCount = useCounter(2500, 2000, startCounting);
    const salaryCount = useCounter(85, 2000, startCounting);

    // Data sets with labels
    const placementTrend = [
        { year: '2021', value: 88, label: '88%' },
        { year: '2022', value: 91, label: '91%' },
        { year: '2023', value: 92, label: '92%' },
        { year: '2024', value: 94, label: '94%' },
    ];

    const partnersData = [
        { year: '2021', value: 150, label: '150' },
        { year: '2022', value: 300, label: '300' },
        { year: '2023', value: 420, label: '420' },
        { year: '2024', value: 500, label: '500' },
    ];

    const switchesData = [
        { year: '2021', value: 500, label: '500' },
        { year: '2022', value: 1200, label: '1.2k' },
        { year: '2023', value: 1900, label: '1.9k' },
        { year: '2024', value: 2500, label: '2.5k' },
    ];

    const salaryData = [
        { name: 'Before', value: 45, label: '$45k' },
        { name: 'After', value: 85, label: '$85k' },
    ];

    const CustomTooltip = ({ active, payload, label, color }: any) => {
        if (active && payload && payload.length) {
            return (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/95 backdrop-blur-xl p-3 border-2 border-white shadow-2xl rounded-xl text-sm font-bold"
                >
                    <p className="text-gray-600 mb-1">{label}</p>
                    <p style={{ color }} className="text-lg">{payload[0].payload.label}</p>
                </motion.div>
            );
        }
        return null;
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    return (
        <section ref={sectionRef} className="py-20 bg-gradient-to-b from-secondary/30 via-background to-secondary/20 font-siliguri overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.03, 0.05, 0.03],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.03, 0.06, 0.03],
                        x: [0, -50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-48 -right-48 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"
                />
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block mb-4"
                        >
                            <div className="px-4 py-2 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border border-green-500/20 rounded-full backdrop-blur-sm">
                                <p className="text-sm font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    📊 DATA-DRIVEN SUCCESS
                                </p>
                            </div>
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                            Our Success Parameters
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Consistently delivering results that matter
                        </p>
                    </motion.div>
                </div>

                {/* Enhanced Card Grid - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

                    {/* Card 1: Placement Rate - Enhanced with Glassmorphism */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-[320px] md:h-[340px] flex flex-col border-t-4 border-t-green-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 relative overflow-hidden group">
                            {/* Animated shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                style={{ backgroundSize: '200% 100%' }}
                            />

                            {/* Glassmorphism overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle className="text-sm md:text-base flex items-center gap-2 text-muted-foreground font-medium">
                                        <motion.div
                                            className="p-2 bg-green-500/10 rounded-lg"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        </motion.div>
                                        <span className="hidden sm:inline">Placement Rate</span>
                                        <span className="sm:hidden">Placement</span>
                                    </CardTitle>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full backdrop-blur-sm"
                                    >
                                        <span className="text-xs font-bold text-green-600">↑ 6%</span>
                                    </motion.div>
                                </div>
                                <motion.div
                                    className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                                    key={placementCount}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {placementCount}%
                                </motion.div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={placementTrend}>
                                        <defs>
                                            <linearGradient id="lineGreen" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                        <Tooltip content={<CustomTooltip color="#10b981" />} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="url(#lineGreen)"
                                            strokeWidth={3}
                                            dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                                            activeDot={{ r: 7, strokeWidth: 3 }}
                                            animationDuration={1500}
                                            animationBegin={200}
                                        >
                                            <LabelList dataKey="label" position="top" style={{ fontSize: '10px', fill: '#059669', fontWeight: 'bold' }} />
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Card 2: Hiring Partners */}
                    <motion.div
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-[320px] md:h-[340px] flex flex-col border-t-4 border-t-blue-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle className="text-sm md:text-base flex items-center gap-2 text-muted-foreground font-medium">
                                        <motion.div
                                            className="p-2 bg-blue-500/10 rounded-lg"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Briefcase className="w-4 h-4 text-blue-600" />
                                        </motion.div>
                                        <span className="hidden sm:inline">Hiring Partners</span>
                                        <span className="sm:hidden">Partners</span>
                                    </CardTitle>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                        className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm"
                                    >
                                        <span className="text-xs font-bold text-blue-600">↑ 19%</span>
                                    </motion.div>
                                </div>
                                <motion.div
                                    className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                                    key={partnersCount}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {partnersCount}+
                                </motion.div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={partnersData}>
                                        <defs>
                                            <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#1d4ed8" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                        <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} content={<CustomTooltip color="#3b82f6" />} />
                                        <Bar
                                            dataKey="value"
                                            fill="url(#barBlue)"
                                            radius={[8, 8, 0, 0]}
                                            barSize={30}
                                            animationDuration={1500}
                                            animationBegin={300}
                                        >
                                            <LabelList dataKey="label" position="top" style={{ fontSize: '10px', fill: '#1d4ed8', fontWeight: 'bold' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Card 3: Career Switches */}
                    <motion.div
                        custom={2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-[320px] md:h-[340px] flex flex-col border-t-4 border-t-purple-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle className="text-sm md:text-base flex items-center gap-2 text-muted-foreground font-medium">
                                        <motion.div
                                            className="p-2 bg-purple-500/10 rounded-lg"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Users className="w-4 h-4 text-purple-600" />
                                        </motion.div>
                                        <span className="hidden sm:inline">Career Switches</span>
                                        <span className="sm:hidden">Switches</span>
                                    </CardTitle>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                                        className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm"
                                    >
                                        <span className="text-xs font-bold text-purple-600">↑ 32%</span>
                                    </motion.div>
                                </div>
                                <motion.div
                                    className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                                    key={switchesCount}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {switchesCount}+
                                </motion.div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={switchesData}>
                                        <defs>
                                            <linearGradient id="areaPurple" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                        <Tooltip content={<CustomTooltip color="#a855f7" />} />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#a855f7"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#areaPurple)"
                                            animationDuration={1500}
                                            animationBegin={400}
                                        >
                                            <LabelList dataKey="label" position="top" style={{ fontSize: '10px', fill: '#7c3aed', fontWeight: 'bold' }} />
                                        </Area>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Card 4: Salary Growth */}
                    <motion.div
                        custom={3}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-[320px] md:h-[340px] flex flex-col border-t-4 border-t-orange-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-2 relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle className="text-sm md:text-base flex items-center gap-2 text-muted-foreground font-medium">
                                        <motion.div
                                            className="p-2 bg-orange-500/10 rounded-lg"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <DollarSign className="w-4 h-4 text-orange-600" />
                                        </motion.div>
                                        <span className="hidden sm:inline">Avg Salary Hike</span>
                                        <span className="sm:hidden">Salary Hike</span>
                                    </CardTitle>
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                                        className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full backdrop-blur-sm"
                                    >
                                        <span className="text-xs font-bold text-orange-600">↑ 85%</span>
                                    </motion.div>
                                </div>
                                <motion.div
                                    className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent"
                                    key={salaryCount}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {salaryCount}%
                                </motion.div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salaryData}>
                                        <defs>
                                            <linearGradient id="barGray" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#94a3b8" />
                                                <stop offset="100%" stopColor="#64748b" />
                                            </linearGradient>
                                            <linearGradient id="barOrange" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f97316" />
                                                <stop offset="100%" stopColor="#ea580c" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                        <Tooltip cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }} content={<CustomTooltip color="#f97316" />} />
                                        <Bar
                                            dataKey="value"
                                            radius={[8, 8, 0, 0]}
                                            barSize={40}
                                            animationDuration={1500}
                                            animationBegin={500}
                                        >
                                            {salaryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? 'url(#barGray)' : 'url(#barOrange)'} />
                                            ))}
                                            <LabelList dataKey="label" position="top" style={{ fontSize: '10px', fill: '#ea580c', fontWeight: 'bold' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default SuccessMetrics;
