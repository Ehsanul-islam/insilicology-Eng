import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  FileText,
  ChevronUp,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url: string;
  lesson_order: number;
  is_active: boolean;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

const AdminLessonEditor = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; lesson: Lesson | null }>({
    open: false,
    lesson: null,
  });

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, slug')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, course_id, title, description, content, lesson_order, is_active')
        .eq('course_id', courseId)
        .order('lesson_order', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load course data');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  }, [courseId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createNewLesson = (): Lesson => ({
    id: '',
    course_id: courseId || '',
    title: '',
    description: '',
    content: '',
    video_url: '',
    lesson_order: lessons.length,
    is_active: true,
  });

  const handleSaveLesson = async () => {
    if (!editingLesson) return;

    if (!editingLesson.title.trim()) {
      toast.error('Lesson title is required');
      return;
    }

    setSaving(true);

    try {
      const lessonData = {
        course_id: courseId,
        title: editingLesson.title.trim(),
        description: editingLesson.description.trim() || null,
        content: editingLesson.content.trim() || null,
        video_url: editingLesson.video_url.trim() || null,
        lesson_order: editingLesson.lesson_order,
        is_active: editingLesson.is_active,
      };

      if (editingLesson.id) {
        // Update existing
        const { error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', editingLesson.id);

        if (error) throw error;
        toast.success('Lesson updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('lessons')
          .insert([lessonData]);

        if (error) throw error;
        toast.success('Lesson created successfully');
      }

      setEditingLesson(null);
      fetchData();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error('Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!deleteDialog.lesson) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', deleteDialog.lesson.id);

      if (error) throw error;
      toast.success('Lesson deleted successfully');
      setDeleteDialog({ open: false, lesson: null });
      fetchData();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newLessons = [...lessons];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newLessons.length) return;

    // Swap the lessons
    [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];

    // Update order values
    const updates = newLessons.map((lesson, i) => ({
      id: lesson.id,
      lesson_order: i,
    }));

    setLessons(newLessons.map((lesson, i) => ({ ...lesson, lesson_order: i })));

    try {
      for (const update of updates) {
        await supabase
          .from('lessons')
          .update({ lesson_order: update.lesson_order })
          .eq('id', update.id);
      }
      toast.success('Lesson order updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      fetchData();
    }
  };

  const handleToggleActive = async (lesson: Lesson) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({ is_active: !lesson.is_active })
        .eq('id', lesson.id);

      if (error) throw error;

      setLessons(lessons.map(l =>
        l.id === lesson.id ? { ...l, is_active: !l.is_active } : l
      ));
      toast.success(lesson.is_active ? 'Lesson hidden' : 'Lesson visible');
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Failed to update visibility');
    }
  };

  // Count active and hidden lessons
  const activeLessons = lessons.filter(l => l.is_active).length;
  const hiddenLessons = lessons.length - activeLessons;

  if (loading) {
    return (
      <AdminLayout title="Manage Lessons">
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Lessons">
      <SEOHead
        title={`Lessons - ${course?.title || 'Course'} - Admin`}
        description="Manage course lessons"
        url={`/admin/courses/${courseId}/lessons`}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" asChild>
              <Link to={`/admin/courses/${courseId}/edit`}>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Manage Lessons</h1>
              <p className="text-sm text-muted-foreground">
                {course?.title || 'Loading...'}
              </p>
            </div>
          </div>
          <Button onClick={() => setEditingLesson(createNewLesson())}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lessons.length}</p>
                  <p className="text-sm text-muted-foreground">Total Lessons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Eye className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeLessons}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{hiddenLessons}</p>
                  <p className="text-sm text-muted-foreground">Hidden</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tip for organizing lessons */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Tip: Organize lessons by module
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Start each lesson title with "Module X:" (e.g., "Module 1: Introduction to n8n") to group them automatically in the curriculum accordion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle>Course Lessons</CardTitle>
            <CardDescription>
              Click to edit. Use arrows to reorder. Toggle visibility with the eye icon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Lessons Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your course curriculum by adding the first lesson.
                </p>
                <Button onClick={() => setEditingLesson(createNewLesson())}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Lesson
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${lesson.is_active ? 'bg-card hover:bg-muted/30' : 'bg-muted/50 opacity-60'
                      }`}
                  >
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleReorder(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleReorder(index, 'down')}
                        disabled={index === lessons.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Lesson Number */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm shrink-0">
                      {index + 1}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{lesson.title}</h4>
                        {!lesson.is_active && (
                          <Badge variant="secondary" className="bg-muted shrink-0">
                            Hidden
                          </Badge>
                        )}
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(lesson)}
                        title={lesson.is_active ? 'Hide lesson' : 'Show lesson'}
                      >
                        {lesson.is_active ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingLesson(lesson)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialog({ open: true, lesson })}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Lesson Dialog */}
      <Dialog open={!!editingLesson} onOpenChange={(open) => !open && setEditingLesson(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson?.id ? 'Edit Lesson' : 'New Lesson'}
            </DialogTitle>
            <DialogDescription>
              Add a lesson title. Start with "Module X:" to group lessons (e.g., "Module 1: Introduction").
            </DialogDescription>
          </DialogHeader>

          {editingLesson && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lesson-title">Lesson Title *</Label>
                  <Input
                    id="lesson-title"
                    value={editingLesson.title}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, title: e.target.value })
                    }
                    placeholder="e.g., Module 1: Introduction to n8n"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use "Module X:" prefix to organize lessons into groups
                  </p>
                </div>

                <div>
                  <Label htmlFor="lesson-description">Short Description (optional)</Label>
                  <Input
                    id="lesson-description"
                    value={editingLesson.description}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, description: e.target.value })
                    }
                    placeholder="e.g., Learn the basics of n8n automation"
                  />
                </div>

                <div>
                  <Label htmlFor="lesson-video">Video URL (YouTube)</Label>
                  <Input
                    id="lesson-video"
                    value={editingLesson.video_url}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, video_url: e.target.value })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Paste a YouTube video URL for this lesson
                  </p>
                </div>

                <div>
                  <Label htmlFor="lesson-content">Lesson Content (optional)</Label>
                  <Textarea
                    id="lesson-content"
                    value={editingLesson.content}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, content: e.target.value })
                    }
                    placeholder="Detailed lesson content, notes, or resources..."
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports markdown formatting
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="lesson-active"
                    checked={editingLesson.is_active}
                    onCheckedChange={(checked) =>
                      setEditingLesson({ ...editingLesson, is_active: checked })
                    }
                  />
                  <Label htmlFor="lesson-active" className="cursor-pointer">
                    Active
                    <span className="block text-xs text-muted-foreground font-normal">
                      Show in course curriculum
                    </span>
                  </Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLesson(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLesson} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, lesson: deleteDialog.lesson })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.lesson?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, lesson: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLesson}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminLessonEditor;
