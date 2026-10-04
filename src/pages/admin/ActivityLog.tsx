import { useState, useEffect } from 'react';
import { usersApi } from '../../services/usersApi';
import { PermissionGuard } from '../../components/PermissionGuard';
import { PERMISSIONS } from '../../lib/permissions';
import { Activity, User, Clock, FileText, Search, Filter, History } from 'lucide-react';

export default function ActivityLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const result = await usersApi.getAuditLogs(200);
    if (result.success) {
      setLogs(result.data || []);
    }
    setLoading(false);
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-50 text-green-700 border-green-200',
      UPDATE: 'bg-blue-50 text-blue-700 border-blue-200',
      DELETE: 'bg-red-50 text-red-700 border-red-200',
      PUBLISH: 'bg-purple-50 text-purple-700 border-purple-200',
      LOGIN: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return colors[action] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getModuleIcon = (module: string) => {
    const icons: Record<string, string> = {
      products: '📦',
      categories: '📁',
      enquiries: '💬',
      homepage: '🏠',
      appearance: '🎨',
      media: '🖼️',
      users: '👥',
      settings: '⚙️',
    };
    return icons[module] || '📄';
  };

  const filteredLogs = logs.filter(l => 
    (l.user_email || '').toLowerCase().includes(search.toLowerCase()) || 
    (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.module || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-4 border-[var(--color-brand)]/20 border-t-[var(--color-brand)] rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Loading activity history...</p>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard permission={PERMISSIONS.AUDIT_VIEW}>
      <div className="max-w-7xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight mb-1">Activity Log</h1>
            <p className="text-[var(--color-text-soft)] text-sm">Track all administrative actions across the platform.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline btn-sm bg-white">
              <History size={16} />
              <span>Export Log</span>
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
                placeholder="Search by action, module, or user..."
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

          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center">
              <Activity size={40} className="mx-auto text-[var(--color-text-muted)] mb-4 opacity-50" />
              <p className="text-sm font-medium text-[var(--color-text)]">No activity recorded</p>
              <p className="text-xs text-[var(--color-text-soft)] mt-1">Actions taken by administrators will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-bg-soft)]/30">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Timestamp</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Action</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Module</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[var(--color-bg-soft)]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col text-sm">
                          <span className="font-medium text-[var(--color-text)]">{new Date(log.created_at).toLocaleDateString()}</span>
                          <span className="text-xs text-[var(--color-text-soft)] flex items-center gap-1 mt-0.5">
                            <Clock size={12} />
                            {new Date(log.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center">
                            <User size={12} />
                          </div>
                          <span className="text-sm font-medium text-[var(--color-text)]">{log.user_email || 'System'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-bold tracking-wide ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getModuleIcon(log.module)}</span>
                          <span className="text-sm font-medium text-[var(--color-text)] capitalize">{log.module}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[var(--color-text-soft)] max-w-md">
                          {log.object_type && (
                            <span className="inline-flex items-center gap-1 font-medium text-[var(--color-text)]">
                              <FileText size={12} className="text-[var(--color-text-muted)]" />
                              {log.object_type}
                              {log.object_id && (
                                <span className="text-xs text-[var(--color-text-muted)] font-mono ml-1">#{log.object_id.slice(0, 8)}</span>
                              )}
                            </span>
                          )}
                          {log.details && Object.keys(log.details).length > 0 && (
                            <div className="mt-1.5 text-xs bg-[var(--color-bg-soft)] p-2 rounded-md border border-[var(--color-border-soft)]">
                              {Object.entries(log.details).map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="text-[var(--color-text-muted)] min-w-[80px]">{key}:</span> 
                                  <span className="font-mono text-[var(--color-text)] truncate">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}
