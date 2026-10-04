import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usersApi } from '../../services/usersApi';
import { PermissionGuard } from '../../components/PermissionGuard';
import { PERMISSIONS } from '../../lib/permissions';
import { Shield, UserCheck, UserX, Edit2, Save, X, Search, User, Filter, MoreHorizontal } from 'lucide-react';

export default function UsersManager() {
  const { hasPermission, refreshProfile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [usersRes, rolesRes] = await Promise.all([
      usersApi.getAllUsers(),
      usersApi.getRoles(),
    ]);
    if (usersRes.success) setUsers(usersRes.data || []);
    if (rolesRes.success) setRoles(rolesRes.data || []);
    setLoading(false);
  };

  const startEdit = (user: any) => {
    setEditingId(user.id);
    setEditRole(user.roles?.[0]?.id || '');
    setEditStatus(user.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRole('');
    setEditStatus('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    if (editRole) {
      await usersApi.updateUserRole(editingId, editRole);
    }
    if (editStatus) {
      await usersApi.updateUserStatus(editingId, editStatus);
    }
    
    await usersApi.logAuditEvent('UPDATE', 'users', 'user', editingId, {
      role_id: editRole,
      status: editStatus,
    });
    
    await loadData();
    cancelEdit();
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-50 text-green-700 border-green-200',
      INVITED: 'bg-blue-50 text-blue-700 border-blue-200',
      SUSPENDED: 'bg-amber-50 text-amber-700 border-amber-200',
      DISABLED: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const filtered = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-4 border-[var(--color-brand)]/20 border-t-[var(--color-brand)] rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard permission={PERMISSIONS.USERS_VIEW}>
      <div className="max-w-7xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight mb-1">User Management</h1>
            <p className="text-[var(--color-text-soft)] text-sm">Manage admin access, roles, and system permissions.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-primary btn-sm">
              <User size={16} />
              <span>Invite User</span>
            </button>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-[var(--color-border-soft)] flex items-center justify-between gap-4 bg-[var(--color-bg-soft)]/50">
            <div className="relative w-full max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-shadow"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-text-soft)] bg-white border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-soft)] transition-colors">
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-bg-soft)]/30">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Last Login</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)]">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--color-bg-soft)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-text)] text-sm">{user.name || 'Unnamed User'}</p>
                          <p className="text-xs text-[var(--color-text-soft)]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === user.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:border-[var(--color-brand)]"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-brand)]/5 text-[var(--color-brand)] text-xs font-semibold tracking-wide">
                          <Shield size={12} />
                          {user.roles?.[0]?.name?.replace('_', ' ') || 'No Role'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === user.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:border-[var(--color-brand)]"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="SUSPENDED">Suspended</option>
                          <option value="DISABLED">Disabled</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold tracking-wide ${getStatusBadge(user.status)}`}>
                          {user.status === 'ACTIVE' ? <UserCheck size={12} /> : <UserX size={12} />}
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[var(--color-text-soft)] font-medium">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={saveEdit}
                            className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                            title="Save"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(user)}
                            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] rounded-md transition-colors"
                            title="Edit User"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-soft)] rounded-md transition-colors"
                            title="More Options"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <User size={32} className="mx-auto text-[var(--color-text-muted)] mb-3 opacity-50" />
                <p className="text-sm font-medium text-[var(--color-text)]">No users found</p>
                <p className="text-xs text-[var(--color-text-soft)] mt-1">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
