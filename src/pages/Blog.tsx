import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBlog } from '@/hooks/useBlog';

const Blog = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const { fetchPublishedBlogPosts, fetchCategories, calculateReadTime } = useBlog();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsData, categoriesData] = await Promise.all([
        fetchPublishedBlogPosts(),
        fetchCategories(),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const category = post.blog_categories as any;
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'featured' && post.featured) ||
      category?.id === selectedCategory ||
      category?.slug === selectedCategory;
    
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
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'featured' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('featured')}
              >
                Featured
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id || selectedCategory === category.slug ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="capitalize"
                >
                  {category.name}
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
                        {post.featured_image ? (
                          <div className="aspect-video relative overflow-hidden">
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                              Featured
                            </Badge>
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-6xl opacity-50">📝</div>
                            </div>
                            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                              Featured
                            </Badge>
                          </div>
                        )}
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
                              {(post.profiles as any)?.avatar_url ? (
                                <img 
                                  src={(post.profiles as any).avatar_url} 
                                  alt={(post.profiles as any).full_name || 'Author'} 
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                                  {((post.profiles as any)?.full_name || 'A')[0].toUpperCase()}
                                </div>
                              )}
                              <div className="text-sm">
                                <p className="font-semibold">{(post.profiles as any)?.full_name || 'Unknown Author'}</p>
                                {post.published_at && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{calculateReadTime(post.content)}</span>
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
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">Loading posts...</div>
                </div>
              ) : filteredPosts.length > 0 ? (
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
                          {post.featured_image ? (
                            <div className="aspect-video relative overflow-hidden">
                              <img 
                                src={post.featured_image} 
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-5xl opacity-50">📝</div>
                              </div>
                            </div>
                          )}
                          <CardContent className="p-6 space-y-3">
                            {(post.blog_categories as any) && (
                              <Badge variant="secondary" className="capitalize text-xs">
                                {(post.blog_categories as any).name}
                              </Badge>
                            )}
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                              <div className="flex items-center gap-2">
                                {(post.profiles as any)?.avatar_url ? (
                                  <img 
                                    src={(post.profiles as any).avatar_url} 
                                    alt={(post.profiles as any).full_name || 'Author'} 
                                    className="w-6 h-6 rounded-full"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                    {((post.profiles as any)?.full_name || 'A')[0].toUpperCase()}
                                  </div>
                                )}
                                <span className="text-sm font-medium">
                                  {(post.profiles as any)?.full_name || 'Unknown Author'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                <Clock className="w-3 h-3" />
                                <span>{calculateReadTime(post.content)}</span>
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
