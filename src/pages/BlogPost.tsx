import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const BlogPost = () => {
  const { slug } = useParams();

  // Mock data - replace with actual data fetching
  const post = {
    id: '1',
    slug: slug || 'mastering-react-hooks-2024',
    title: 'Mastering React Hooks in 2024: A Complete Guide',
    excerpt: 'Deep dive into React Hooks with practical examples and best practices for building modern applications.',
    content: `
      <p>React Hooks have revolutionized the way we write React components, allowing us to use state and other React features without writing classes. In this comprehensive guide, we'll explore the most important hooks and how to use them effectively.</p>

      <h2>Understanding useState</h2>
      <p>The useState hook is the foundation of state management in functional components. It allows you to add state to your components without converting them to classes.</p>

      <pre><code>const [count, setCount] = useState(0);</code></pre>

      <p>This simple pattern provides a way to declare state variables and update them. The first value is the current state, and the second is the function to update it.</p>

      <h2>useEffect for Side Effects</h2>
      <p>The useEffect hook lets you perform side effects in function components. It's similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined.</p>

      <pre><code>useEffect(() => {
  // Side effect code here
  return () => {
    // Cleanup code here
  };
}, [dependencies]);</code></pre>

      <h2>Custom Hooks</h2>
      <p>One of the most powerful features of hooks is the ability to create custom hooks. These allow you to extract component logic into reusable functions.</p>

      <pre><code>function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}</code></pre>

      <h2>Best Practices</h2>
      <p>Here are some key best practices to follow when working with hooks:</p>
      <ul>
        <li>Always call hooks at the top level of your component</li>
        <li>Only call hooks from React function components or custom hooks</li>
        <li>Use the ESLint plugin for hooks to enforce these rules</li>
        <li>Keep your useEffect dependencies array accurate</li>
        <li>Extract complex logic into custom hooks</li>
      </ul>

      <h2>Conclusion</h2>
      <p>React Hooks provide a powerful and flexible way to add functionality to your components. By understanding and following best practices, you can write cleaner, more maintainable React code.</p>
    `,
    author: {
      name: 'Sarah Johnson',
      avatar: '👩‍💻',
      title: 'Senior Full-Stack Developer',
      bio: 'Sarah is a passionate developer with 10+ years of experience in web development and a love for teaching.',
    },
    publishedAt: '2024-03-15',
    updatedAt: '2024-03-15',
    readTime: '8 min read',
    category: 'tutorials',
    tags: ['React', 'JavaScript', 'Web Development', 'Hooks'],
    featuredImage: '/placeholder.svg',
  };

  const relatedPosts = [
    {
      id: '2',
      slug: 'typescript-best-practices',
      title: 'TypeScript Best Practices for Large Applications',
      category: 'tutorials',
    },
    {
      id: '3',
      slug: 'web3-blockchain-basics',
      title: 'Understanding Web3 and Blockchain for Developers',
      category: 'technology',
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${post.title} | LearnCraft Blog`}
        description={post.excerpt}
        url={`/blog/${slug}`}
        type="article"
        image={post.featuredImage}
        author={post.author.name}
        publishedTime={post.publishedAt}
        tags={post.tags}
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
              <span className="capitalize">{post.category}</span>
              <ChevronRight className="w-4 h-4" />
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
                <Badge variant="secondary" className="capitalize">
                  {post.category}
                </Badge>
                
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{post.author.avatar}</div>
                    <div>
                      <p className="font-semibold">{post.author.name}</p>
                      <p className="text-sm text-muted-foreground">{post.author.title}</p>
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
              </header>

              {/* Featured Image */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <div className="text-8xl opacity-50">📝</div>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
                  prose-ul:my-6 prose-li:text-foreground/80
                  prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-muted prose-pre:border prose-pre:border-border
                  prose-strong:text-foreground prose-strong:font-semibold"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="pt-8 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Author Bio */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="text-6xl">{post.author.avatar}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{post.author.name}</h3>
                      <p className="text-muted-foreground mb-3">{post.author.title}</p>
                      <p className="text-foreground/80">{post.author.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                        <CardContent className="p-6">
                          <Badge variant="secondary" className="capitalize mb-3">
                            {relatedPost.category}
                          </Badge>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h3>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
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
