import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, ArrowLeft, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import SEOHead from '@/components/SEOHead';
import { useUpcomingPrograms, UpcomingProgramInsert } from '@/hooks/useUpcomingPrograms';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { cn } from '@/lib/utils';

const AdminProgramEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    fetchProgramById,
    createProgram,
    updateProgram,
  } = useUpcomingPrograms();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    start_date: new Date(),
    registration_link: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    display_order: 0,
  });

  useEffect(() => {
    if (isEditing && id) {
      loadProgram();
    }
  }, [id, isEditing]);

  const loadProgram = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const program = await fetchProgramById(id);
      if (program) {
        setFormData({
          title: program.title || '',
          image_url: program.image_url || '',
          start_date: program.start_date ? new Date(program.start_date) : new Date(),
          registration_link: program.registration_link || '',
          status: program.status || 'draft',
          display_order: program.display_order || 0,
        });
      }
    } catch (error) {
      toast.error('Failed to load program');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.image_url.trim()) {
      toast.error('Image URL is required');
      return false;
    }
    if (!formData.start_date) {
      toast.error('Start date is required');
      return false;
    }
    if (!formData.registration_link.trim()) {
      toast.error('Registration link is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    try {
      const programData: UpcomingProgramInsert = {
        title: formData.title.trim(),
        image_url: formData.image_url.trim(),
        start_date: format(formData.start_date, 'yyyy-MM-dd'),
        registration_link: formData.registration_link.trim(),
        status: formData.status,
        display_order: formData.display_order,
      };

      console.log('Attempting to save program:', programData);

      if (isEditing && id) {
        await updateProgram(id, programData);
        toast.success('Program updated successfully');
      } else {
        await createProgram(programData);
        toast.success('Program created successfully');
      }

      navigate('/admin/programs');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`${isEditing ? 'Failed to update program' : 'Failed to create program'}: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Program' : 'New Program'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEOHead
        title={`Admin - ${isEditing ? 'Edit' : 'New'} Program`}
        description="Manage upcoming programs"
        robots="noindex,nofollow"
      />
      <AdminLayout title={isEditing ? 'Edit Program' : 'New Program'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/programs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Programs
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, status: 'draft' }));
                  handleSubmit({ preventDefault: () => { } } as React.FormEvent);
                }}
                disabled={saving}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'} Program
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Program Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Program title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">
                      Image URL <span className="text-destructive">*</span>
                    </Label>
                    <ImageUploader
                      value={formData.image_url}
                      onChange={(url) => setFormData((prev) => ({ ...prev, image_url: Array.isArray(url) ? url[0] : url }))}
                      label="Program Image"
                      folder="program-images"
                    />
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-auto max-h-64 object-contain rounded-lg border bg-muted/30"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">
                      Start Date <span className="text-destructive">*</span>
                    </Label>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.start_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.start_date ? (
                            format(formData.start_date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.start_date}
                          onSelect={(date) => {
                            if (date) {
                              setFormData((prev) => ({ ...prev, start_date: date }));
                              setDateOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration_link">
                      Registration Link <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="registration_link"
                      value={formData.registration_link}
                      onChange={(e) => setFormData((prev) => ({ ...prev, registration_link: e.target.value }))}
                      placeholder="/courses/example or https://example.com"
                      required
                    />
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Internal route (e.g., /courses/xyz) or external URL.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'draft' | 'published' | 'archived') =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger id="status" className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order">Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))
                      }
                      min="0"
                    />
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

export default AdminProgramEditor;

