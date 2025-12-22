import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useBlog } from '@/hooks/useBlog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { fetchBlogPostBySlug, calculateReadTime, fetchRelatedPosts } = useBlog();
  
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchBlogPostBySlug(slug);
      if (data) {
        setPost(data);
        
        // Fetch related posts
        if (data.category_id) {
          const related = await fetchRelatedPosts(data.category_id, data.id, 3);
          setRelatedPosts(related);
        }
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = post.blog_categories as any;
  const author = post.profiles as any;
  const readTime = calculateReadTime(post.content);
  const tags = (post.tags as string[]) || [];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${post.meta_title || post.title} | LearnCraft Blog`}
        description={post.meta_description || post.excerpt || ''}
        url={`/blog/${slug}`}
        type="article"
        image={post.featured_image || ''}
        author={author?.full_name || 'Unknown'}
        publishedTime={post.published_at || post.created_at || ''}
        tags={tags}
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Breadcrumb */}
        <section className="bg-muted/30 py-4 border-b border-border">
          <div className="container-custom">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-4 h-4" />
              {category && (
                <>
                  <Link 
                    to={`/blog?category=${category.slug}`} 
                    className="hover:text-foreground transition-colors capitalize"
                  >
                    {category.name}
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-foreground">{post.title}</span>
            </div>
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <header className="space-y-6">
                {category && (
                  <Badge variant="secondary" className="capitalize">
                    {category.name}
                  </Badge>
                )}
                
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-6 text-muted-foreground">
                  {post.published_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{readTime}</span>
                  </div>
                </div>

                {/* Author */}
                {author && (
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-4">
                      {author.avatar_url ? (
                        <img 
                          src={author.avatar_url} 
                          alt={author.full_name || 'Author'} 
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                          {(author.full_name || 'A')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{author.full_name || 'Unknown Author'}</p>
                        {author.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{author.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </header>

              {/* Featured Image */}
              {post.featured_image && (
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
                prose-ul:my-6 prose-li:text-foreground/80
                prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-strong:text-foreground prose-strong:font-semibold">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content || ''}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-8 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Author Bio */}
              {author && author.bio && (
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      {author.avatar_url ? (
                        <img 
                          src={author.avatar_url} 
                          alt={author.full_name || 'Author'} 
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-4xl">
                          {(author.full_name || 'A')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{author.full_name || 'Unknown Author'}</h3>
                        <p className="text-foreground/80">{author.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-16"
              >
                <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => {
                    const relatedCategory = relatedPost.blog_categories as any;
                    return (
                      <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                          <CardContent className="p-6">
                            {relatedCategory && (
                              <Badge variant="secondary" className="capitalize mb-3">
                                {relatedCategory.name}
                              </Badge>
                            )}
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h3>
                            {relatedPost.excerpt && (
                              <p className="text-muted-foreground mt-2 line-clamp-2">
                                {relatedPost.excerpt}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
