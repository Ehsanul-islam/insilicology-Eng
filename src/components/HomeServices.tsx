import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    researchServices as fallbackServices,
    type ResearchService,
} from '@/data/researchServices';
import { useResearchServices } from '@/hooks/useResearchServices';

const HomeServices = () => {
    const { fetchPublishedServices } = useResearchServices();
    const [services, setServices] = useState<ResearchService[]>(fallbackServices);

    useEffect(() => {
        let active = true;
        void (async () => {
            const remote = await fetchPublishedServices();
            if (active && remote.length > 0) {
                setServices(remote);
            }
        })();
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Subtle background accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-50/60 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#7C3AED] mb-2">
                        Our Services
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        Scientific Research Services
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">
                        Expert computational biology and chemistry solutions tailored for your research needs.
                    </p>
                </motion.div>

                {/* Services Grid — 4 cards per row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        // On mobile/tablet (< xl), hide cards after the first 4
                        const mobileHiddenClass = index >= 4 ? 'hidden xl:block' : '';

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.06 }}
                                viewport={{ once: true }}
                                className={mobileHiddenClass}
                            >
                                <Link
                                    to={`/research/${service.slug}`}
                                    className="group block h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-lg hover:border-[#7C3AED]/20 transition-all duration-300"
                                >
                                    {/* Icon */}
                                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${service.bg} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`h-5 w-5 ${service.color}`} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5 group-hover:text-[#7C3AED] transition-colors duration-200">
                                        {service.title}
                                    </h3>

                                    {/* Description — compact two-liner */}
                                    <p className="text-[13px] leading-relaxed text-gray-500 mb-4 line-clamp-2">
                                        {service.description}
                                    </p>

                                    {/* CTA */}
                                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C3AED] group-hover:gap-2.5 transition-all duration-200">
                                        View Details
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Explore all link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-8"
                >
                    <Link
                        to="/research"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C3AED]/5 border border-[#7C3AED]/15 text-[#7C3AED] text-sm font-semibold hover:bg-[#7C3AED]/10 hover:border-[#7C3AED]/25 transition-all duration-300 hover:gap-3"
                    >
                        Explore All Services
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeServices;
