import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { MessageSquare, Eye, CheckCircle, Clock, Archive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string, contact: ContactSubmission) => {
    setSelectedContact(contact);
    if (action === 'view') {
      setViewDialog(true);
    } else if (action === 'resolve' || action === 'archive') {
      updateStatus(contact.id, action === 'resolve' ? 'resolved' : 'closed');
    }
  };

  const updateStatus = async (contactId: string, status: 'new' | 'in_progress' | 'resolved' | 'closed') => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', contactId);

      if (error) throw error;

      toast.success(`Contact marked as ${status}`);
      loadContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      new: 'secondary',
      in_progress: 'default',
      resolved: 'outline',
      closed: 'outline',
    };
    const icons: Record<string, React.ReactNode> = {
      new: <Clock className="w-3 h-3 mr-1" />,
      in_progress: <MessageSquare className="w-3 h-3 mr-1" />,
      resolved: <CheckCircle className="w-3 h-3 mr-1" />,
      closed: <Archive className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center w-fit">
        {icons[status]}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const columns: Column<ContactSubmission>[] = [
    {
      key: 'name',
      header: 'Contact',
      render: (item) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (item) => (
        <span className="text-sm">{item.subject || 'No subject'}</span>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (item) => (
        <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
          {item.message}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => getStatusBadge(item.status),
    },
    {
      key: 'created_at',
      header: 'Received',
      render: (item) => (
        <span className="text-sm">{new Date(item.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  const filteredContacts = contacts.filter((c) => {
    // Filter by status
    if (filter !== 'all' && c.status !== filter) return false;

    // Filter by search
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.message.toLowerCase().includes(query) ||
      c.subject?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout title="Contact Messages">
      <SEOHead
        title="Contact Messages - Admin"
        description="Manage contact form submissions"
        url="/admin/contacts"
      />

      <div className="space-y-6">
        <p className="text-muted-foreground">
          View and respond to contact form submissions.
        </p>

        <DataTable
          data={filteredContacts}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search messages..."
          onSearch={setSearchQuery}
          onFilter={setFilter}
          filterValue={filter}
          filterOptions={[
            { label: 'All Messages', value: 'all' },
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Resolved', value: 'resolved' },
            { label: 'Closed', value: 'closed' },
          ]}
          onRowAction={handleAction}
          rowActions={[
            { label: 'View Message', value: 'view', icon: <Eye className="w-4 h-4" /> },
            { label: 'Mark Resolved', value: 'resolve', icon: <CheckCircle className="w-4 h-4" /> },
            { label: 'Close', value: 'archive', icon: <Archive className="w-4 h-4" /> },
          ]}
          bulkActions={[
            { label: 'Mark Resolved', value: 'resolve', icon: <CheckCircle className="w-4 h-4 mr-2" /> },
            { label: 'Close', value: 'archive', icon: <Archive className="w-4 h-4 mr-2" /> },
          ]}
          emptyMessage="No contact messages found"
        />
      </div>

      {/* View Message Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Contact Message
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedContact.status)}
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedContact.created_at).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                )}
              </div>

              {selectedContact.subject && (
                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <Select
                  value={selectedContact.status}
                  onValueChange={(value) => {
                    updateStatus(selectedContact.id, value as 'new' | 'in_progress' | 'resolved' | 'closed');
                    setSelectedContact({ ...selectedContact, status: value });
                  }}
                  disabled={processing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialog(false)}>
              Close
            </Button>
            <Button asChild>
              <a href={`mailto:${selectedContact?.email}`}>Reply via Email</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContacts;
