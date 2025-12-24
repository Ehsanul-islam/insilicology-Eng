import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Code2, TrendingUp, Star, Users, Award, Target, Zap } from 'lucide-react';

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

const PortfolioInsights = () => {
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
    const usersCount = useCounter(500, 2000, startCounting);
    const roiCount = useCounter(250, 2000, startCounting);
    const deliveryCount = useCounter(98, 2000, startCounting);

    // Data: Project Category Distribution (Donut Chart)
    const categoryData = [
        { name: 'Web Development', value: 45, color: '#3b82f6' },
        { name: 'Mobile Apps', value: 28, color: '#8b5cf6' },
        { name: 'Data Science', value: 15, color: '#10b981' },
        { name: 'UI/UX Design', value: 12, color: '#f59e0b' },
    ];

    // Data: Technology Stack (Horizontal Bars)
    const techData = [
        { name: 'React', value: 85, color: '#61dafb' },
        { name: 'Node.js', value: 72, color: '#68a063' },
        { name: 'Python', value: 65, color: '#3776ab' },
        { name: 'Flutter', value: 48, color: '#02569b' },
        { name: 'PostgreSQL', value: 55, color: '#336791' },
    ];

    // Data: Monthly Deliveries (Line Chart)
    const deliveryTrend = [
        { month: 'Jul', value: 8 },
        { month: 'Aug', value: 12 },
        { month: 'Sep', value: 10 },
        { month: 'Oct', value: 15 },
        { month: 'Nov', value: 13 },
        { month: 'Dec', value: 18 },
    ];

    // Data: Regional Distribution
    const regionalData = [
        { region: 'North America', value: 42, color: '#3b82f6' },
        { region: 'Europe', value: 28, color: '#8b5cf6' },
        { region: 'Asia Pacific', value: 20, color: '#10b981' },
        { region: 'Others', value: 10, color: '#f59e0b' },
    ];

    // Impact KPIs
    const impactMetrics = [
        { icon: Users, label: 'Users Impacted', value: '500K+', color: 'text-blue-600', bg: 'bg-blue-500/10', count: usersCount },
        { icon: Target, label: 'Avg Project ROI', value: '250%', color: 'text-purple-600', bg: 'bg-purple-500/10', count: roiCount },
        { icon: Zap, label: 'On-Time Delivery', value: '98%', color: 'text-green-600', bg: 'bg-green-500/10', count: deliveryCount },
        { icon: Award, label: 'Code Quality', value: 'A+', color: 'text-amber-600', bg: 'bg-amber-500/10', count: null },
    ];

    const RADIAN = Math.PI / 180;
    
    // Calculate orange segment position based on data
    const calculateOrangePosition = (cx: number, cy: number, outerRadius: number) => {
        const totalValue = categoryData.reduce((sum, item) => sum + item.value, 0);
        let cumulativeAngle = -90; // Pie charts typically start from top
        let orangeMidAngle = -90;
        
        categoryData.forEach((item) => {
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
            // For blue segment, position relative to orange "12%" label
            const orangePos = orangeLabelPos.current || calculateOrangePosition(cx, cy, outerRadius);
            
            // Position blue label: 1.5cm above and 0.3cm left from orange
            // 1cm ≈ 37.8 pixels at 96 DPI
            const offsetY = -56.7; // 1.5cm up (negative Y)
            const offsetX = -11.34; // 0.3cm left (negative X)
            x = orangePos.x + offsetX;
            y = orangePos.y + offsetY;
        } else {
            // Position other labels outside the donut normally
            const radius = outerRadius + 12;
            x = cx + radius * Math.cos(-midAngle * RADIAN);
            y = cy + radius * Math.sin(-midAngle * RADIAN);
        }

        // Use darker color for better visibility, especially for blue
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
                        {payload[0].value}{payload[0].dataKey === 'value' && payload[0].payload.name !== 'Code Quality' ? (payload[0].value > 50 ? '+' : '%') : ''}
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

            <div className="container-custom relative z-10">
                {/* Header */}
<<<<<<< HEAD
                <div className="text-center mb-16">
=======
                <div className="text-center mb-8">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block mb-3">
                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
                                <p className="text-xs font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                                    📈 PORTFOLIO INSIGHTS
                                </p>
                            </div>
                        </div>
<<<<<<< HEAD
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Work at a Glance</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
=======
                        <h2 className="text-xl md:text-2xl font-bold mb-2.5">Our Work at a Glance</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-xs">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                            Data-driven excellence across technologies, industries, and continents
                        </p>
                    </motion.div>
                </div>

                {/* Row 1: Category, Tech, Delivery, Satisfaction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">

                    {/* Card 1: Project Categories */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
<<<<<<< HEAD
                        <Card className="h-[340px] flex flex-col border-t-4 border-t-blue-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden group">
=======
                        <Card className="h-[224px] flex flex-col border-t-[3px] border-t-blue-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden group">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-0 relative z-10">
                                <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                        <Globe className="w-3 h-3 text-blue-600" />
                                    </div>
                                    Project Portfolio
                                </CardTitle>
<<<<<<< HEAD
                                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
=======
                                <div className="text-base font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent -mt-1">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                    150+ Projects
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10 pb-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            <filter id="textShadow">
                                                <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="white" floodOpacity="0.9"/>
                                            </filter>
                                        </defs>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
<<<<<<< HEAD
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            innerRadius={50}
=======
                                            cy="40%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={44}
                                            innerRadius={28}
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={1500}
                                        >
                                            {categoryData.map((entry, index) => (
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

                    {/* Card 2: Technology Stack */}
                    <motion.div
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
<<<<<<< HEAD
                        <Card className="h-[340px] flex flex-col border-t-4 border-t-purple-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 relative overflow-hidden group">
=======
                        <Card className="h-[224px] flex flex-col border-t-[3px] border-t-purple-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 relative overflow-hidden group">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-1.5 relative z-10">
                                <div className="flex items-center justify-between mb-1.5">
                                    <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                        <div className="p-1.5 bg-purple-500/10 rounded-lg">
                                            <Code2 className="w-3 h-3 text-purple-600" />
                                        </div>
                                        Tech Stack
                                    </CardTitle>
<<<<<<< HEAD
                                    <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                        <span className="text-xs font-bold text-purple-600">Top 5</span>
                                    </div>
                                </div>
                                <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
=======
                                    <div className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                        <span className="text-[8px] font-bold text-purple-600">Top 5</span>
                                    </div>
                                </div>
                                <div className="text-base font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                    20+ Technologies
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={techData} layout="vertical" margin={{ left: -16 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis type="number" hide />
<<<<<<< HEAD
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
=======
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 8, fill: '#6b7280' }} width={56} />
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" radius={[0, 3, 3, 0]} animationDuration={1500} animationBegin={200}>
                                            {techData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                            <LabelList dataKey="value" position="right" style={{ fontSize: '8px', fill: '#6b7280', fontWeight: 'bold' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Card 3: Monthly Deliveries */}
                    <motion.div
                        custom={2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
<<<<<<< HEAD
                        <Card className="h-[340px] flex flex-col border-t-4 border-t-cyan-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 relative overflow-hidden group">
=======
                        <Card className="h-[224px] flex flex-col border-t-[3px] border-t-cyan-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 relative overflow-hidden group">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-1.5 relative z-10">
                                <div className="flex items-center justify-between mb-1.5">
                                    <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                        <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                                            <TrendingUp className="w-3 h-3 text-cyan-600" />
                                        </div>
                                        Delivery Rate
                                    </CardTitle>
<<<<<<< HEAD
                                    <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                                        <span className="text-xs font-bold text-cyan-600">↑ 125%</span>
                                    </div>
                                </div>
                                <div className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
=======
                                    <div className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                                        <span className="text-[8px] font-bold text-cyan-600">↑ 125%</span>
                                    </div>
                                </div>
                                <div className="text-base font-black bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                    18/month
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={deliveryTrend}>
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
                                        <defs>
                                            <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="url(#lineCyan)"
                                            strokeWidth={2.4}
                                            fill="url(#colorDelivery)"
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

                    {/* Card 4: Client Satisfaction */}
                    <motion.div
                        custom={3}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
<<<<<<< HEAD
                        <Card className="h-[340px] flex flex-col border-t-4 border-t-green-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 relative overflow-hidden group">
=======
                        <Card className="h-[224px] flex flex-col border-t-[3px] border-t-green-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 relative overflow-hidden group">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-1.5 relative z-10">
                                <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                    <div className="p-1.5 bg-green-500/10 rounded-lg">
                                        <Star className="w-3 h-3 text-green-600" />
                                    </div>
                                    Client Satisfaction
                                </CardTitle>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 fill-green-500 text-green-500" />
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 w-full min-h-0 relative z-10 flex flex-col items-center justify-center">
<<<<<<< HEAD
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="80"
=======
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="40"
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                            stroke="#e5e7eb"
                                            strokeWidth="9.6"
                                            fill="none"
                                        />
                                        <motion.circle
<<<<<<< HEAD
                                            cx="96"
                                            cy="96"
                                            r="80"
                                            stroke="url(#gradientGreen)"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: "0 502" }}
                                            animate={startCounting ? { strokeDasharray: "480 502" } : {}}
=======
                                            cx="64"
                                            cy="64"
                                            r="40"
                                            stroke="url(#gradientGreen)"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: "0 251" }}
                                            animate={startCounting ? { strokeDasharray: "240 251" } : {}}
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
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
<<<<<<< HEAD
                                            className="text-4xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
=======
                                            className="text-2xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
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

                {/* Row 2: Regional Distribution & Impact Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Card 5: Regional Distribution */}
                    <motion.div
                        custom={4}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        whileHover={{ y: -6, scale: 1.01 }}
                    >
<<<<<<< HEAD
                        <Card className="h-[340px] border-t-4 border-t-indigo-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 relative overflow-hidden group">
=======
                        <Card className="h-[224px] border-t-[3px] border-t-indigo-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 relative overflow-hidden group">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-1.5 relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-1.5">
                                        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                                            <Globe className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        Global Reach
                                    </CardTitle>
<<<<<<< HEAD
                                    <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
=======
                                    <div className="text-base font-black bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                        25+ Countries
                                    </div>
                                </div>
                            </CardHeader>
<<<<<<< HEAD
                            <CardContent className="relative z-10 h-48">
=======
                            <CardContent className="relative z-10 h-32">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={regionalData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                                        <XAxis type="number" hide />
<<<<<<< HEAD
                                        <YAxis type="category" dataKey="region" tick={{ fontSize: 12, fill: '#6b7280' }} width={120} />
=======
                                        <YAxis type="category" dataKey="region" tick={{ fontSize: 9, fill: '#6b7280' }} width={72} />
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={1500} animationBegin={600}>
                                            {regionalData.map((entry, index) => (
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
<<<<<<< HEAD
                        <Card className="h-[340px] border-t-4 border-t-amber-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 relative overflow-hidden group">
=======
                        <Card className="h-[224px] border-t-[3px] border-t-amber-500 bg-white/80 backdrop-blur-xl hover:bg-white/90 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 relative overflow-hidden group">
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="pb-3 relative z-10">
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
<<<<<<< HEAD
                                            className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-background to-secondary/30 rounded-xl border border-border hover:shadow-md transition-shadow"
                                        >
                                            <div className={`p-1.5 ${metric.bg} rounded-lg mb-1.5`}>
                                                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                                            </div>
                                            <div className={`text-xl font-black bg-gradient-to-r ${metric.color.replace('text-', 'from-')} ${metric.color.replace('text-', 'to-').replace('600', '800')} bg-clip-text text-transparent`}>
=======
                                            className="flex flex-col items-center justify-center p-1.5 bg-gradient-to-br from-background to-secondary/30 rounded-xl border border-border hover:shadow-md transition-shadow"
                                        >
                                            <div className={`p-0.5 ${metric.bg} rounded-lg mb-0.5`}>
                                                <metric.icon className={`w-3 h-3 ${metric.color}`} />
                                            </div>
                                            <div className={`text-base font-black bg-gradient-to-r ${metric.color.replace('text-', 'from-')} ${metric.color.replace('text-', 'to-').replace('600', '800')} bg-clip-text text-transparent`}>
>>>>>>> 1c75e6acde535eb87f3afce854c23ddec35ddb3c
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

export default PortfolioInsights;
