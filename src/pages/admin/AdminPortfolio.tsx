import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { usePortfolio, PortfolioProject } from '@/hooks/usePortfolio';
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
import { Plus, Edit, Eye, Trash2, Archive, Send, Star } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const AdminPortfolio = () => {
  const navigate = useNavigate();
  const {
    fetchPortfolios,
    deletePortfolio,
    updatePortfolioStatus,
    toggleFeatured,
    fetchCategories,
  } = usePortfolio();

  const [portfolios, setPortfolios] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioProject | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [portfolioData, categoryData] = await Promise.all([
      fetchPortfolios(),
      fetchCategories(),
    ]);
    setPortfolios(portfolioData);
    setCategories(categoryData);
    setLoading(false);
  };

  const handleAction = async (action: string, portfolio: PortfolioProject) => {
    setSelectedPortfolio(portfolio);

    if (action === 'view') {
      window.open(`/portfolio/${portfolio.slug}`, '_blank');
    } else if (action === 'edit') {
      navigate(`/admin/portfolio/${portfolio.id}/edit`);
    } else if (action === 'publish') {
      setProcessing(true);
      try {
        await updatePortfolioStatus(portfolio.id, 'published');
        toast.success('Portfolio published successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to publish portfolio');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'archive') {
      setProcessing(true);
      try {
        await updatePortfolioStatus(portfolio.id, 'archived');
        toast.success('Portfolio archived');
        loadData();
      } catch (error) {
        toast.error('Failed to archive portfolio');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'toggle-featured') {
      setProcessing(true);
      try {
        await toggleFeatured(portfolio.id, !portfolio.featured);
        toast.success(portfolio.featured ? 'Removed from featured' : 'Added to featured');
        loadData();
      } catch (error) {
        toast.error('Failed to update featured status');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'delete') {
      setDeleteDialog(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedPortfolio) return;
    setProcessing(true);
    try {
      await deletePortfolio(selectedPortfolio.id);
      toast.success('Portfolio deleted successfully');
      setDeleteDialog(false);
      loadData();
    } catch (error) {
      toast.error('Failed to delete portfolio');
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

  const columns: Column<PortfolioProject>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row: { original: portfolio } }) => (
        <div className="font-medium flex items-center gap-2">
          {portfolio.title}
          {portfolio.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
        </div>
      ),
    },
    {
      header: 'Client',
      accessorKey: 'client_name',
      cell: ({ row: { original: portfolio } }) => portfolio.client_name || '-',
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row: { original: portfolio } }) => portfolio.category || '-',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row: { original: portfolio } }) => getStatusBadge(portfolio.status || 'draft'),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ row: { original: portfolio } }) =>
        portfolio.created_at
          ? new Date(portfolio.created_at).toLocaleDateString()
          : '-',
    },
  ];

  const actions = (portfolio: PortfolioProject) => [
    {
      label: 'View',
      icon: Eye,
      onClick: () => handleAction('view', portfolio),
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: () => handleAction('edit', portfolio),
    },
    {
      label: portfolio.featured ? 'Remove Featured' : 'Mark Featured',
      icon: Star,
      onClick: () => handleAction('toggle-featured', portfolio),
    },
    ...(portfolio.status === 'draft'
      ? [
        {
          label: 'Publish',
          icon: Send,
          onClick: () => handleAction('publish', portfolio),
        },
      ]
      : []),
    ...(portfolio.status === 'published'
      ? [
        {
          label: 'Archive',
          icon: Archive,
          onClick: () => handleAction('archive', portfolio),
        },
      ]
      : []),
    {
      label: 'Delete',
      icon: Trash2,
      onClick: () => handleAction('delete', portfolio),
      destructive: true,
    },
  ];

  const filteredPortfolios = portfolios.filter((portfolio) => {
    const matchesStatus = filter === 'all' || portfolio.status === filter;
    const matchesCategory = categoryFilter === 'all' || portfolio.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.country?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const stats = {
    total: portfolios.length,
    published: portfolios.filter((p) => p.status === 'published').length,
    draft: portfolios.filter((p) => p.status === 'draft').length,
    featured: portfolios.filter((p) => p.featured).length,
  };

  return (
    <>
      <SEOHead
        title="Admin - Portfolio Management"
        description="Manage portfolio projects"
        robots="noindex,nofollow"
      />
      <AdminLayout title="Portfolio Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Projects</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Published</div>
              <div className="text-2xl font-bold">{stats.published}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Drafts</div>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Featured</div>
              <div className="text-2xl font-bold">{stats.featured}</div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
              <Input
                placeholder="Search portfolios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/admin/portfolio/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Portfolio
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/portfolio/categories">Categories</Link>
              </Button>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={filteredPortfolios}
            loading={loading}
            actions={actions}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Portfolio</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedPortfolio?.title}"? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog(false)} disabled={processing}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                {processing ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
};

export default AdminPortfolio;

