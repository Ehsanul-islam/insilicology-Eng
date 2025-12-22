import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useAdminData, CourseWithDetails } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Eye, Trash2, Archive, Send } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const AdminCourses = () => {
  const navigate = useNavigate();
  const { fetchCourses, updateCourseStatus, deleteCourse } = useAdminData();
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [selectedCourse, setSelectedCourse] = useState<CourseWithDetails | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const data = await fetchCourses();
    setCourses(data);
    setLoading(false);
  };

  const handleAction = async (action: string, course: CourseWithDetails) => {
    setSelectedCourse(course);

    if (action === 'view') {
      window.open(`/courses/${course.slug}`, '_blank');
    } else if (action === 'edit') {
      navigate(`/admin/courses/${course.id}/edit`);
    } else if (action === 'publish') {
      setProcessing(true);
      try {
        await updateCourseStatus(course.id, 'published');
        toast.success('Course published successfully');
        loadCourses();
      } catch (error) {
        toast.error('Failed to publish course');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'archive') {
      setProcessing(true);
      try {
        await updateCourseStatus(course.id, 'archived');
        toast.success('Course archived');
        loadCourses();
      } catch (error) {
        toast.error('Failed to archive course');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'delete') {
      setDeleteDialog(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    setProcessing(true);
    try {
      await deleteCourse(selectedCourse.id);
      toast.success('Course deleted successfully');
      setDeleteDialog(false);
      loadCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getDifficultyBadge = (difficulty: string | null) => {
    if (!difficulty) return null;
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty] || ''}`}>
        {difficulty}
      </span>
    );
  };

  const columns: Column<CourseWithDetails>[] = [
    {
      key: 'title',
      header: 'Course',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">/{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <div className="flex items-center gap-2">
          {getStatusBadge(item.status)}
          {item.featured && <Badge variant="outline">Featured</Badge>}
          {item.upcoming && <Badge variant="outline">Upcoming</Badge>}
        </div>
      ),
    },
    {
      key: 'course_type',
      header: 'Type',
      render: (item) => <span className="capitalize">{item.course_type}</span>,
    },
    {
      key: 'difficulty',
      header: 'Level',
      render: (item) => getDifficultyBadge(item.difficulty),
    },
    {
      key: 'price_offer',
      header: 'Price',
      render: (item) => (
        <div>
          {item.price_offer ? (
            <>
              <span className="font-medium">${item.price_offer}</span>
              {item.price_regular && item.price_regular !== item.price_offer && (
                <span className="text-xs text-muted-foreground line-through ml-2">
                  ${item.price_regular}
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">Free</span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (item) => (
        <span className="text-sm">{new Date(item.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  const filteredCourses = courses.filter((c) => {
    // Filter by status
    if (filter !== 'all' && c.status !== filter) return false;

    // Filter by search
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      c.slug.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout title="Courses">
      <SEOHead
        title="Manage Courses - Admin"
        description="Manage your courses"
        url="/admin/courses"
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Manage your courses, add new ones, or update existing content.
          </p>
          <Button asChild>
            <Link to="/admin/courses/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Link>
          </Button>
        </div>

        <DataTable
          data={filteredCourses}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search courses..."
          onSearch={setSearchQuery}
          onFilter={setFilter}
          filterValue={filter}
          filterOptions={[
            { label: 'All Courses', value: 'all' },
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
            { label: 'Archived', value: 'archived' },
          ]}
          onRowAction={handleAction}
          rowActions={[
            { label: 'View', value: 'view', icon: <Eye className="w-4 h-4" /> },
            { label: 'Edit', value: 'edit', icon: <Edit className="w-4 h-4" /> },
            { label: 'Publish', value: 'publish', icon: <Send className="w-4 h-4" /> },
            { label: 'Archive', value: 'archive', icon: <Archive className="w-4 h-4" /> },
            { label: 'Delete', value: 'delete', icon: <Trash2 className="w-4 h-4" />, variant: 'destructive' },
          ]}
          bulkActions={[
            { label: 'Publish Selected', value: 'publish', icon: <Send className="w-4 h-4 mr-2" /> },
            { label: 'Archive Selected', value: 'archive', icon: <Archive className="w-4 h-4 mr-2" /> },
            { label: 'Delete Selected', value: 'delete', icon: <Trash2 className="w-4 h-4 mr-2" /> },
          ]}
          emptyMessage="No courses found"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedCourse?.title}</strong>? This action
              cannot be undone and will remove all associated data including lessons, resources,
              and enrollments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
              {processing ? 'Deleting...' : 'Delete Course'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCourses;
