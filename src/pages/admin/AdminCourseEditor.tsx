import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Save,
  ArrowLeft,
  CalendarIcon,
  Plus,
  Trash2,
  GripVertical,
  Image,
  BookOpen,
  User,
  FileText,
  ListOrdered,
  Target,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Laptop,
  Rocket,
  Code,
  Users,
  HelpCircle,
  Star,
  Database,
  Globe,
  Bot,
  Share2,
  Mic,
  Layers,
  Smartphone,
  Shield,
  Zap,
  Brain,
  Settings,
  Award,
} from 'lucide-react';

// Types for form data
interface CourseFormData {
  // Basic Info
  title: string;
  slug: string;
  description: string;
  poster_url: string;
  promo_video_url: string;
  course_type: 'live' | 'recorded' | 'hybrid';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | '';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  upcoming: boolean;
  certificate: boolean;
  price_regular: string;
  price_offer: string;
  start_date: Date | undefined;
  duration_text: string;
  module_count: string;

  // Instructor
  instructor_name: string;
  instructor_title: string;
  instructor_bio: string;
  instructor_photo: string;

  // Content
  learning_outcomes: string[];
  requirements: string[];
  topics: string[];

  // Marketing
  comparison_features: ComparisonFeature[];
  target_audience: TargetAudienceCard[];
  testimonials: Testimonial[];
  value_breakdown: ValueItem[];
  countdown_end_date: Date | undefined;
  stats: {
    students: string;
    community: string;
    support: string;
  };

  // Marketing - FAQ
  faq: FAQItem[];
  whats_included: string[];

  // Curriculum - Modules
  modules: ModuleItem[];

  // Enrollment
  payment_methods: string[];
  payment_instructions: string;
  enrollment_form_fields: EnrollmentFormField[];
}

interface ComparisonFeature {
  feature: string;
  us: boolean;
  others: boolean;
}

interface TargetAudienceCard {
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  video_url: string;
  rating: number;
}

interface ValueItem {
  item: string;
  original_price: string;
  is_premium?: boolean;
  sub_text?: string;
}

interface EnrollmentFormField {
  id: string;
  label: string;
  type: 'text' | 'phone' | 'email' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ModuleItem {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const AVAILABLE_ICONS = [
  { value: 'GraduationCap', label: 'Graduation Cap', icon: GraduationCap },
  { value: 'Briefcase', label: 'Briefcase', icon: Briefcase },
  { value: 'BookOpen', label: 'Book', icon: BookOpen },
  { value: 'Laptop', label: 'Laptop', icon: Laptop },
  { value: 'Rocket', label: 'Rocket', icon: Rocket },
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'HelpCircle', label: 'Help', icon: HelpCircle },
];

const PAYMENT_METHODS = [
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Credit/Debit Card' },
];

// Icons for module cards (matching CurriculumAccordion)
const MODULE_ICONS = [
  { value: 'Database', label: 'Database', icon: Database },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Bot', label: 'Bot/AI', icon: Bot },
  { value: 'Share2', label: 'Share', icon: Share2 },
  { value: 'Mic', label: 'Microphone', icon: Mic },
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Layers', label: 'Layers', icon: Layers },
  { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'BookOpen', label: 'Book', icon: BookOpen },
  { value: 'Target', label: 'Target', icon: Target },
  { value: 'Rocket', label: 'Rocket', icon: Rocket },
  { value: 'Brain', label: 'Brain', icon: Brain },
  { value: 'Settings', label: 'Settings', icon: Settings },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Award', label: 'Award', icon: Award },
];

const getDefaultFormData = (): CourseFormData => ({
  title: '',
  slug: '',
  description: '',
  poster_url: '',
  promo_video_url: '',
  course_type: 'recorded',
  difficulty: '',
  status: 'draft',
  featured: false,
  upcoming: false,
  certificate: true,
  price_regular: '',
  price_offer: '',
  start_date: undefined,
  duration_text: '',
  module_count: '',
  instructor_name: '',
  instructor_title: '',
  instructor_bio: '',
  instructor_photo: '',
  learning_outcomes: [''],
  requirements: [''],
  topics: [''],
  comparison_features: [{ feature: '', us: true, others: false }],
  target_audience: [{ title: '', description: '', icon: 'GraduationCap' }],
  testimonials: [{ name: '', role: '', text: '', video_url: '', rating: 5 }],
          value_breakdown: [{ item: '', original_price: '', is_premium: false, sub_text: '' }],
  countdown_end_date: undefined,
  stats: { students: '', community: '', support: '' },
  faq: [{ question: '', answer: '' }],
  whats_included: [''],
  modules: [{ title: '', subtitle: '', description: '', icon: 'Database' }],
  payment_methods: [],
  payment_instructions: '',
  enrollment_form_fields: [],
});

const AdminCourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<CourseFormData>(getDefaultFormData());

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }, []);

  const fetchCourse = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          poster_url: data.poster_url || '',
          promo_video_url: data.promo_video_url || '',
          course_type: data.course_type || 'recorded',
          difficulty: data.difficulty || '',
          status: data.status || 'draft',
          featured: data.featured || false,
          upcoming: data.upcoming || false,
          certificate: data.certificate ?? true,
          price_regular: data.price_regular?.toString() || '',
          price_offer: data.price_offer?.toString() || '',
          start_date: data.start_date ? new Date(data.start_date) : undefined,
          duration_text: data.duration_text || '',
          module_count: data.module_count?.toString() || '',
          instructor_name: data.instructor_name || '',
          instructor_title: data.instructor_title || '',
          instructor_bio: data.instructor_bio || '',
          instructor_photo: data.instructor_photo || '',
          learning_outcomes: Array.isArray(data.learning_outcomes) && data.learning_outcomes.length > 0
            ? data.learning_outcomes as string[]
            : [''],
          requirements: Array.isArray(data.requirements) && data.requirements.length > 0
            ? data.requirements as string[]
            : [''],
          topics: Array.isArray(data.topics) && data.topics.length > 0
            ? data.topics as string[]
            : [''],
          comparison_features: Array.isArray(data.comparison_features) && data.comparison_features.length > 0
            ? data.comparison_features as ComparisonFeature[]
            : [{ feature: '', us: true, others: false }],
          target_audience: Array.isArray(data.target_audience) && data.target_audience.length > 0
            ? data.target_audience as TargetAudienceCard[]
            : [{ title: '', description: '', icon: 'GraduationCap' }],
          testimonials: Array.isArray(data.testimonials) && data.testimonials.length > 0
            ? data.testimonials as Testimonial[]
            : [{ name: '', role: '', text: '', video_url: '', rating: 5 }],
          value_breakdown: Array.isArray(data.value_breakdown) && data.value_breakdown.length > 0
            ? (data.value_breakdown as { item: string; original_price: number; is_premium?: boolean; sub_text?: string }[]).map(v => ({
                item: v.item,
                original_price: v.original_price?.toString() || '',
                is_premium: v.is_premium || false,
                sub_text: v.sub_text || ''
              }))
            : [{ item: '', original_price: '', is_premium: false, sub_text: '' }],
          countdown_end_date: data.countdown_end_date ? new Date(data.countdown_end_date) : undefined,
          stats: {
            students: (data.stats as Record<string, string>)?.students || '',
            community: (data.stats as Record<string, string>)?.community || '',
            support: (data.stats as Record<string, string>)?.support || '',
          },
          faq: Array.isArray(data.faq) && data.faq.length > 0
            ? data.faq as FAQItem[]
            : [{ question: '', answer: '' }],
          whats_included: Array.isArray(data.whats_included) && data.whats_included.length > 0
            ? data.whats_included as string[]
            : [''],
          modules: Array.isArray(data.modules) && data.modules.length > 0
            ? data.modules as ModuleItem[]
            : [{ title: '', subtitle: '', description: '', icon: 'Database' }],
          payment_methods: Array.isArray(data.payment_methods) ? data.payment_methods as string[] : [],
          payment_instructions: data.payment_instructions || '',
          enrollment_form_fields: Array.isArray(data.enrollment_form_fields)
            ? data.enrollment_form_fields as EnrollmentFormField[]
            : [],
        });
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course data');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Fetch existing course data
  useEffect(() => {
    if (isEditing && id) {
      fetchCourse();
    }
  }, [id, isEditing, fetchCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Course title is required');
      setActiveTab('basic');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Course slug is required');
      setActiveTab('basic');
      return;
    }

    setSaving(true);

    try {
      // Prepare data for submission
      const courseData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        poster_url: formData.poster_url.trim() || null,
        promo_video_url: formData.promo_video_url.trim() || null,
        course_type: formData.course_type,
        difficulty: formData.difficulty || null,
        status: formData.status,
        featured: formData.featured,
        upcoming: formData.upcoming,
        certificate: formData.certificate,
        price_regular: formData.price_regular ? parseFloat(formData.price_regular) : null,
        price_offer: formData.price_offer ? parseFloat(formData.price_offer) : null,
        start_date: formData.start_date ? format(formData.start_date, 'yyyy-MM-dd') : null,
        duration_text: formData.duration_text.trim() || null,
        module_count: formData.module_count ? parseInt(formData.module_count) : null,
        instructor_name: formData.instructor_name.trim() || null,
        instructor_title: formData.instructor_title.trim() || null,
        instructor_bio: formData.instructor_bio.trim() || null,
        instructor_photo: formData.instructor_photo.trim() || null,
        learning_outcomes: formData.learning_outcomes.filter(o => o.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        topics: formData.topics.filter(t => t.trim()),
        comparison_features: formData.comparison_features.filter(c => c.feature.trim()),
        target_audience: formData.target_audience.filter(t => t.title.trim()),
        testimonials: formData.testimonials.filter(t => t.name.trim()),
        value_breakdown: formData.value_breakdown
          .filter(v => v.item.trim())
          .map(v => ({
            item: v.item,
            original_price: v.original_price ? parseFloat(v.original_price) : 0,
            is_premium: v.is_premium || false,
            sub_text: v.sub_text?.trim() || undefined,
          })),
        countdown_end_date: formData.countdown_end_date
          ? formData.countdown_end_date.toISOString()
          : null,
        stats: {
          students: formData.stats.students || null,
          community: formData.stats.community || null,
          support: formData.stats.support || null,
        },
        faq: formData.faq.filter(f => f.question.trim() && f.answer.trim()),
        whats_included: formData.whats_included.filter(w => w.trim()),
        modules: formData.modules.filter(m => m.title.trim()),
        payment_methods: formData.payment_methods,
        payment_instructions: formData.payment_instructions.trim() || null,
        enrollment_form_fields: formData.enrollment_form_fields,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Course updated successfully');
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;
        toast.success('Course created successfully');
        navigate('/admin/courses');
      }
    } catch (error: unknown) {
      console.error('Error saving course:', error);
      const message = error instanceof Error ? error.message : 'Failed to save course';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Helper function to update array fields
  const updateArrayField = <T,>(
    field: keyof CourseFormData,
    index: number,
    value: T
  ) => {
    setFormData(prev => {
      const arr = [...(prev[field] as T[])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = <T,>(field: keyof CourseFormData, defaultItem: T) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as T[]), defaultItem],
    }));
  };

  const removeArrayItem = (field: keyof CourseFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as unknown[]).filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Course' : 'New Course'}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Edit Course' : 'New Course'}>
      <SEOHead
        title={isEditing ? 'Edit Course - Admin' : 'New Course - Admin'}
        description="Manage course details"
        url={isEditing ? `/admin/courses/${id}/edit` : '/admin/courses/new'}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" asChild>
              <Link to="/admin/courses">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Edit Course' : 'Create New Course'}
              </h1>
              {isEditing && (
                <p className="text-sm text-muted-foreground">
                  Editing: {formData.title || 'Untitled'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing && formData.status === 'published' && (
              <Button type="button" variant="outline" asChild>
                <a href={`/courses/${formData.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Course
                </a>
              </Button>
            )}
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Course'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="basic" className="flex items-center gap-2 py-3">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="instructor" className="flex items-center gap-2 py-3">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Instructor</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2 py-3">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex items-center gap-2 py-3">
              <ListOrdered className="w-4 h-4" />
              <span className="hidden sm:inline">Curriculum</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2 py-3">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Marketing</span>
            </TabsTrigger>
            <TabsTrigger value="enrollment" className="flex items-center gap-2 py-3">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Enrollment</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Basic Info */}
          <TabsContent value="basic" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                    <CardDescription>Basic information about your course</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="title">Course Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              title,
                              slug: isEditing ? prev.slug : generateSlug(title),
                            }));
                          }}
                          placeholder="e.g., Complete Web Development Bootcamp"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="slug">URL Slug *</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">/courses/</span>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                            }))}
                            placeholder="course-slug"
                            required
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your course in detail. You can use markdown formatting..."
                          rows={8}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports markdown: **bold** for purple highlights, ## for headings, ### for subheadings, - for bullet points
                        </p>
                        
                        {/* Premium Description Format Guide */}
                        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                          <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Premium Description Format
                          </h4>
                          <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
                            Use this structure for a premium look on the course page:
                          </p>
                          <pre className="text-xs bg-white dark:bg-slate-900 p-3 rounded border overflow-x-auto text-slate-700 dark:text-slate-300">
{`## Main Heading
**Highlighted text** — regular text

### Purple Subheading
- **Bold point:** description
- Regular bullet point
- **Another bold:** more text`}</pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Course poster and promotional content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="poster_url">Poster Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="poster_url"
                          type="url"
                          value={formData.poster_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, poster_url: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      {formData.poster_url && (
                        <div className="mt-3 relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                          <img
                            src={formData.poster_url}
                            alt="Course poster preview"
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="promo_video_url">Promo Video URL</Label>
                      <Input
                        id="promo_video_url"
                        type="url"
                        value={formData.promo_video_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, promo_video_url: e.target.value }))}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        YouTube or Vimeo URL
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>Set your course pricing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="price_regular">Regular Price ($)</Label>
                        <Input
                          id="price_regular"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price_regular}
                          onChange={(e) => setFormData(prev => ({ ...prev, price_regular: e.target.value }))}
                          placeholder="15000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price_offer">Offer Price ($)</Label>
                        <Input
                          id="price_offer"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price_offer}
                          onChange={(e) => setFormData(prev => ({ ...prev, price_offer: e.target.value }))}
                          placeholder="7999"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status & Visibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: 'draft' | 'published' | 'archived') =>
                          setFormData(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Featured</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, featured: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="upcoming">Upcoming</Label>
                      <Switch
                        id="upcoming"
                        checked={formData.upcoming}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, upcoming: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="certificate">Certificate</Label>
                      <Switch
                        id="certificate"
                        checked={formData.certificate}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, certificate: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="course_type">Course Type</Label>
                      <Select
                        value={formData.course_type}
                        onValueChange={(value: 'live' | 'recorded' | 'hybrid') =>
                          setFormData(prev => ({ ...prev, course_type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="recorded">Recorded</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                          setFormData(prev => ({ ...prev, difficulty: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration_text">Duration</Label>
                      <Input
                        id="duration_text"
                        value={formData.duration_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration_text: e.target.value }))}
                        placeholder="e.g., 12 weeks"
                      />
                    </div>
                    <div>
                      <Label htmlFor="module_count">Module Count</Label>
                      <Input
                        id="module_count"
                        type="number"
                        min="0"
                        value={formData.module_count}
                        onChange={(e) => setFormData(prev => ({ ...prev, module_count: e.target.value }))}
                        placeholder="24"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !formData.start_date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.start_date ? format(formData.start_date, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.start_date}
                            onSelect={(date) =>
                              setFormData(prev => ({ ...prev, start_date: date }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Instructor */}
          <TabsContent value="instructor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Instructor Information</CardTitle>
                <CardDescription>Details about the course instructor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="instructor_name">Name</Label>
                      <Input
                        id="instructor_name"
                        value={formData.instructor_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructor_name: e.target.value }))}
                        placeholder="Sarah Rahman"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor_title">Title</Label>
                      <Input
                        id="instructor_title"
                        value={formData.instructor_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructor_title: e.target.value }))}
                        placeholder="Senior Software Engineer & Educator"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor_bio">Bio</Label>
                      <Textarea
                        id="instructor_bio"
                        value={formData.instructor_bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructor_bio: e.target.value }))}
                        placeholder="Tell students about the instructor's background, experience, and teaching style..."
                        rows={5}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="instructor_photo">Photo URL</Label>
                      <Input
                        id="instructor_photo"
                        type="url"
                        value={formData.instructor_photo}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructor_photo: e.target.value }))}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    {formData.instructor_photo && (
                      <div className="flex justify-center">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-muted">
                          <img
                            src={formData.instructor_photo}
                            alt="Instructor photo preview"
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Content */}
          <TabsContent value="content" className="mt-6">
            <div className="space-y-6">
              {/* Learning Outcomes */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Outcomes</CardTitle>
                  <CardDescription>What students will learn from this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.learning_outcomes.map((outcome, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex items-center text-muted-foreground">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <Input
                          value={outcome}
                          onChange={(e) => updateArrayField('learning_outcomes', index, e.target.value)}
                          placeholder="e.g., Build responsive websites from scratch"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('learning_outcomes', index)}
                          disabled={formData.learning_outcomes.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('learning_outcomes', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Outcome
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>Prerequisites for taking this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex items-center text-muted-foreground">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <Input
                          value={req}
                          onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                          placeholder="e.g., Basic computer literacy"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('requirements', index)}
                          disabled={formData.requirements.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('requirements', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Requirement
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Topics/Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Topics & Tags</CardTitle>
                  <CardDescription>Technologies and topics covered</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.topics.filter(t => t.trim()).map((topic, index) => (
                        <Badge key={index} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    {formData.topics.map((topic, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={topic}
                          onChange={(e) => updateArrayField('topics', index, e.target.value)}
                          placeholder="e.g., React, JavaScript, CSS"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('topics', index)}
                          disabled={formData.topics.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('topics', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Topic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 4: Curriculum */}
          <TabsContent value="curriculum" className="mt-6">
            <div className="space-y-6">
              {/* Module Cards Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Module Cards</CardTitle>
                  <CardDescription>
                    Define how module cards appear on the course landing page. Each module gets a purple gradient card with icon, title, subtitle, and description.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.modules.map((module, index) => {
                    const SelectedIcon = MODULE_ICONS.find(i => i.value === module.icon)?.icon || Database;
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0">
                            <SelectedIcon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-lg">Module {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('modules', index)}
                            className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={formData.modules.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label>Module Title</Label>
                            <Input
                              value={module.title}
                              onChange={(e) => updateArrayItem('modules', index, { ...module, title: e.target.value })}
                              placeholder="Fundamentals of n8n"
                            />
                          </div>
                          <div>
                            <Label>Icon</Label>
                            <Select
                              value={module.icon}
                              onValueChange={(value) => updateArrayItem('modules', index, { ...module, icon: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MODULE_ICONS.map((iconOption) => {
                                  const IconComp = iconOption.icon;
                                  return (
                                    <SelectItem key={iconOption.value} value={iconOption.value}>
                                      <div className="flex items-center gap-2">
                                        <IconComp className="w-4 h-4" />
                                        <span>{iconOption.label}</span>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Label>Subtitle (short summary)</Label>
                          <Input
                            value={module.subtitle}
                            onChange={(e) => updateArrayItem('modules', index, { ...module, subtitle: e.target.value })}
                            placeholder="n8n introduction, AI workflow setup, and API configurations"
                          />
                        </div>

                        <div className="mt-3">
                          <Label>Description (longer explanation)</Label>
                          <Textarea
                            value={module.description}
                            onChange={(e) => updateArrayItem('modules', index, { ...module, description: e.target.value })}
                            placeholder="Setup the Google, OpenAI, and Gemini APIs by learning the basics of the n8n platform."
                            rows={2}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('modules', { title: '', subtitle: '', description: '', icon: 'Database' })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                </CardContent>
              </Card>

              {/* Lesson Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Lessons</CardTitle>
                  <CardDescription>Manage individual lessons for each module</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="text-center py-8">
                      <ListOrdered className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Manage Lessons</h3>
                      <p className="text-muted-foreground mb-4">
                        Lessons are managed separately. Each lesson title should start with "Module X:" to group them.
                      </p>
                      <Button type="button" asChild>
                        <Link to={`/admin/courses/${id}/lessons`}>
                          <ListOrdered className="w-4 h-4 mr-2" />
                          Manage Lessons
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ListOrdered className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Save Course First</h3>
                      <p className="text-muted-foreground">
                        Save the course to enable lesson management.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 5: Marketing */}
          <TabsContent value="marketing" className="mt-6">
            <div className="space-y-6">
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Stats</CardTitle>
                  <CardDescription>Display stats on the landing page</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="stats_students">Students Count</Label>
                      <Input
                        id="stats_students"
                        value={formData.stats.students}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          stats: { ...prev.stats, students: e.target.value }
                        }))}
                        placeholder="12500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stats_community">Community</Label>
                      <Input
                        id="stats_community"
                        value={formData.stats.community}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          stats: { ...prev.stats, community: e.target.value }
                        }))}
                        placeholder="Active Discord"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stats_support">Support</Label>
                      <Input
                        id="stats_support"
                        value={formData.stats.support}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          stats: { ...prev.stats, support: e.target.value }
                        }))}
                        placeholder="24/7 Help"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Countdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Countdown Timer</CardTitle>
                  <CardDescription>Set an end date for the offer countdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>Countdown End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full max-w-sm justify-start text-left font-normal',
                            !formData.countdown_end_date && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.countdown_end_date
                            ? format(formData.countdown_end_date, 'PPP')
                            : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.countdown_end_date}
                          onSelect={(date) =>
                            setFormData(prev => ({ ...prev, countdown_end_date: date }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {/* Comparison Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparison Features</CardTitle>
                  <CardDescription>Compare your course with others</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[1fr,80px,80px,40px] gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
                      <span>Feature</span>
                      <span className="text-center">Us</span>
                      <span className="text-center">Others</span>
                      <span></span>
                    </div>
                    {formData.comparison_features.map((feature, index) => (
                      <div key={index} className="grid grid-cols-[1fr,80px,80px,40px] gap-2 items-center">
                        <Input
                          value={feature.feature}
                          onChange={(e) =>
                            updateArrayField('comparison_features', index, {
                              ...feature,
                              feature: e.target.value,
                            })
                          }
                          placeholder="e.g., Live instructor sessions"
                        />
                        <div className="flex justify-center">
                          <Switch
                            checked={feature.us}
                            onCheckedChange={(checked) =>
                              updateArrayField('comparison_features', index, {
                                ...feature,
                                us: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={feature.others}
                            onCheckedChange={(checked) =>
                              updateArrayField('comparison_features', index, {
                                ...feature,
                                others: checked,
                              })
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('comparison_features', index)}
                          disabled={formData.comparison_features.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem('comparison_features', { feature: '', us: true, others: false })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                  <CardDescription>Who is this course for?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.target_audience.map((audience, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="flex-1 space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={audience.title}
                                onChange={(e) =>
                                  updateArrayField('target_audience', index, {
                                    ...audience,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="e.g., Complete Beginners"
                              />
                            </div>
                            <div>
                              <Label>Icon</Label>
                              <Select
                                value={audience.icon}
                                onValueChange={(value) =>
                                  updateArrayField('target_audience', index, {
                                    ...audience,
                                    icon: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select icon" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AVAILABLE_ICONS.map((icon) => (
                                    <SelectItem key={icon.value} value={icon.value}>
                                      <div className="flex items-center gap-2">
                                        <icon.icon className="w-4 h-4" />
                                        {icon.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={audience.description}
                              onChange={(e) =>
                                updateArrayField('target_audience', index, {
                                  ...audience,
                                  description: e.target.value,
                                })
                              }
                              placeholder="e.g., No coding experience? Perfect!"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('target_audience', index)}
                          disabled={formData.target_audience.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem('target_audience', {
                          title: '',
                          description: '',
                          icon: 'GraduationCap',
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Audience
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle>Testimonials</CardTitle>
                  <CardDescription>Student reviews and video testimonials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.testimonials.map((testimonial, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="flex-1 space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={testimonial.name}
                                onChange={(e) =>
                                  updateArrayField('testimonials', index, {
                                    ...testimonial,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="e.g., John Doe"
                              />
                            </div>
                            <div>
                              <Label>Role</Label>
                              <Input
                                value={testimonial.role}
                                onChange={(e) =>
                                  updateArrayField('testimonials', index, {
                                    ...testimonial,
                                    role: e.target.value,
                                  })
                                }
                                placeholder="e.g., Frontend Developer"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Testimonial Text</Label>
                            <Textarea
                              value={testimonial.text}
                              onChange={(e) =>
                                updateArrayField('testimonials', index, {
                                  ...testimonial,
                                  text: e.target.value,
                                })
                              }
                              placeholder="What the student says about the course..."
                              rows={2}
                            />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <Label>Video URL (optional)</Label>
                              <Input
                                value={testimonial.video_url}
                                onChange={(e) =>
                                  updateArrayField('testimonials', index, {
                                    ...testimonial,
                                    video_url: e.target.value,
                                  })
                                }
                                placeholder="https://youtube.com/..."
                              />
                            </div>
                            <div>
                              <Label>Rating</Label>
                              <Select
                                value={testimonial.rating.toString()}
                                onValueChange={(value) =>
                                  updateArrayField('testimonials', index, {
                                    ...testimonial,
                                    rating: parseInt(value),
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[5, 4, 3, 2, 1].map((rating) => (
                                    <SelectItem key={rating} value={rating.toString()}>
                                      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('testimonials', index)}
                          disabled={formData.testimonials.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem('testimonials', {
                          name: '',
                          role: '',
                          text: '',
                          video_url: '',
                          rating: 5,
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Testimonial
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Value Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Value Breakdown</CardTitle>
                  <CardDescription>Show the total value of everything included</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.value_breakdown.map((item, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-lg bg-card">
                        <div className="flex gap-2">
                          <Input
                            value={item.item}
                            onChange={(e) =>
                              updateArrayField('value_breakdown', index, {
                                ...item,
                                item: e.target.value,
                              })
                            }
                            placeholder="e.g., 24+ Hours Video Content"
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            min="0"
                            value={item.original_price}
                            onChange={(e) =>
                              updateArrayField('value_breakdown', index, {
                                ...item,
                                original_price: e.target.value,
                              })
                            }
                            placeholder="Price"
                            className="w-32"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeArrayItem('value_breakdown', index)}
                            disabled={formData.value_breakdown.length === 1}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`premium-${index}`}
                              checked={item.is_premium || false}
                              onCheckedChange={(checked) =>
                                updateArrayField('value_breakdown', index, {
                                  ...item,
                                  is_premium: checked as boolean,
                                })
                              }
                            />
                            <Label htmlFor={`premium-${index}`} className="text-sm font-normal cursor-pointer">
                              Premium (Crown Icon)
                            </Label>
                          </div>
                          <Input
                            value={item.sub_text || ''}
                            onChange={(e) =>
                              updateArrayField('value_breakdown', index, {
                                ...item,
                                sub_text: e.target.value,
                              })
                            }
                            placeholder="Sub-text (e.g., Usually $240)"
                            className="flex-1 max-w-xs"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addArrayItem('value_breakdown', { item: '', original_price: '', is_premium: false, sub_text: '' })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                  <CardDescription>List of items included in the course (shown in pricing section)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.whats_included.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex items-center text-muted-foreground">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <Input
                          value={item}
                          onChange={(e) => updateArrayField('whats_included', index, e.target.value)}
                          placeholder="e.g., 24+ hours of HD video content"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('whats_included', index)}
                          disabled={formData.whats_included.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('whats_included', '')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Common questions and answers about the course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.faq.map((faqItem, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label>Question</Label>
                            <Input
                              value={faqItem.question}
                              onChange={(e) =>
                                updateArrayField('faq', index, {
                                  ...faqItem,
                                  question: e.target.value,
                                })
                              }
                              placeholder="e.g., Do I need prior experience?"
                            />
                          </div>
                          <div>
                            <Label>Answer</Label>
                            <Textarea
                              value={faqItem.answer}
                              onChange={(e) =>
                                updateArrayField('faq', index, {
                                  ...faqItem,
                                  answer: e.target.value,
                                })
                              }
                              placeholder="e.g., Not at all! This course is designed for complete beginners..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('faq', index)}
                          disabled={formData.faq.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('faq', { question: '', answer: '' })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 6: Enrollment */}
          <TabsContent value="enrollment" className="mt-6">
            <div className="space-y-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Select accepted payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {PAYMENT_METHODS.map((method) => (
                      <div
                        key={method.value}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <Checkbox
                          id={method.value}
                          checked={formData.payment_methods.includes(method.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({
                                ...prev,
                                payment_methods: [...prev.payment_methods, method.value],
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                payment_methods: prev.payment_methods.filter(m => m !== method.value),
                              }));
                            }
                          }}
                        />
                        <Label
                          htmlFor={method.value}
                          className="flex-1 cursor-pointer font-normal"
                        >
                          {method.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Instructions</CardTitle>
                  <CardDescription>Instructions shown to students during enrollment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.payment_instructions}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, payment_instructions: e.target.value }))
                    }
                    placeholder="e.g., Send payment to 01XXXXXXXXX (bKash/Nagad) or Bank: ABC Bank, Account: 1234567890"
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Custom Form Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Enrollment Form Fields</CardTitle>
                  <CardDescription>Additional fields to collect from students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.enrollment_form_fields.map((field, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="flex-1 space-y-3">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div>
                              <Label>Field ID</Label>
                              <Input
                                value={field.id}
                                onChange={(e) => {
                                  const updated = [...formData.enrollment_form_fields];
                                  updated[index] = { ...field, id: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                                  setFormData(prev => ({ ...prev, enrollment_form_fields: updated }));
                                }}
                                placeholder="e.g., phone"
                              />
                            </div>
                            <div>
                              <Label>Label</Label>
                              <Input
                                value={field.label}
                                onChange={(e) => {
                                  const updated = [...formData.enrollment_form_fields];
                                  updated[index] = { ...field, label: e.target.value };
                                  setFormData(prev => ({ ...prev, enrollment_form_fields: updated }));
                                }}
                                placeholder="e.g., Phone Number"
                              />
                            </div>
                            <div>
                              <Label>Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value: 'text' | 'phone' | 'email' | 'select' | 'textarea') => {
                                  const updated = [...formData.enrollment_form_fields];
                                  updated[index] = { ...field, type: value };
                                  setFormData(prev => ({ ...prev, enrollment_form_fields: updated }));
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="phone">Phone</SelectItem>
                                  <SelectItem value="select">Select</SelectItem>
                                  <SelectItem value="textarea">Textarea</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`required-${index}`}
                                checked={field.required}
                                onCheckedChange={(checked) => {
                                  const updated = [...formData.enrollment_form_fields];
                                  updated[index] = { ...field, required: checked as boolean };
                                  setFormData(prev => ({ ...prev, enrollment_form_fields: updated }));
                                }}
                              />
                              <Label htmlFor={`required-${index}`} className="font-normal">
                                Required
                              </Label>
                            </div>
                          </div>
                          {field.type === 'select' && (
                            <div>
                              <Label>Options (comma-separated)</Label>
                              <Input
                                value={field.options?.join(', ') || ''}
                                onChange={(e) => {
                                  const updated = [...formData.enrollment_form_fields];
                                  updated[index] = {
                                    ...field,
                                    options: e.target.value.split(',').map(o => o.trim()).filter(Boolean),
                                  };
                                  setFormData(prev => ({ ...prev, enrollment_form_fields: updated }));
                                }}
                                placeholder="e.g., Option 1, Option 2, Option 3"
                              />
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              enrollment_form_fields: prev.enrollment_form_fields.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          enrollment_form_fields: [
                            ...prev.enrollment_form_fields,
                            { id: '', label: '', type: 'text', required: false },
                          ],
                        }));
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Custom Field
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Save Button (mobile) */}
        <div className="lg:hidden sticky bottom-4">
          <Button type="submit" disabled={saving} className="w-full shadow-lg">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Course'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCourseEditor;

