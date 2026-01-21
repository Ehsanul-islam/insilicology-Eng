import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useAdminData, EnrollmentWithDetails } from '@/hooks/useAdminData';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, Trash2, ExternalLink, Award } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';

const AdminEnrollments = () => {
  const [searchParams] = useSearchParams();
  const { fetchEnrollments, updateEnrollmentStatus } = useAdminData();
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [actionDialog, setActionDialog] = useState<'view' | 'approve' | 'reject' | 'complete' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deleteEnrollmentDialog, setDeleteEnrollmentDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadEnrollments();
  }, [filter]);

  const loadEnrollments = async () => {
    setLoading(true);
    const data = await fetchEnrollments({ status: filter });
    setEnrollments(data);
    setLoading(false);
  };

  const handleAction = (action: string, enrollment: EnrollmentWithDetails) => {
    setSelectedEnrollment(enrollment);
    if (action === 'view') {
      setActionDialog('view');
    } else if (action === 'approve') {
      setActionDialog('approve');
    } else if (action === 'reject') {
      setActionDialog('reject');
      setRejectionReason('');
    } else if (action === 'complete') {
      setActionDialog('complete');
    } else if (action === 'delete') {
      setDeleteEnrollmentDialog(true);
    }
  };

  const handleApprove = async () => {
    if (!selectedEnrollment) return;
    setProcessing(true);
    try {
      await updateEnrollmentStatus(selectedEnrollment.id, 'active');

      // Trigger email notification (independent try-catch)
      try {
        console.log('Triggering enrollment notification email for:', selectedEnrollment.user_email);

        const { error: funcError } = await supabase.functions.invoke('send-enrollment-notification', {
          body: {
            enrollmentId: selectedEnrollment.id,
            type: 'approved',
            recipientEmail: selectedEnrollment.user_email,
            recipientName: selectedEnrollment.user_name,
            courseName: selectedEnrollment.course_title,
          },
        });

        if (funcError) {
          console.error('Failed to trigger email function:', funcError);
          toast.error('Approval successful, but email notification failed.');
        } else {
          toast.success('Enrollment approved & email sent!');
        }
      } catch (emailErr) {
        console.error('Error calling email function:', emailErr);
        toast.error('Approval successful, but email notification failed.');
      }

      setActionDialog(null);
      loadEnrollments();
    } catch (error: any) {
      console.error('Enrollment approval error:', error);
      const errorMessage = error?.message || 'Failed to approve enrollment';
      toast.error(`Failed to approve enrollment: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedEnrollment) return;
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setProcessing(true);
    try {
      await updateEnrollmentStatus(selectedEnrollment.id, 'cancelled', rejectionReason);

      // Trigger email notification (independent try-catch)
      try {
        console.log('Triggering rejection notification email for:', selectedEnrollment.user_email);

        const { error: funcError } = await supabase.functions.invoke('send-enrollment-notification', {
          body: {
            enrollmentId: selectedEnrollment.id,
            type: 'rejected',
            recipientEmail: selectedEnrollment.user_email,
            recipientName: selectedEnrollment.user_name,
            courseName: selectedEnrollment.course_title,
            rejectionReason: rejectionReason,
          },
        });

        if (funcError) {
          console.error('Failed to trigger rejection email:', funcError);
          toast.error('Rejection successful, but email notification failed.');
        } else {
          toast.success('Enrollment rejected & email sent!');
        }
      } catch (emailErr) {
        console.error('Error calling rejection email function:', emailErr);
        toast.error('Rejection successful, but email notification failed.');
      }

      setActionDialog(null);
      loadEnrollments();
    } catch (error) {
      toast.error('Failed to reject enrollment');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEnrollment) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', selectedEnrollment.id);

      if (error) throw error;

      toast.success('Enrollment deleted successfully');
      setDeleteEnrollmentDialog(false);
      loadEnrollments();
    } catch (error: any) {
      console.error('Delete enrollment error:', error);
      const errorMessage = error?.message || 'Failed to delete enrollment';
      toast.error(`Failed to delete enrollment: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedEnrollment) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({
          status: 'completed',
          completion_date: new Date().toISOString(),
          progress_percentage: 100,
        })
        .eq('id', selectedEnrollment.id);

      if (error) throw error;

      toast.success(
        `${selectedEnrollment.user_name} marked as completed for ${selectedEnrollment.course_title}`
      );
      setActionDialog(null);
      loadEnrollments();
    } catch (error: any) {
      console.error('Mark as completed error:', error);
      const errorMessage = error?.message || 'Failed to mark as completed';
      toast.error(`Failed to mark as completed: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    setProcessing(true);
    try {
      for (const id of selectedIds) {
        if (action === 'approve') {
          await updateEnrollmentStatus(id, 'active');
        } else if (action === 'reject') {
          await updateEnrollmentStatus(id, 'cancelled', 'Bulk rejection');
        } else if (action === 'complete') {
          await supabase
            .from('enrollments')
            .update({
              status: 'completed',
              completion_date: new Date().toISOString(),
              progress_percentage: 100,
            })
            .eq('id', id);
        }
      }
      toast.success(`${selectedIds.length} enrollments updated`);
      loadEnrollments();
    } catch (error) {
      toast.error('Failed to update enrollments');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      active: 'default',
      completed: 'default',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      verified: 'default',
      rejected: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const columns: Column<EnrollmentWithDetails>[] = [
    {
      key: 'user_name',
      header: 'Student',
      render: (item) => (
        <div>
          <p className="font-medium">{item.user_name || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground">{item.user_email}</p>
        </div>
      ),
    },
    {
      key: 'course_title',
      header: 'Course',
      render: (item) => (
        <span className="font-medium">{item.course_title || 'Unknown Course'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => getStatusBadge(item.status),
    },
    {
      key: 'payment_status',
      header: 'Payment',
      render: (item) => getPaymentBadge(item.payment_status),
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: (item) => <span className="text-sm">{item.payment_method || '-'}</span>,
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (item) => (
        <span className="text-sm">{new Date(item.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  const filteredEnrollments = enrollments.filter((e) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      e.user_name?.toLowerCase().includes(query) ||
      e.user_email?.toLowerCase().includes(query) ||
      e.course_title?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout title="Enrollments">
      <SEOHead
        title="Manage Enrollments - Admin"
        description="Manage course enrollments"
        url="/admin/enrollments"
      />

      <DataTable
        data={filteredEnrollments}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search by student or course..."
        onSearch={setSearchQuery}
        onFilter={setFilter}
        filterValue={filter}
        filterOptions={[
          { label: 'All Enrollments', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Active', value: 'active' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ]}
        onRowAction={handleAction}
        rowActions={[
          { label: 'View Details', value: 'view', icon: <Eye className="w-4 h-4" /> },
          { label: 'Approve', value: 'approve', icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'Mark as Completed', value: 'complete', icon: <Award className="w-4 h-4" /> },
          { label: 'Reject', value: 'reject', icon: <XCircle className="w-4 h-4" />, variant: 'destructive' },
          { label: 'Delete', value: 'delete', icon: <Trash2 className="w-4 h-4" />, variant: 'destructive' },
        ]}
        bulkActions={[
          { label: 'Approve Selected', value: 'approve', icon: <CheckCircle className="w-4 h-4 mr-2" /> },
          { label: 'Mark as Completed', value: 'complete', icon: <Award className="w-4 h-4 mr-2" /> },
          { label: 'Reject Selected', value: 'reject', icon: <XCircle className="w-4 h-4 mr-2" /> },
        ]}
        onBulkAction={handleBulkAction}
        emptyMessage="No enrollments found"
      />

      {/* View Details Dialog */}
      <Dialog open={actionDialog === 'view'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enrollment Details</DialogTitle>
          </DialogHeader>
          {selectedEnrollment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student</p>
                  <p className="font-medium">{selectedEnrollment.user_name}</p>
                  <p className="text-sm">{selectedEnrollment.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-medium">{selectedEnrollment.course_title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedEnrollment.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  {getPaymentBadge(selectedEnrollment.payment_status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{selectedEnrollment.payment_method || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(selectedEnrollment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedEnrollment.payment_proof_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Proof</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('Payment proof URL:', selectedEnrollment.payment_proof_url);
                      window.open(selectedEnrollment.payment_proof_url, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Payment Proof
                  </Button>
                </div>
              )}

              {selectedEnrollment.custom_form_data &&
                Object.keys(selectedEnrollment.custom_form_data).length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Additional Information</p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      {Object.entries(selectedEnrollment.custom_form_data).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-sm text-muted-foreground">{key}</span>
                          <span className="text-sm font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Close
            </Button>
            {selectedEnrollment?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setActionDialog('reject')}
                >
                  Reject
                </Button>
                <Button onClick={() => setActionDialog('approve')}>Approve</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={actionDialog === 'approve'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this enrollment for{' '}
              <strong>{selectedEnrollment?.user_name}</strong> in{' '}
              <strong>{selectedEnrollment?.course_title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={processing}>
              {processing ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionDialog === 'reject'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Enrollment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this enrollment.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing}>
              {processing ? 'Rejecting...' : 'Reject Enrollment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Completed Dialog */}
      <Dialog open={actionDialog === 'complete'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Mark as Completed
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this enrollment as completed for{' '}
              <strong>{selectedEnrollment?.user_name}</strong> in{' '}
              <strong>{selectedEnrollment?.course_title}</strong>?
              <br />
              <br />
              This will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Set status to "completed"</li>
                <li>Set progress to 100%</li>
                <li>Record completion date as today</li>
                <li>Make the student eligible for a certificate</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleComplete} disabled={processing}>
              {processing ? 'Marking as Completed...' : 'Mark as Completed'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Enrollment Confirmation Dialog */}
      <Dialog open={deleteEnrollmentDialog} onOpenChange={setDeleteEnrollmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the enrollment for "{selectedEnrollment?.user_name}" in "{selectedEnrollment?.course_title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteEnrollmentDialog(false)} disabled={processing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
              {processing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEnrollments;
