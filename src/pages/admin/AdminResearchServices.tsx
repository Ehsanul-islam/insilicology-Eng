import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
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
import { Plus, Edit, Trash2, ExternalLink, Send } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import {
  useResearchServices,
  type ResearchServiceStatus,
} from '@/hooks/useResearchServices';
import type { ResearchServiceRow } from '@/data/researchServices';

const AdminResearchServices = () => {
  const navigate = useNavigate();
  const { fetchAllServices, deleteService, updateServiceStatus } = useResearchServices();
  const [services, setServices] = useState<ResearchServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selected, setSelected] = useState<ResearchServiceRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await fetchAllServices();
    setServices(data);
    setLoading(false);
  };

  const handleAction = async (action: string, service: ResearchServiceRow) => {
    setSelected(service);

    if (action === 'view') {
      window.open(`/research/${service.slug}`, '_blank');
      return;
    }

    if (action === 'edit') {
      navigate(`/admin/research-services/${service.id}/edit`);
      return;
    }

    if (action === 'publish' || action === 'unpublish') {
      const next: ResearchServiceStatus = action === 'publish' ? 'published' : 'draft';
      setProcessing(true);
      try {
        await updateServiceStatus(service.id, next);
        toast.success(action === 'publish' ? 'Service published' : 'Service unpublished');
        await load();
      } catch {
        toast.error('Failed to update status');
      } finally {
        setProcessing(false);
      }
      return;
    }

    if (action === 'delete') {
      setDeleteOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setProcessing(true);
    try {
      await deleteService(selected.id);
      toast.success('Service deleted');
      setDeleteOpen(false);
      await load();
    } catch {
      toast.error('Failed to delete service');
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

  const filtered = services.filter((s) => {
    const matchStatus = filter === 'all' || s.status === filter;
    const matchSearch =
      searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns: Column<ResearchServiceRow>[] = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) =>
        row.original.image ? (
          <img
            src={row.original.image}
            alt={row.original.title}
            className="h-12 w-16 rounded object-cover"
          />
        ) : (
          <div className="h-12 w-16 rounded bg-muted" />
        ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-muted-foreground">/research/{row.original.slug}</div>
        </div>
      ),
    },
    {
      accessorKey: 'timeline',
      header: 'Timeline',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.original.timeline}</div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <div className="text-sm">{row.original.price}</div>,
    },
    {
      accessorKey: 'display_order',
      header: 'Order',
      cell: ({ row }) => (
        <div className="text-center text-sm">{row.original.display_order ?? 0}</div>
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
        const s = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              title="Open public page"
              onClick={() => handleAction('view', s)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Edit"
              onClick={() => handleAction('edit', s)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {s.status === 'published' ? (
              <Button
                variant="ghost"
                size="sm"
                title="Unpublish"
                disabled={processing}
                onClick={() => handleAction('unpublish', s)}
              >
                <Send className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                title="Publish"
                disabled={processing}
                onClick={() => handleAction('publish', s)}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              title="Delete"
              onClick={() => handleAction('delete', s)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminLayout title="Research Services">
      <SEOHead
        title="Admin - Research Services"
        description="Manage research service detail pages"
        url="/admin/research-services"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Research Services</h1>
            <p className="text-muted-foreground">
              Manage all content shown on /research and each /research/:slug page.
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/research-services/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Link>
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by title or slug..."
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

        <DataTable columns={columns} data={filtered} loading={loading} />

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selected?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
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

export default AdminResearchServices;
