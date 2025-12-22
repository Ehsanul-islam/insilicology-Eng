import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, ArrowLeft } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useBlog, BlogPostInsert } from '@/hooks/useBlog';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import { TagInput } from '@/components/admin/TagInput';
import { supabase } from '@/integrations/supabase/client';

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    fetchBlogPostById,
    createBlogPost,
    updateBlogPost,
    generateSlug,
    isSlugUnique,
    fetchCategories,
  } = useBlog();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author_id: '',
    category_id: '',
    tags: [] as string[],
    meta_title: '',
    meta_description: '',
    published: false,
    published_at: '',
    featured: false,
  });

  useEffect(() => {
    loadData();
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const loadData = async () => {
    const [categoryData, authorData] = await Promise.all([
      fetchCategories(),
      fetchAuthors(),
    ]);
    setCategories(categoryData);
    setAuthors(authorData);
  };

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching authors:', error);
      return [];
    }
  };

  const loadPost = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const post = await fetchBlogPostById(id);
      if (post) {
        const category = post.blog_categories as any;
        const author = post.profiles as any;
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featured_image: post.featured_image || '',
          author_id: post.author_id || '',
          category_id: post.category_id || '',
          tags: (post.tags as string[]) || [],
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          published: post.published || false,
          published_at: post.published_at || '',
          featured: post.featured || false,
        });
      }
    } catch (error) {
      toast.error('Failed to load blog post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = async (title: string) => {
    setFormData((prev) => ({ ...prev, title }));
    
    // Auto-generate slug only for new posts
    if (!isEditing && title) {
      const newSlug = generateSlug(title);
      const unique = await isSlugUnique(newSlug);
      if (unique) {
        setFormData((prev) => ({ ...prev, slug: newSlug }));
      } else {
        setFormData((prev) => ({ ...prev, slug: `${newSlug}-${Date.now()}` }));
      }
    }
  };

  const handleSlugChange = async (slug: string) => {
    const cleanSlug = generateSlug(slug);
    setFormData((prev) => ({ ...prev, slug: cleanSlug }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return false;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Excerpt is required');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return false;
    }
    if (!formData.category_id) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.author_id) {
      toast.error('Author is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Check slug uniqueness
      const slugIsUnique = await isSlugUnique(formData.slug, id);
      if (!slugIsUnique) {
        toast.error('Slug is already in use. Please choose a different one.');
        setSaving(false);
        return;
      }

      const postData: any = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featured_image || null,
        author_id: formData.author_id || null,
        category_id: formData.category_id || null,
        tags: formData.tags,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        published: formData.published,
        featured: formData.featured,
        published_at: formData.published && !formData.published_at 
          ? new Date().toISOString() 
          : formData.published_at || null,
      };

      if (isEditing) {
        await updateBlogPost(id, postData);
        toast.success('Blog post updated successfully');
      } else {
        await createBlogPost(postData);
        toast.success('Blog post created successfully');
      }

      navigate('/admin/blog');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update blog post' : 'Failed to create blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Blog Post' : 'New Blog Post'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEOHead
        title={`Admin - ${isEditing ? 'Edit' : 'New'} Blog Post`}
        description="Manage blog posts"
        robots="noindex,nofollow"
      />
      <AdminLayout title={isEditing ? 'Edit Blog Post' : 'New Blog Post'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, published: false }));
                  handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                }}
                disabled={saving}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'} Post
              </Button>
            </div>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Blog post title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="blog-post-slug"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /blog/{formData.slug || 'blog-post-slug'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">
                      Excerpt <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the blog post"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">
                        Author <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.author_id}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, author_id: value }))}
                      >
                        <SelectTrigger id="author">
                          <SelectValue placeholder="Select author" />
                        </SelectTrigger>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.full_name || author.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <TagInput
                      tags={formData.tags}
                      onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
                      placeholder="Add tags..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownEditor
                    label="Blog Content"
                    value={formData.content}
                    onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                    placeholder="Write your blog post content in Markdown..."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    label="Featured Image"
                    value={formData.featured_image}
                    onChange={(url) =>
                      setFormData((prev) => ({ ...prev, featured_image: url as string }))
                    }
                    folder="blog/featured"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                      placeholder={formData.title || 'Auto-generated from title'}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use the post title
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                      placeholder={formData.excerpt || 'Auto-generated from excerpt'}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use the excerpt. Recommended: 150-160 characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publication Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="published">Published</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this post visible on the website
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ 
                          ...prev, 
                          published: checked,
                          published_at: checked && !prev.published_at ? new Date().toISOString() : prev.published_at
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="featured">Featured Post</Label>
                      <p className="text-sm text-muted-foreground">
                        Display this post prominently on the blog page
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, featured: checked }))
                      }
                    />
                  </div>

                  {formData.published && formData.published_at && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label>Published Date</Label>
                        <Input
                          type="datetime-local"
                          value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value).toISOString() : '';
                            setFormData((prev) => ({ ...prev, published_at: date }));
                          }}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/blog')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'} Post
            </Button>
          </div>
        </form>
      </AdminLayout>
    </>
  );
};

export default AdminBlogEditor;

