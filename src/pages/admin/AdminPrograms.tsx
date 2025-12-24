import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useUpcomingPrograms } from '@/hooks/useUpcomingPrograms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, Send } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { format } from 'date-fns';

const AdminPrograms = () => {
  const navigate = useNavigate();
  const { fetchAllPrograms, deleteProgram, updateProgramStatus } = useUpcomingPrograms();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    const data = await fetchAllPrograms();
    setPrograms(data);
    setLoading(false);
  };

  const handleAction = async (action: string, program: any) => {
    setSelectedProgram(program);

    if (action === 'view') {
      if (program.registration_link) {
        if (program.registration_link.startsWith('http://') || program.registration_link.startsWith('https://')) {
          window.open(program.registration_link, '_blank');
        } else {
          window.open(program.registration_link, '_blank');
        }
      }
    } else if (action === 'edit') {
      navigate(`/admin/programs/${program.id}/edit`);
    } else if (action === 'publish') {
      setProcessing(true);
      try {
        await updateProgramStatus(program.id, 'published');
        toast.success('Program published successfully');
        loadPrograms();
      } catch (error) {
        toast.error('Failed to publish program');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'unpublish') {
      setProcessing(true);
      try {
        await updateProgramStatus(program.id, 'draft');
        toast.success('Program unpublished');
        loadPrograms();
      } catch (error) {
        toast.error('Failed to unpublish program');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'delete') {
      setDeleteDialog(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedProgram) return;
    setProcessing(true);
    try {
      await deleteProgram(selectedProgram.id);
      toast.success('Program deleted successfully');
      setDeleteDialog(false);
      loadPrograms();
    } catch (error) {
      toast.error('Failed to delete program');
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

  // Filter programs
  const filteredPrograms = programs.filter((program) => {
    const matchesStatus = filter === 'all' || program.status === filter;
    const matchesSearch = searchQuery === '' || 
      program.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: Column<any>[] = [
    {
      accessorKey: 'image_url',
      header: 'Image',
      cell: ({ row }) => (
        <img
          src={row.original.image_url}
          alt={row.original.title}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'start_date',
      header: 'Start Date',
      cell: ({ row }) => (
        <div>{format(new Date(row.original.start_date), 'MMM d, yyyy')}</div>
      ),
    },
    {
      accessorKey: 'registration_link',
      header: 'Registration Link',
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {row.original.registration_link}
        </div>
      ),
    },
    {
      accessorKey: 'display_order',
      header: 'Order',
      cell: ({ row }) => (
        <div className="text-center">{row.original.display_order || 0}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const program = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction('view', program)}
              title="View Link"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction('edit', program)}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
            {program.status === 'published' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction('unpublish', program)}
                disabled={processing}
                title="Unpublish"
              >
                <Send className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction('publish', program)}
                disabled={processing}
                title="Publish"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction('delete', program)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminLayout title="Upcoming Programs">
      <SEOHead
        title="Admin - Upcoming Programs"
        description="Manage upcoming programs"
        url="/admin/programs"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Upcoming Programs</h1>
            <p className="text-muted-foreground">Manage programs displayed in the hero section</p>
          </div>
          <Button asChild>
            <Link to="/admin/programs/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Program
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredPrograms}
          loading={loading}
          searchKey="title"
        />

        {/* Delete Dialog */}
        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Program</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedProgram?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                {processing ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPrograms;

