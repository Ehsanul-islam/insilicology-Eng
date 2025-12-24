import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import SEOHead from '@/components/SEOHead';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCourses, useUniqueFilters, CourseFilters, PaginationState } from '@/hooks/useCourses';

const ITEMS_PER_PAGE = 9;

const Courses = () => {
  const [filters, setFilters] = useState<CourseFilters>({
    search: '',
    type: 'all',
    difficulty: 'all',
    priceRange: 'all',
    sortBy: 'featured',
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: ITEMS_PER_PAGE,
    total: 0,
  });

  const { courses, loading, error, totalCount, totalPages } = useCourses(filters, pagination);
  const { types, difficulties } = useUniqueFilters();

  const handleFilterChange = useCallback((key: keyof CourseFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('search', e.target.value);
  }, [handleFilterChange]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      type: 'all',
      difficulty: 'all',
      priceRange: 'all',
      sortBy: 'featured',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="All Courses - Learn Web Development, Data Science, Design & More"
        description="Browse our complete catalog of expert-led online courses. Master web development, data science, UI/UX design, digital marketing, cloud computing and more."
        url="/courses"
        tags={['online courses', 'web development', 'data science', 'professional training']}
      />
      <Navbar />

      <main className="flex-1">
        {/* Horizontal Split Ultra-Compact Premium Hero Section */}
        <section className="relative bg-[#0A0C10] text-white py-8 overflow-hidden border-b border-white/5">
          {/* Ambient Background Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[40%] -left-[10%] w-[60%] h-[80%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute top-[0%] -right-[20%] w-[50%] h-[80%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="container-custom relative z-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
              {/* Left Column: Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-purple-300 mb-3 backdrop-blur-md"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                  </span>
                  ELITE PLATFORM
                </motion.div>

                <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter leading-tight">
                  Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#22D3EE] to-[#A855F7] bg-[length:200%_auto] animate-gradient-x">All Courses</span>
                </h1>

                <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed font-medium">
                  {totalCount > 0
                    ? `Master in-demand skills with ${totalCount} expert-curated courses for modern professionals.`
                    : 'Master in-demand skills with expert-curated courses for modern professionals.'
                  }
                </p>
              </motion.div>

              {/* Right Column: Compact Horizontal Stats */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  { label: 'Courses', value: totalCount || '150+' },
                  { label: 'Success', value: '98%' },
                  { label: 'Hours', value: '1.2k+' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px] p-2 md:p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all hover:scale-105 group backdrop-blur-sm"
                  >
                    <span className="text-lg md:text-xl font-bold text-white group-hover:text-purple-400 transition-colors tracking-tight">{stat.value}</span>
                    <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-8">

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            {/* Search & Sort Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <Select value={filters.sortBy} onValueChange={(v) => handleFilterChange('sortBy', v)}>
                <SelectTrigger className="md:w-48">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-4">
              <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Course Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.difficulty} onValueChange={(v) => handleFilterChange('difficulty', v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.priceRange} onValueChange={(v) => handleFilterChange('priceRange', v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="under50">Under $50</SelectItem>
                  <SelectItem value="50to100">$50 - $100</SelectItem>
                  <SelectItem value="over100">Over $100</SelectItem>
                </SelectContent>
              </Select>

              {(filters.search || filters.type !== 'all' || filters.difficulty !== 'all' || filters.priceRange !== 'all') && (
                <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                  Clear Filters
                </Button>
              )}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {courses.length} of {totalCount} {totalCount === 1 ? 'course' : 'courses'}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-xl text-destructive">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Course Grid */}
          {!loading && !error && courses.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && courses.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No courses found matching your criteria</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and adjacent pages
                    return page === 1 ||
                      page === totalPages ||
                      Math.abs(page - pagination.page) <= 1;
                  })
                  .map((page, index, arr) => {
                    // Add ellipsis
                    const prevPage = arr[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={pagination.page === page ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
