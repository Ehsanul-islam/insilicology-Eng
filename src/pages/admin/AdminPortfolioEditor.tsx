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
import { usePortfolio, PortfolioInsert } from '@/hooks/usePortfolio';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import { TagInput } from '@/components/admin/TagInput';
import { JSONArrayEditor } from '@/components/admin/JSONArrayEditor';

const AdminPortfolioEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    fetchPortfolioById,
    createPortfolio,
    updatePortfolio,
    generateSlug,
    isSlugUnique,
    fetchCategories,
  } = usePortfolio();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    client_name: '',
    country: '',
    duration_text: '',
    team_size: '',
    category: '',
    hero_image_url: '',
    gallery_images: [] as string[],
    technologies: [] as string[],
    services: [] as string[],
    results: [] as any[],
    challenges: [] as any[],
    solutions: [] as any[],
    featured: false,
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadPortfolio();
    }
  }, [id]);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const loadPortfolio = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const portfolio = await fetchPortfolioById(id);
      if (portfolio) {
        setFormData({
          title: portfolio.title || '',
          slug: portfolio.slug || '',
          summary: portfolio.summary || '',
          description: portfolio.description || '',
          client_name: portfolio.client_name || '',
          country: portfolio.country || '',
          duration_text: portfolio.duration_text || '',
          team_size: portfolio.team_size || '',
          category: portfolio.category || '',
          hero_image_url: portfolio.hero_image_url || '',
          gallery_images: (portfolio.gallery_images as string[]) || [],
          technologies: (portfolio.technologies as string[]) || [],
          services: (portfolio.services as string[]) || [],
          results: (portfolio.results as any[]) || [],
          challenges: (portfolio.challenges as any[]) || [],
          solutions: (portfolio.solutions as any[]) || [],
          featured: portfolio.featured || false,
          status: (portfolio.status as 'draft' | 'published' | 'archived') || 'draft',
        });
      }
    } catch (error) {
      toast.error('Failed to load portfolio');
      navigate('/admin/portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = async (title: string) => {
    setFormData((prev) => ({ ...prev, title }));

    // Auto-generate slug only for new portfolios
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
    if (!formData.summary.trim()) {
      toast.error('Summary is required');
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

      const portfolioData: any = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        description: formData.description || null,
        client_name: formData.client_name || null,
        country: formData.country || null,
        duration_text: formData.duration_text || null,
        team_size: formData.team_size || null,
        category: formData.category || null,
        hero_image_url: formData.hero_image_url || null,
        gallery_images: formData.gallery_images,
        technologies: formData.technologies,
        services: formData.services,
        results: formData.results,
        challenges: formData.challenges,
        solutions: formData.solutions,
        featured: formData.featured,
        status: formData.status,
      };

      if (isEditing) {
        await updatePortfolio(id, portfolioData);
        toast.success('Portfolio updated successfully');
      } else {
        await createPortfolio(portfolioData);
        toast.success('Portfolio created successfully');
      }

      navigate('/admin/portfolio');
    } catch (error: any) {
      console.error('Portfolio save error:', error);
      toast.error(
        isEditing
          ? `Failed to update portfolio: ${error.message || 'Unknown error'}`
          : `Failed to create portfolio: ${error.message || 'Unknown error'}`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Portfolio' : 'New Portfolio'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEOHead
        title={`Admin - ${isEditing ? 'Edit' : 'New'} Portfolio`}
        description="Manage portfolio projects"
        robots="noindex,nofollow"
      />
      <AdminLayout title={isEditing ? 'Edit Portfolio' : 'New Portfolio'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/portfolio')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData((prev) => ({ ...prev, status: 'draft' }))}
                disabled={saving}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'} Portfolio
              </Button>
            </div>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
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
                      placeholder="Project title"
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
                      placeholder="project-slug"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /portfolio/{formData.slug || 'project-slug'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">
                      Summary <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                      placeholder="Brief project summary"
                      required
                    />
                  </div>

                  <MarkdownEditor
                    label="Description"
                    value={formData.description}
                    onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                    placeholder="Full project description..."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client_name">Client Name</Label>
                      <Input
                        id="client_name"
                        value={formData.client_name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, client_name: e.target.value }))
                        }
                        placeholder="Client name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, country: e.target.value }))
                        }
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration_text}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, duration_text: e.target.value }))
                        }
                        placeholder="e.g., 6 months"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team_size">Team Size</Label>
                      <Input
                        id="team_size"
                        value={formData.team_size}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, team_size: e.target.value }))
                        }
                        placeholder="e.g., 12 members"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    label="Hero Image"
                    value={formData.hero_image_url}
                    onChange={(url) =>
                      setFormData((prev) => ({ ...prev, hero_image_url: url as string }))
                    }
                    folder="portfolio/hero"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gallery Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    label="Gallery Images"
                    value={formData.gallery_images}
                    onChange={(urls) =>
                      setFormData((prev) => ({ ...prev, gallery_images: urls as string[] }))
                    }
                    multiple
                    folder="portfolio/gallery"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagInput
                    tags={formData.technologies}
                    onChange={(tags) => setFormData((prev) => ({ ...prev, technologies: tags }))}
                    placeholder="Add technology..."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services Provided</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagInput
                    tags={formData.services}
                    onChange={(tags) => setFormData((prev) => ({ ...prev, services: tags }))}
                    placeholder="Add service..."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Results & Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <JSONArrayEditor
                    label="Results"
                    itemLabel="Result"
                    value={formData.results}
                    onChange={(value) => setFormData((prev) => ({ ...prev, results: value }))}
                    fields={[
                      { name: 'metric', label: 'Metric', type: 'text', placeholder: 'e.g., 3M+', required: true },
                      { name: 'description', label: 'Description', type: 'text', placeholder: 'e.g., Active users', required: true },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <JSONArrayEditor
                    label="Challenges"
                    itemLabel="Challenge"
                    value={formData.challenges}
                    onChange={(value) => setFormData((prev) => ({ ...prev, challenges: value }))}
                    fields={[
                      { name: 'title', label: 'Title', type: 'text', placeholder: 'Challenge title', required: true },
                      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Challenge description', required: true },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <JSONArrayEditor
                    label="Solutions"
                    itemLabel="Solution"
                    value={formData.solutions}
                    onChange={(value) => setFormData((prev) => ({ ...prev, solutions: value }))}
                    fields={[
                      { name: 'title', label: 'Title', type: 'text', placeholder: 'Solution title', required: true },
                      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Solution description', required: true },
                    ]}
                  />
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
                      <Label htmlFor="featured">Featured Portfolio</Label>
                      <p className="text-sm text-muted-foreground">
                        Display this portfolio prominently on the homepage
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

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'draft' | 'published' | 'archived') =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Only published portfolios are visible on the website
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/portfolio')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'} Portfolio
            </Button>
          </div>
        </form>
      </AdminLayout>
    </>
  );
};

export default AdminPortfolioEditor;

