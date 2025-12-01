import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'tutorials', 'industry news', 'career advice', 'technology'];

  const posts = [
    {
      id: '1',
      slug: 'mastering-react-hooks-2024',
      title: 'Mastering React Hooks in 2024: A Complete Guide',
      excerpt: 'Deep dive into React Hooks with practical examples and best practices for building modern applications.',
      author: 'Sarah Johnson',
      authorAvatar: '👩‍💻',
      publishedAt: '2024-03-15',
      readTime: '8 min read',
      category: 'tutorials',
      featuredImage: '/placeholder.svg',
      featured: true,
    },
    {
      id: '2',
      slug: 'ai-revolution-2024',
      title: 'The AI Revolution: What Developers Need to Know',
      excerpt: 'Exploring how artificial intelligence is transforming the software development landscape and what skills you need.',
      author: 'Michael Chen',
      authorAvatar: '👨‍💼',
      publishedAt: '2024-03-12',
      readTime: '6 min read',
      category: 'industry news',
      featuredImage: '/placeholder.svg',
      featured: true,
    },
    {
      id: '3',
      slug: 'career-transition-tech',
      title: 'Successfully Transitioning Your Career into Tech',
      excerpt: 'A comprehensive guide for professionals looking to make the switch to a technology career.',
      author: 'Emily Rodriguez',
      authorAvatar: '👩‍🎓',
      publishedAt: '2024-03-10',
      readTime: '10 min read',
      category: 'career advice',
      featuredImage: '/placeholder.svg',
      featured: false,
    },
    {
      id: '4',
      slug: 'typescript-best-practices',
      title: 'TypeScript Best Practices for Large Applications',
      excerpt: 'Learn how to leverage TypeScript effectively in enterprise-level applications with these proven patterns.',
      author: 'David Kim',
      authorAvatar: '👨‍💻',
      publishedAt: '2024-03-08',
      readTime: '7 min read',
      category: 'tutorials',
      featuredImage: '/placeholder.svg',
      featured: false,
    },
    {
      id: '5',
      slug: 'web3-blockchain-basics',
      title: 'Understanding Web3 and Blockchain for Developers',
      excerpt: 'A beginner-friendly introduction to Web3 technologies and how to start building decentralized applications.',
      author: 'Sarah Johnson',
      authorAvatar: '👩‍💻',
      publishedAt: '2024-03-05',
      readTime: '9 min read',
      category: 'technology',
      featuredImage: '/placeholder.svg',
      featured: false,
    },
    {
      id: '6',
      slug: 'remote-work-productivity',
      title: '10 Tips for Staying Productive While Working Remotely',
      excerpt: 'Proven strategies to maintain high productivity and work-life balance in a remote work environment.',
      author: 'Michael Chen',
      authorAvatar: '👨‍💼',
      publishedAt: '2024-03-01',
      readTime: '5 min read',
      category: 'career advice',
      featuredImage: '/placeholder.svg',
      featured: false,
    },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = posts.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Blog - Tech Insights, Tutorials & Career Advice | LearnCraft"
        description="Stay updated with the latest in technology, programming tutorials, career advice, and industry insights from our expert contributors."
        url="/blog"
        type="website"
        tags={['blog', 'tech blog', 'programming tutorials', 'career advice', 'technology news']}
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-dark via-primary to-cyan-500 text-white py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Our Blog
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Insights, tutorials, and stories from the world of technology and professional development.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-white text-foreground border-0 text-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 border-b border-border">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Posts */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="py-16 bg-muted/50">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredPosts.map((post, index) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <Card className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl opacity-50">📝</div>
                          </div>
                          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                            Featured
                          </Badge>
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <Badge variant="secondary" className="capitalize">
                            {post.category}
                          </Badge>
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{post.authorAvatar}</div>
                              <div className="text-sm">
                                <p className="font-semibold">{post.author}</p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{post.readTime}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-8">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
              </h2>
              
              {filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <Card className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-5xl opacity-50">📝</div>
                            </div>
                          </div>
                          <CardContent className="p-6 space-y-3">
                            <Badge variant="secondary" className="capitalize text-xs">
                              {post.category}
                            </Badge>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                              <div className="flex items-center gap-2">
                                <div className="text-xl">{post.authorAvatar}</div>
                                <span className="text-sm font-medium">{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                <Clock className="w-3 h-3" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No articles found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-dark to-primary text-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-4xl font-bold mb-4">Never Miss an Update</h2>
              <p className="text-xl text-white/90 mb-8">
                Subscribe to our newsletter and get the latest articles delivered to your inbox.
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-foreground border-0 h-12"
                />
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
