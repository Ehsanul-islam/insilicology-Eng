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
import { User, Shield, ShieldOff, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';

interface UserWithRoles {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  roles: string[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [actionDialog, setActionDialog] = useState<'view' | 'role' | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map roles to users
      const roleMap = new Map<string, string[]>();
      (roles || []).forEach((r) => {
        const existing = roleMap.get(r.user_id) || [];
        roleMap.set(r.user_id, [...existing, r.role]);
      });

      const usersWithRoles: UserWithRoles[] = (profiles || []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        phone: p.phone,
        created_at: p.created_at,
        roles: roleMap.get(p.id) || ['student'],
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string, user: UserWithRoles) => {
    setSelectedUser(user);
    if (action === 'view') {
      setActionDialog('view');
    } else if (action === 'role') {
      setSelectedRole('');
      setActionDialog('role');
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    setProcessing(true);
    try {
      // Check if role already exists
      if (selectedUser.roles.includes(selectedRole)) {
        toast.error('User already has this role');
        setProcessing(false);
        return;
      }

      const { error } = await supabase.from('user_roles').insert({
        user_id: selectedUser.id,
        role: selectedRole as 'admin' | 'instructor' | 'student',
      });

      if (error) throw error;

      toast.success(`Role "${selectedRole}" assigned successfully`);
      setActionDialog(null);
      loadUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveRole = async (userId: string, role: 'admin' | 'instructor' | 'student') => {
    if (role === 'student') {
      toast.error('Cannot remove the default student role');
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast.success(`Role "${role}" removed successfully`);
      loadUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    } finally {
      setProcessing(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      admin: 'destructive',
      instructor: 'default',
      student: 'secondary',
    };
    return (
      <Badge key={role} variant={variants[role] || 'outline'} className="mr-1">
        {role}
      </Badge>
    );
  };

  const columns: Column<UserWithRoles>[] = [
    {
      key: 'full_name',
      header: 'User',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{item.full_name || 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (item) => <div>{item.roles.map((role) => getRoleBadge(role))}</div>,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (item) => <span className="text-sm">{item.phone || '-'}</span>,
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (item) => (
        <span className="text-sm">{new Date(item.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout title="Users">
      <SEOHead
        title="Manage Users - Admin"
        description="Manage users and roles"
        url="/admin/users"
      />

      <div className="space-y-6">
        <p className="text-muted-foreground">
          View and manage user accounts and their roles.
        </p>

        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search users..."
          onSearch={setSearchQuery}
          onRowAction={handleAction}
          rowActions={[
            { label: 'View Details', value: 'view', icon: <Eye className="w-4 h-4" /> },
            { label: 'Manage Roles', value: 'role', icon: <Shield className="w-4 h-4" /> },
          ]}
          emptyMessage="No users found"
        />
      </div>

      {/* View User Dialog */}
      <Dialog open={actionDialog === 'view'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.full_name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedUser.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Roles</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles.map((role) => (
                    <Badge key={role} variant="outline" className="flex items-center gap-1">
                      {role}
                      {role !== 'student' && (
                        <button
                          onClick={() => handleRemoveRole(selectedUser.id, role)}
                          className="ml-1 text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Close
            </Button>
            <Button onClick={() => setActionDialog('role')}>Manage Roles</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Management Dialog */}
      <Dialog open={actionDialog === 'role'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Manage Roles
            </DialogTitle>
            <DialogDescription>
              Assign or remove roles for <strong>{selectedUser?.full_name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Roles</p>
              <div className="flex flex-wrap gap-2">
                {selectedUser?.roles.map((role) => (
                  <Badge key={role} variant="outline" className="flex items-center gap-1">
                    {role}
                    {role !== 'student' && (
                      <button
                        onClick={() => {
                          if (selectedUser) {
                            handleRemoveRole(selectedUser.id, role);
                          }
                        }}
                        className="ml-1 text-destructive hover:text-destructive/80"
                        disabled={processing}
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Add Role</p>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role to add..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={processing || !selectedRole}>
              {processing ? 'Assigning...' : 'Assign Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
