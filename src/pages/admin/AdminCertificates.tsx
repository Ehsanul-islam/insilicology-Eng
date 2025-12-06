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
import { Award, Eye, Ban, RotateCcw, Plus, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';

interface CertificateWithDetails {
  id: string;
  certificate_number: string;
  recipient_name: string;
  course_name: string;
  issue_date: string;
  completion_date: string;
  is_active: boolean;
  verification_hash: string;
  user_id: string;
  course_id: string;
}

interface CompletedEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  user_name: string;
  course_title: string;
  completion_date: string;
}

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<CertificateWithDetails[]>([]);
  const [completedEnrollments, setCompletedEnrollments] = useState<CompletedEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateWithDetails | null>(null);
  const [actionDialog, setActionDialog] = useState<'view' | 'revoke' | 'reinstate' | 'issue' | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadCertificates(), loadCompletedEnrollments()]);
    setLoading(false);
  };

  const loadCertificates = async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Error loading certificates:', error);
      return;
    }

    setCertificates(data || []);
  };

  const loadCompletedEnrollments = async () => {
    // Get enrollments that are completed but don't have certificates yet
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        user_id,
        course_id,
        completion_date,
        profiles!enrollments_user_id_fkey(full_name),
        courses!enrollments_course_id_fkey(title)
      `)
      .eq('status', 'completed')
      .not('completion_date', 'is', null);

    if (error) {
      console.error('Error loading enrollments:', error);
      return;
    }

    // Get existing certificates to filter out
    const { data: existingCerts } = await supabase
      .from('certificates')
      .select('user_id, course_id');

    const certSet = new Set(
      (existingCerts || []).map((c) => `${c.user_id}-${c.course_id}`)
    );

    const eligibleEnrollments = (enrollments || [])
      .filter((e) => !certSet.has(`${e.user_id}-${e.course_id}`))
      .map((e: any) => ({
        id: e.id,
        user_id: e.user_id,
        course_id: e.course_id,
        user_name: e.profiles?.full_name || 'Unknown',
        course_title: e.courses?.title || 'Unknown Course',
        completion_date: e.completion_date,
      }));

    setCompletedEnrollments(eligibleEnrollments);
  };

  const handleAction = (action: string, certificate: CertificateWithDetails) => {
    setSelectedCertificate(certificate);
    if (action === 'view') {
      window.open(`/verify-certificate?code=${certificate.verification_hash}`, '_blank');
    } else if (action === 'revoke') {
      setActionDialog('revoke');
    } else if (action === 'reinstate') {
      setActionDialog('reinstate');
    }
  };

  const handleIssueCertificate = async () => {
    if (!selectedEnrollment) {
      toast.error('Please select an enrollment');
      return;
    }

    const enrollment = completedEnrollments.find((e) => e.id === selectedEnrollment);
    if (!enrollment) return;

    setProcessing(true);
    try {
      const response = await supabase.functions.invoke('issue-certificate', {
        body: {
          action: 'issue',
          enrollmentId: enrollment.id,
          userId: enrollment.user_id,
          courseId: enrollment.course_id,
          recipientName: enrollment.user_name,
          courseName: enrollment.course_title,
          completionDate: enrollment.completion_date,
        },
      });

      if (response.error) throw response.error;

      toast.success('Certificate issued successfully');
      setActionDialog(null);
      setSelectedEnrollment('');
      loadData();
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast.error('Failed to issue certificate');
    } finally {
      setProcessing(false);
    }
  };

  const handleRevoke = async () => {
    if (!selectedCertificate) return;

    setProcessing(true);
    try {
      const response = await supabase.functions.invoke('issue-certificate', {
        body: {
          action: 'revoke',
          certificateId: selectedCertificate.id,
        },
      });

      if (response.error) throw response.error;

      toast.success('Certificate revoked');
      setActionDialog(null);
      loadCertificates();
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast.error('Failed to revoke certificate');
    } finally {
      setProcessing(false);
    }
  };

  const handleReinstate = async () => {
    if (!selectedCertificate) return;

    setProcessing(true);
    try {
      const response = await supabase.functions.invoke('issue-certificate', {
        body: {
          action: 'reinstate',
          certificateId: selectedCertificate.id,
        },
      });

      if (response.error) throw response.error;

      toast.success('Certificate reinstated');
      setActionDialog(null);
      loadCertificates();
    } catch (error) {
      console.error('Error reinstating certificate:', error);
      toast.error('Failed to reinstate certificate');
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<CertificateWithDetails>[] = [
    {
      key: 'certificate_number',
      header: 'Certificate #',
      render: (item) => (
        <span className="font-mono text-sm">{item.certificate_number}</span>
      ),
    },
    {
      key: 'recipient_name',
      header: 'Recipient',
      render: (item) => <span className="font-medium">{item.recipient_name}</span>,
    },
    {
      key: 'course_name',
      header: 'Course',
      render: (item) => <span>{item.course_name}</span>,
    },
    {
      key: 'issue_date',
      header: 'Issue Date',
      render: (item) => (
        <span className="text-sm">{new Date(item.issue_date).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.is_active ? 'default' : 'destructive'}>
          {item.is_active ? 'Active' : 'Revoked'}
        </Badge>
      ),
    },
  ];

  const filteredCertificates = certificates.filter((c) => {
    // Filter by status
    if (filter === 'active' && !c.is_active) return false;
    if (filter === 'revoked' && c.is_active) return false;

    // Filter by search
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.certificate_number.toLowerCase().includes(query) ||
      c.recipient_name.toLowerCase().includes(query) ||
      c.course_name.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout title="Certificates">
      <SEOHead
        title="Manage Certificates - Admin"
        description="Manage course certificates"
        url="/admin/certificates"
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Issue, view, and manage course completion certificates.
          </p>
          <Button onClick={() => setActionDialog('issue')}>
            <Plus className="w-4 h-4 mr-2" />
            Issue Certificate
          </Button>
        </div>

        <DataTable
          data={filteredCertificates}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search certificates..."
          onSearch={setSearchQuery}
          onFilter={setFilter}
          filterValue={filter}
          filterOptions={[
            { label: 'All Certificates', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Revoked', value: 'revoked' },
          ]}
          onRowAction={handleAction}
          rowActions={[
            { label: 'View Certificate', value: 'view', icon: <Eye className="w-4 h-4" /> },
            { label: 'Revoke', value: 'revoke', icon: <Ban className="w-4 h-4" />, variant: 'destructive' },
            { label: 'Reinstate', value: 'reinstate', icon: <RotateCcw className="w-4 h-4" /> },
          ]}
          emptyMessage="No certificates found"
        />
      </div>

      {/* Issue Certificate Dialog */}
      <Dialog open={actionDialog === 'issue'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Issue Certificate
            </DialogTitle>
            <DialogDescription>
              Select a completed enrollment to issue a certificate.
            </DialogDescription>
          </DialogHeader>

          {completedEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No completed enrollments without certificates found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Select value={selectedEnrollment} onValueChange={setSelectedEnrollment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select enrollment..." />
                </SelectTrigger>
                <SelectContent>
                  {completedEnrollments.map((enrollment) => (
                    <SelectItem key={enrollment.id} value={enrollment.id}>
                      {enrollment.user_name} - {enrollment.course_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleIssueCertificate}
              disabled={processing || !selectedEnrollment}
            >
              {processing ? 'Issuing...' : 'Issue Certificate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Dialog */}
      <Dialog open={actionDialog === 'revoke'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Certificate</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this certificate for{' '}
              <strong>{selectedCertificate?.recipient_name}</strong>? The certificate will be
              marked as invalid and will not pass verification.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke} disabled={processing}>
              {processing ? 'Revoking...' : 'Revoke Certificate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reinstate Dialog */}
      <Dialog open={actionDialog === 'reinstate'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reinstate Certificate</DialogTitle>
            <DialogDescription>
              Are you sure you want to reinstate this certificate for{' '}
              <strong>{selectedCertificate?.recipient_name}</strong>? The certificate will be
              marked as valid again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleReinstate} disabled={processing}>
              {processing ? 'Reinstating...' : 'Reinstate Certificate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCertificates;
