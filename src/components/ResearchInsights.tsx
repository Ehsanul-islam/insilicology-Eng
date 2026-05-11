import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Microscope, Atom, TrendingUp, Star, Award, Target, Zap, FlaskConical } from 'lucide-react';

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

const ResearchInsights = () => {
    const [startCounting, setStartCounting] = useState(false);
    const sectionRef = useRef(null);
    const orangeLabelPos = useRef<{ x: number; y: number } | null>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            setStartCounting(true);
        }
    }, [isInView]);

    // Animated counters for impact metrics
    const publicationsCount = useCounter(50, 2000, startCounting);
    const successCount = useCounter(95, 2000, startCounting);
    const accuracyCount = useCounter(98, 2000, startCounting);

    // Data: Research Service Distribution (Donut Chart)
    const serviceData = [
        { name: 'Molecular Docking', value: 35, color: '#3b82f6' },
        { name: 'Molecular Dynamics', value: 30, color: '#8b5cf6' },
        { name: 'DFT Calculations', value: 20, color: '#10b981' },
        { name: 'Bioinformatics', value: 15, color: '#f59e0b' },
    ];

    // Data: Research Tools & Software (Horizontal Bars)
    const toolsData = [
        { name: 'AutoDock', value: 90, color: '#61dafb' },
        { name: 'GROMACS', value: 85, color: '#68a063' },
        { name: 'Gaussian', value: 75, color: '#3776ab' },
        { name: 'PyMOL', value: 80, color: '#02569b' },
        { name: 'BLAST', value: 70, color: '#336791' },
    ];

    // Data: Monthly Research Output (Line Chart)
    const outputTrend = [
        { month: 'Jul', value: 6 },
        { month: 'Aug', value: 8 },
        { month: 'Sep', value: 7 },
        { month: 'Oct', value: 10 },
        { month: 'Nov', value: 9 },
        { month: 'Dec', value: 12 },
    ];

    // Data: Research Field Distribution
    const fieldData = [
        { region: 'Drug Discovery', value: 25, color: '#3b82f6' },
        { region: 'Protein Analysis', value: 20, color: '#8b5cf6' },
        { region: 'MD Simulation', value: 18, color: '#06b6d4' },
        { region: 'Vaccine Design', value: 15, color: '#ec4899' },
        { region: 'Network pharmacology', value: 10, color: '#6366f1' },
        { region: 'Material Science', value: 8, color: '#10b981' },
        { region: 'Others', value: 4, color: '#f59e0b' },
    ];

    // Impact KPIs
    const impactMetrics = [
        { icon: FlaskConical, label: 'Publications', value: '50+', color: 'text-blue-600', gradient: 'from-blue-600 to-blue-800', bg: 'bg-blue-500/10', count: publicationsCount },
        { icon: Target, label: 'Success Rate', value: '95%', color: 'text-purple-600', gradient: 'from-purple-600 to-purple-800', bg: 'bg-purple-500/10', count: successCount },
        { icon: Zap, label: 'Accuracy', value: '98%', color: 'text-green-600', gradient: 'from-green-600 to-green-800', bg: 'bg-green-500/10', count: accuracyCount },
        { icon: Award, label: 'Quality', value: 'A+', color: 'text-amber-600', gradient: 'from-amber-600 to-amber-800', bg: 'bg-amber-500/10', count: null },
    ];

    const RADIAN = Math.PI / 180;

    // Calculate orange segment position based on data
    const calculateOrangePosition = (cx: number, cy: number, outerRadius: number) => {
        const totalValue = serviceData.reduce((sum, item) => sum + item.value, 0);
        let cumulativeAngle = -90; // Pie charts typically start from top
        let orangeMidAngle = -90;

        serviceData.forEach((item) => {
            const itemPercent = item.value / totalValue;
            const itemAngle = itemPercent * 360;
            if (item.color === '#f59e0b') {
                orangeMidAngle = cumulativeAngle + itemAngle / 2;
            }
            cumulativeAngle += itemAngle;
        });

        const radius = outerRadius + 12;
        return {
            x: cx + radius * Math.cos(-orangeMidAngle * RADIAN),
            y: cy + radius * Math.sin(-orangeMidAngle * RADIAN)
        };
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload, startAngle, endAngle }: any) => {
        const isBlue = payload.color === '#3b82f6';
        const isOrange = payload.color === '#f59e0b';

        let x, y;

        if (isOrange) {
            // Store orange label position for blue label to use
            const radius = outerRadius + 12;
            x = cx + radius * Math.cos(-midAngle * RADIAN);
            y = cy + radius * Math.sin(-midAngle * RADIAN);
            orangeLabelPos.current = { x, y };
        } else if (isBlue) {
            // For blue segment, position relative to orange label
            const orangePos = orangeLabelPos.current || calculateOrangePosition(cx, cy, outerRadius);

            const offsetY = -56.7; // 1.5cm up
            const offsetX = -11.34; // 0.3cm left
            x = orangePos.x + offsetX;
            y = orangePos.y + offsetY;
        } else {
            // Position other labels outside the donut normally
            const radius = outerRadius + 12;
            x = cx + radius * Math.cos(-midAngle * RADIAN);
            y = cy + radius * Math.sin(-midAngle * RADIAN);
        }

        const textColor = payload.color === '#3b82f6' ? '#1e40af' : payload.color;

        return (
            <text
                x={x}
                y={y}
                fill={textColor}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                filter="url(#textShadow)"
                style={{
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-xl p-2.5 border-2 border-white shadow-2xl rounded-xl text-xs font-bold">
                    <p className="text-gray-600 mb-0.5">{payload[0].name}</p>
                    <p style={{ color: payload[0].color || payload[0].fill }} className="text-base">
                        {payload[0].value}{payload[0].dataKey === 'value' && payload[0].payload.name !== 'Quality' ? (payload[0].value > 50 ? '+' : '%') : ''}
                    </p>
                </div>
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
                delay: i * 0.12,
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    return (
        <section ref={sectionRef} className="py-20 bg-gradient-to-b from-background via-secondary/20 to-background font-siliguri overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.03, 0.06, 0.03],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl"
                />
            </div>

            <div className="container-custom relative z-10 max-w-[85%] mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block mb-3">
                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
                                <p className="text-xs font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                                    🔬 RESEARCH INSIGHTS
                                </p>
                            </div>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold mb-2.5">Our Research at a Glance</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-xs">
                            Data-driven excellence across computational chemistry and bioinformatics
                        </p>
                    </motion.div>
                </div>

                {/* Row 1: Services, Tools, Output, Quality */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">

                    {/* Card 1: Research Services */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-[224px] flex flex-col border-t-[3px] border-t-blue-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pt-3 pb-0 relative z-10">
                                <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                        <Microscope className="w-3 h-3 text-blue-600" />
                                    </div>
                                    Research Services
                                </CardTitle>
                                <div className="text-base font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent -mt-1">
                                    100+ Projects
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10 pb-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            <filter id="textShadow">
                                                <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="white" floodOpacity="0.9" />
                                            </filter>
                                        </defs>
                                        <Pie
                                            data={serviceData}
                                            cx="50%"
                                            cy="40%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={44}
                                            innerRadius={28}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={1500}
                                        >
                                            {serviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={29}
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: '8px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Card 2: Research Tools */}
                    <motion.div
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-[224px] flex flex-col border-t-[3px] border-t-purple-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pt-3 pb-1.5 relative z-10">
                                <div className="flex items-center justify-between mb-1.5">
                                    <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                        <div className="p-1.5 bg-purple-500/10 rounded-lg">
                                            <Atom className="w-3 h-3 text-purple-600" />
                                        </div>
                                        Tools & Software
                                    </CardTitle>
                                    <div className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                        <span className="text-[8px] font-bold text-purple-600">Top 5</span>
                                    </div>
                                </div>
                                <div className="text-base font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    15+ Tools
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={toolsData} layout="vertical" margin={{ left: -16 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 8, fill: '#6b7280' }} width={56} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" radius={[0, 3, 3, 0]} animationDuration={1500} animationBegin={200}>
                                            {toolsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                            <LabelList dataKey="value" position="right" style={{ fontSize: '8px', fill: '#6b7280', fontWeight: 'bold' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Card 3: Research Output */}
                    <motion.div
                        custom={2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-[224px] flex flex-col border-t-[3px] border-t-cyan-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pt-3 pb-1.5 relative z-10">
                                <div className="flex items-center justify-between mb-1.5">
                                    <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                        <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                                            <TrendingUp className="w-3 h-3 text-cyan-600" />
                                        </div>
                                        Research Output
                                    </CardTitle>
                                    <div className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                                        <span className="text-[8px] font-bold text-cyan-600">↑ 100%</span>
                                    </div>
                                </div>
                                <div className="text-base font-black bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
                                    12/month
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={outputTrend}>
                                        <defs>
                                            <linearGradient id="lineCyan" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#06b6d4" />
                                                <stop offset="100%" stopColor="#0891b2" />
                                            </linearGradient>
                                            <linearGradient id="areaCyan" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#6b7280' }} />
                                        <YAxis hide />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="url(#lineCyan)"
                                            strokeWidth={2.4}
                                            fill="url(#areaCyan)"
                                            dot={{ r: 4, fill: "#06b6d4", strokeWidth: 1.6, stroke: "#fff" }}
                                            activeDot={{ r: 5.6, strokeWidth: 2.4 }}
                                            animationDuration={1500}
                                            animationBegin={400}
                                        >
                                            <LabelList dataKey="value" position="top" style={{ fontSize: '8px', fill: '#0891b2', fontWeight: 'bold' }} />
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Card 4: Research Quality */}
                    <motion.div
                        custom={3}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-[224px] flex flex-col border-t-[3px] border-t-green-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pt-3 pb-1.5 relative z-10">
                                <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                    <div className="p-1.5 bg-green-500/10 rounded-lg">
                                        <Star className="w-3 h-3 text-green-600" />
                                    </div>
                                    Research Quality
                                </CardTitle>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 fill-green-500 text-green-500" />
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10 flex flex-col items-center justify-center">
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="40"
                                            stroke="#e5e7eb"
                                            strokeWidth="9.6"
                                            fill="none"
                                        />
                                        <motion.circle
                                            cx="64"
                                            cy="64"
                                            r="40"
                                            stroke="url(#gradientGreen)"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: "0 251" }}
                                            animate={startCounting ? { strokeDasharray: "238 251" } : {}}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                        />
                                        <defs>
                                            <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.div
                                            className="text-2xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
                                            initial={{ scale: 0 }}
                                            animate={startCounting ? { scale: 1 } : {}}
                                            transition={{ duration: 0.5, delay: 1 }}
                                        >
                                            4.9
                                        </motion.div>
                                        <div className="text-xs text-muted-foreground">out of 5.0</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Row 2: Research Fields & Impact Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Card 5: Research Field Distribution */}
                    <motion.div
                        custom={4}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.01 }}
                    >
                        <Card className="h-[238px] border-t-[3px] border-t-indigo-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pt-3 pb-1.5 relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-1.5">
                                        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                                            <Microscope className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        Research Fields
                                    </CardTitle>
                                    <div className="text-base font-black bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                                        7+ Areas
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10 h-40 pb-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={fieldData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="region" tick={{ fontSize: 9, fill: '#6b7280' }} width={98} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={1500} animationBegin={600}>
                                            {fieldData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                            <LabelList dataKey="value" position="right" style={{ fontSize: '10px', fill: '#374151', fontWeight: 'bold' }} formatter={(value: number) => `${value}%`} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Card 6: Impact Metrics */}
                    <motion.div
                        custom={5}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.01 }}
                    >
                        <Card className="h-[238px] border-t-[3px] border-t-amber-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 relative overflow-hidden group">
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pt-3 pb-3 relative z-10">
                                <CardTitle className="text-base flex items-center gap-1.5">
                                    <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                        <Award className="w-4 h-4 text-amber-600" />
                                    </div>
                                    Impact & Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 pt-1.5">
                                <div className="grid grid-cols-2 gap-2.5">
                                    {impactMetrics.map((metric, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={startCounting ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                                            className="flex flex-col items-center justify-center p-1.5 bg-gradient-to-br from-background to-secondary/30 rounded-xl border border-border hover:shadow-md transition-shadow"
                                        >
                                            <div className={`p-0.5 ${metric.bg} rounded-lg mb-0.5`}>
                                                <metric.icon className={`w-3 h-3 ${metric.color}`} />
                                            </div>
                                            <div className={`text-base font-black bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                                                {metric.count !== null ? `${metric.count}${metric.value.includes('K') ? 'K' : metric.value.includes('%') ? '%' : ''}${metric.value.includes('+') ? '+' : ''}` : metric.value}
                                            </div>
                                            <div className="text-[8px] text-muted-foreground text-center mt-0.5 leading-tight">{metric.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ResearchInsights;
