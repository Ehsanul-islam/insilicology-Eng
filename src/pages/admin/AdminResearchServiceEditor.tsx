import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { TagInput } from '@/components/admin/TagInput';
import { JSONArrayEditor } from '@/components/admin/JSONArrayEditor';
import {
  useResearchServices,
  type ResearchServiceInput,
} from '@/hooks/useResearchServices';
import { researchIconNames, getResearchIcon } from '@/data/researchIcons';

function normalizeSampleAnalysesForForm(
  raw: unknown,
): ResearchServiceInput['sample_analyses'] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry) => {
    const item = entry as Record<string, unknown>;
    const fromImages = Array.isArray(item.images)
      ? item.images.filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
      : [];
    const legacy =
      typeof item.image === 'string' && item.image.trim().length > 0 ? item.image.trim() : '';
    const images = fromImages.length > 0 ? fromImages : legacy ? [legacy] : [];
    return {
      title: String(item.title ?? ''),
      description: String(item.description ?? ''),
      images,
      caption:
        typeof item.caption === 'string'
          ? item.caption
          : item.caption != null
            ? String(item.caption)
            : '',
    };
  });
}

const STYLE_PRESETS: Array<{
  label: string;
  color: string;
  bg: string;
  cardClass: string;
  accent: string;
}> = [
  {
    label: 'Blue / Cyan',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    cardClass: 'bg-blue-500/[0.04] border-blue-500/20',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Purple / Fuchsia',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    cardClass: 'bg-purple-500/[0.04] border-purple-500/20',
    accent: 'from-purple-500 to-fuchsia-500',
  },
  {
    label: 'Green / Emerald',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    cardClass: 'bg-green-500/[0.04] border-green-500/20',
    accent: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Red / Orange',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    cardClass: 'bg-red-500/[0.04] border-red-500/20',
    accent: 'from-red-500 to-orange-500',
  },
  {
    label: 'Cyan / Sky',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    cardClass: 'bg-cyan-500/[0.04] border-cyan-500/20',
    accent: 'from-cyan-500 to-sky-500',
  },
  {
    label: 'Amber / Yellow',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    cardClass: 'bg-amber-500/[0.04] border-amber-500/20',
    accent: 'from-amber-500 to-yellow-500',
  },
  {
    label: 'Indigo / Blue',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    cardClass: 'bg-indigo-500/[0.04] border-indigo-500/20',
    accent: 'from-indigo-500 to-blue-500',
  },
  {
    label: 'Teal / Emerald',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    cardClass: 'bg-teal-500/[0.04] border-teal-500/20',
    accent: 'from-teal-500 to-emerald-500',
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const emptyForm = (): ResearchServiceInput => ({
  slug: '',
  title: '',
  short_title: '',
  description: '',
  summary: '',
  image: '',
  price: 'Custom quote',
  timeline: '',
  icon: 'Atom',
  color: STYLE_PRESETS[0].color,
  bg: STYLE_PRESETS[0].bg,
  card_class: STYLE_PRESETS[0].cardClass,
  accent: STYLE_PRESETS[0].accent,
  seo_title: '',
  seo_description: '',
  overview_bullets: [],
  service_types: [],
  sample_analyses: [],
  client_requirements: [],
  deliverables: [],
  tools: [],
  faqs: [],
  status: 'draft',
  display_order: 0,
});

const AdminResearchServiceEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { fetchServiceById, createService, updateService } = useResearchServices();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ResearchServiceInput>(emptyForm());

  useEffect(() => {
    const load = async () => {
      if (!isEditing || !id) return;
      setLoading(true);
      try {
        const row = await fetchServiceById(id);
        if (row) {
          setForm({
            slug: row.slug || '',
            title: row.title || '',
            short_title: row.short_title || '',
            description: row.description || '',
            summary: row.summary || '',
            image: row.image || '',
            price: row.price || 'Custom quote',
            timeline: row.timeline || '',
            icon: row.icon || 'Atom',
            color: row.color || STYLE_PRESETS[0].color,
            bg: row.bg || STYLE_PRESETS[0].bg,
            card_class: row.card_class || STYLE_PRESETS[0].cardClass,
            accent: row.accent || STYLE_PRESETS[0].accent,
            seo_title: row.seo_title || '',
            seo_description: row.seo_description || '',
            overview_bullets: Array.isArray(row.overview_bullets) ? row.overview_bullets : [],
            service_types: Array.isArray(row.service_types) ? row.service_types : [],
            sample_analyses: normalizeSampleAnalysesForForm(row.sample_analyses),
            client_requirements: Array.isArray(row.client_requirements)
              ? row.client_requirements
              : [],
            deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
            tools: Array.isArray(row.tools) ? row.tools : [],
            faqs: Array.isArray(row.faqs) ? row.faqs : [],
            status: row.status || 'draft',
            display_order: row.display_order ?? 0,
          });
        }
      } catch {
        toast.error('Failed to load service');
      } finally {
        setLoading(false);
      }
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const update = <K extends keyof ResearchServiceInput>(
    key: K,
    value: ResearchServiceInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const applyPreset = (label: string) => {
    const preset = STYLE_PRESETS.find((p) => p.label === label);
    if (!preset) return;
    setForm((prev) => ({
      ...prev,
      color: preset.color,
      bg: preset.bg,
      card_class: preset.cardClass,
      accent: preset.accent,
    }));
  };

  const currentPreset = useMemo(
    () =>
      STYLE_PRESETS.find(
        (p) =>
          p.color === form.color &&
          p.bg === form.bg &&
          p.cardClass === form.card_class &&
          p.accent === form.accent,
      )?.label ?? '',
    [form.color, form.bg, form.card_class, form.accent],
  );

  const validate = (): boolean => {
    if (!form.title.trim()) return toast.error('Title is required'), false;
    if (!form.slug.trim()) return toast.error('Slug is required'), false;
    if (!/^[a-z0-9-]+$/.test(form.slug))
      return toast.error('Slug must be lowercase letters, numbers, and dashes only'), false;
    if (!form.description.trim()) return toast.error('Short description is required'), false;
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload: ResearchServiceInput = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        short_title: (form.short_title || form.title).trim(),
        description: form.description.trim(),
        summary: form.summary.trim(),
        image: form.image.trim(),
        timeline: form.timeline.trim(),
        price: form.price.trim() || 'Custom quote',
        seo_title: form.seo_title.trim() || form.title.trim(),
        seo_description: form.seo_description.trim() || form.description.trim(),
        sample_analyses: form.sample_analyses.map((a) => {
          const images = (Array.isArray(a.images) ? a.images : [])
            .map((u) => String(u).trim())
            .filter(Boolean);
          return {
            title: a.title.trim(),
            description: a.description.trim(),
            ...(images.length > 0 ? { images } : {}),
            ...(a.caption?.trim() ? { caption: a.caption.trim() } : {}),
          };
        }),
      };

      if (isEditing && id) {
        await updateService(id, payload);
        toast.success('Service updated');
      } else {
        await createService(payload);
        toast.success('Service created');
      }
      navigate('/admin/research-services');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`${isEditing ? 'Failed to update' : 'Failed to create'}: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Service' : 'New Service'}>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const PreviewIcon = getResearchIcon(form.icon);

  return (
    <>
      <SEOHead
        title={`Admin - ${isEditing ? 'Edit' : 'New'} Research Service`}
        description="Manage research service detail pages"
        robots="noindex,nofollow"
      />
      <AdminLayout title={isEditing ? 'Edit Research Service' : 'New Research Service'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/research-services')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : isEditing ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={form.title}
                        onChange={(e) => {
                          const v = e.target.value;
                          update('title', v);
                          if (!isEditing && (!form.slug || form.slug === slugify(form.title))) {
                            update('slug', slugify(v));
                          }
                        }}
                        placeholder="Molecular Dynamics (MD)"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Short Title</Label>
                      <Input
                        value={form.short_title}
                        onChange={(e) => update('short_title', e.target.value)}
                        placeholder="MD Simulation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Slug <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={form.slug}
                      onChange={(e) => update('slug', slugify(e.target.value))}
                      placeholder="molecular-dynamics"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: <code>/research/{form.slug || 'your-slug'}</code>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Short Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      placeholder="One-line description shown on cards and the hero."
                      rows={2}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Detailed Summary</Label>
                    <Textarea
                      value={form.summary}
                      onChange={(e) => update('summary', e.target.value)}
                      placeholder="A longer summary shown above the bullet points."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hero / Card Image</Label>
                    <ImageUploader
                      value={form.image}
                      onChange={(url) =>
                        update('image', Array.isArray(url) ? url[0] || '' : url)
                      }
                      label="Service Image"
                      folder="research-service-images"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        value={form.price}
                        onChange={(e) => update('price', e.target.value)}
                        placeholder="Custom quote"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timeline</Label>
                      <Input
                        value={form.timeline}
                        onChange={(e) => update('timeline', e.target.value)}
                        placeholder="7-14 working days"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content arrays */}
              <Card>
                <CardHeader>
                  <CardTitle>Overview Bullets</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagInput
                    tags={form.overview_bullets}
                    onChange={(t) => update('overview_bullets', t)}
                    placeholder="Add a bullet point and press Enter"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <JSONArrayEditor
                    value={form.service_types}
                    onChange={(v) => update('service_types', v)}
                    label="Service Types"
                    itemLabel="Type"
                    fields={[
                      {
                        name: 'title',
                        label: 'Title',
                        type: 'text',
                        placeholder: 'Protein-ligand complex MD',
                        required: true,
                      },
                      {
                        name: 'description',
                        label: 'Description',
                        type: 'textarea',
                        placeholder: 'What this workflow covers...',
                        required: true,
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sample Analyses (Outputs & Figures)</CardTitle>
                </CardHeader>
                <CardContent>
                  <JSONArrayEditor
                    value={form.sample_analyses}
                    onChange={(v) => update('sample_analyses', v)}
                    label="Sample Analyses"
                    itemLabel="Analysis"
                    fields={[
                      {
                        name: 'title',
                        label: 'Title',
                        type: 'text',
                        placeholder: 'RMSD',
                        required: true,
                      },
                      {
                        name: 'description',
                        label: 'Description',
                        type: 'textarea',
                        placeholder: 'What this analysis shows...',
                        required: true,
                      },
                      {
                        name: 'images',
                        label: 'Image URLs (add as many as you need)',
                        type: 'tags',
                        placeholder: 'Paste image URL and press Enter or Add',
                      },
                      {
                        name: 'caption',
                        label: 'Caption (optional)',
                        type: 'text',
                        placeholder: 'RMSD plot example for trajectory stability review.',
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What We Need From You</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagInput
                    tags={form.client_requirements}
                    onChange={(t) => update('client_requirements', t)}
                    placeholder="e.g. Target protein structure or UniProt/PDB identifier."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deliverables</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagInput
                    tags={form.deliverables}
                    onChange={(t) => update('deliverables', t)}
                    placeholder="e.g. Trajectory analysis plots"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tools & Software</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagInput
                    tags={form.tools}
                    onChange={(t) => update('tools', t)}
                    placeholder="e.g. GROMACS"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQs</CardTitle>
                </CardHeader>
                <CardContent>
                  <JSONArrayEditor
                    value={form.faqs}
                    onChange={(v) => update('faqs', v)}
                    label="FAQs"
                    itemLabel="FAQ"
                    fields={[
                      {
                        name: 'question',
                        label: 'Question',
                        type: 'text',
                        placeholder: 'Which MD analyses can you include?',
                        required: true,
                      },
                      {
                        name: 'answer',
                        label: 'Answer',
                        type: 'textarea',
                        placeholder: 'Common outputs include...',
                        required: true,
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>SEO Title</Label>
                    <Input
                      value={form.seo_title}
                      onChange={(e) => update('seo_title', e.target.value)}
                      placeholder="Falls back to the title if empty."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SEO Description</Label>
                    <Textarea
                      value={form.seo_description}
                      onChange={(e) => update('seo_description', e.target.value)}
                      placeholder="Falls back to the short description if empty."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(value: 'draft' | 'published' | 'archived') =>
                        update('status', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Only "Published" services appear on /research and the public detail pages.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={form.display_order}
                      onChange={(e) =>
                        update('display_order', parseInt(e.target.value, 10) || 0)
                      }
                      min={0}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Style & Icon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={form.icon}
                      onValueChange={(value) => update('icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {researchIconNames.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Color Preset</Label>
                    <Select
                      value={currentPreset}
                      onValueChange={applyPreset}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a color preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {STYLE_PRESETS.map((p) => (
                          <SelectItem key={p.label} value={p.label}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Sets icon color, background, card style, and accent gradient.
                    </p>
                  </div>

                  {/* Live preview */}
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Preview
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${form.accent} text-white shadow-md`}
                      >
                        <PreviewIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{form.title || 'Service title'}</p>
                        <p className="text-xs text-muted-foreground">
                          {form.short_title || 'Short title'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </AdminLayout>
    </>
  );
};

export default AdminResearchServiceEditor;
