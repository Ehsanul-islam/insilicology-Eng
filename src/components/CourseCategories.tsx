import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dna, Pill, LineChart, Microscope } from 'lucide-react';

const CourseCategories = () => {
  const categories = [
    {
      icon: Dna,
      name: 'Genomics',
      count: 12,
      color: 'from-bio-teal to-bio-cyan',
      link: '/courses?category=genomics',
    },
    {
      icon: Pill,
      name: 'CADD',
      count: 8,
      color: 'from-bio-purple to-purple-400',
      link: '/courses?category=cadd',
    },
    {
      icon: LineChart,
      name: 'ML/AI',
      count: 6,
      color: 'from-bio-gold to-yellow-400',
      link: '/courses?category=ml-ai',
    },
    {
      icon: Microscope,
      name: 'Research',
      count: 10,
      color: 'from-blue-500 to-bio-teal',
      link: '/courses?category=research',
    },
  ];

  return (
    <section className="py-16 section-off-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore courses tailored to your research interests
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={category.link}>
                <div className="group bg-white rounded-2xl p-6 border border-border hover:border-bio-teal hover:shadow-xl transition-all duration-300 cursor-pointer">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-bio-teal transition-colors">
                    {category.name}
                  </h3>

                  {/* Course Count */}
                  <p className="text-sm text-muted-foreground">
                    {category.count} courses
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-4 flex items-center text-bio-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Explore</span>
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;

