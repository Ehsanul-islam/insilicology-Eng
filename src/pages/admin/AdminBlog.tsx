import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useBlog, BlogPost } from '@/hooks/useBlog';
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
import { Plus, Edit, Eye, Trash2, Send, Star } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const AdminBlog = () => {
  const navigate = useNavigate();
  const {
    fetchBlogPosts,
    deleteBlogPost,
    updateBlogPostStatus,
    toggleFeatured,
    fetchCategories,
  } = useBlog();

  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [postsData, categoryData] = await Promise.all([
      fetchBlogPosts(),
      fetchCategories(),
    ]);
    setPosts(postsData);
    setCategories(categoryData);
    setLoading(false);
  };

  const handleAction = async (action: string, post: any) => {
    setSelectedPost(post);

    if (action === 'view') {
      if (post.published) {
        window.open(`/blog/${post.slug}`, '_blank');
      } else {
        toast.info('Post is not published. Publish it first to view.');
      }
    } else if (action === 'edit') {
      navigate(`/admin/blog/${post.id}/edit`);
    } else if (action === 'publish') {
      setProcessing(true);
      try {
        await updateBlogPostStatus(post.id, true);
        toast.success('Blog post published successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to publish blog post');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'unpublish') {
      setProcessing(true);
      try {
        await updateBlogPostStatus(post.id, false);
        toast.success('Blog post unpublished');
        loadData();
      } catch (error) {
        toast.error('Failed to unpublish blog post');
      } finally {
        setProcessing(false);
      }
    } else if (action === 'toggle-featured') {
      setProcessing(true);
      try {
        await toggleFeatured(post.id, !post.featured);
        toast.success(post.featured ? 'Removed from featured' : 'Added to featured');
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
    if (!selectedPost) return;
    setProcessing(true);
    try {
      await deleteBlogPost(selectedPost.id);
      toast.success('Blog post deleted successfully');
      setDeleteDialog(false);
      loadData();
    } catch (error) {
      toast.error('Failed to delete blog post');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (published: boolean) => {
    return published ? (
      <Badge variant="default">Published</Badge>
    ) : (
      <Badge variant="secondary">Draft</Badge>
    );
  };

  const columns: Column<any>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (post) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {post.title}
            {post.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          </div>
          <div className="text-sm text-muted-foreground">{post.slug}</div>
        </div>
      ),
    },
    {
      header: 'Author',
      accessorKey: 'profiles',
      cell: (post) => {
        const author = post.profiles as any;
        return author?.full_name || 'Unknown';
      },
    },
    {
      header: 'Category',
      accessorKey: 'blog_categories',
      cell: (post) => {
        const category = post.blog_categories as any;
        return category?.name || '-';
      },
    },
    {
      header: 'Status',
      accessorKey: 'published',
      cell: (post) => getStatusBadge(post.published),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: (post) =>
        post.created_at
          ? new Date(post.created_at).toLocaleDateString()
          : '-',
    },
  ];

  const actions = (post: any) => [
    {
      label: 'View',
      icon: Eye,
      onClick: () => handleAction('view', post),
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: () => handleAction('edit', post),
    },
    {
      label: post.featured ? 'Remove Featured' : 'Mark Featured',
      icon: Star,
      onClick: () => handleAction('toggle-featured', post),
    },
    ...(post.published
      ? [
          {
            label: 'Unpublish',
            icon: Send,
            onClick: () => handleAction('unpublish', post),
          },
        ]
      : [
          {
            label: 'Publish',
            icon: Send,
            onClick: () => handleAction('publish', post),
          },
        ]),
    {
      label: 'Delete',
      icon: Trash2,
      onClick: () => handleAction('delete', post),
      destructive: true,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'published' && post.published) ||
      (filter === 'draft' && !post.published);
    const matchesCategory =
      categoryFilter === 'all' ||
      (post.blog_categories as any)?.id === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.published).length,
    draft: posts.filter((p) => !p.published).length,
    featured: posts.filter((p) => p.featured).length,
  };

  return (
    <>
      <SEOHead
        title="Admin - Blog Management"
        description="Manage blog posts"
        robots="noindex,nofollow"
      />
      <AdminLayout title="Blog Management">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Posts</div>
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
                placeholder="Search posts..."
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
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/admin/blog/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/blog/categories">Categories</Link>
              </Button>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={filteredPosts}
            loading={loading}
            actions={actions}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Blog Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedPost?.title}"? This action cannot be
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

export default AdminBlog;

