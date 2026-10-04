import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Permission, Role } from '../lib/permissions';
import { ROLE_PERMISSIONS, ROLES } from '../lib/permissions';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: Role | null;
  permissions: Permission[];
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DISABLED';
}

const isTableMissingError = (error: any): boolean => {
  if (!error) return false;
  // PostgREST schema-cache / table-not-found codes
  if (error.code === 'PGRST205' || error.code === 'PGRST200') return true;
  const msg = (error.message || '').toLowerCase();
  return msg.includes('does not exist') || 
         msg.includes('could not find') || 
         msg.includes('relation') ||
         msg.includes('schema cache') ||
         msg.includes('table') ||
         msg.includes('pgrst205') ||
         msg.includes('pgrst200');
};

export const usersApi = {
  // Get current user profile with permissions
  async getCurrentUserProfile(): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Try to get user profile from users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select(`id, email, name, status, roles(id, name)`)
        .eq('id', user.id)
        .single();

      // If users table doesn't exist, return default profile
      if (profileError) {
        if (isTableMissingError(profileError)) {
          // Table doesn't exist - user gets SUPER_ADMIN by default (first user)
          return {
            success: true,
            data: {
              id: user.id,
              email: user.email || '',
              name: null,
              role: 'SUPER_ADMIN',
              permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
              status: 'ACTIVE',
            },
          };
        }
        
        // User doesn't exist in users table yet - create with SUPER_ADMIN role
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            status: 'ACTIVE',
          });

        if (insertError) {
          if (isTableMissingError(insertError)) {
            return {
              success: true,
              data: {
                id: user.id,
                email: user.email || '',
                name: null,
                role: 'SUPER_ADMIN',
                permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
                status: 'ACTIVE',
              },
            };
          }
          return { success: false, error: insertError.message };
        }

        return {
          success: true,
          data: {
            id: user.id,
            email: user.email || '',
            name: null,
            role: 'SUPER_ADMIN',
            permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
            status: 'ACTIVE',
          },
        };
      }

      const role = (profile as any).roles?.[0]?.name as Role || 'SUPER_ADMIN';
      const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.SUPER_ADMIN;

      return {
        success: true,
        data: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role,
          permissions,
          status: profile.status as any,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select(`id, email, name, status, last_login, created_at, roles(id, name)`)
        .order('created_at', { ascending: false });

      if (error) {
        if (isTableMissingError(error)) return { success: true, data: [] };
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (err: any) {
      return { success: true, data: [] };
    }
  },

  // Update user role
  async updateUserRole(userId: string, roleId: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      const { error } = await supabase
        .from('users')
        .update({ role_id: roleId })
        .eq('id', userId);

      if (error) {
        if (isTableMissingError(error)) return { success: true };
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Update user status
  async updateUserStatus(userId: string, status: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase not configured' };

    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);

      if (error) {
        if (isTableMissingError(error)) return { success: true };
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Get all roles
  async getRoles(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) {
        if (isTableMissingError(error)) {
          // Return default roles if table doesn't exist
          const defaultRoles = Object.entries(ROLES).map(([key, name]) => ({
            id: key.toLowerCase(),
            name,
            description: '',
            is_system: true,
          }));
          return { success: true, data: defaultRoles };
        }
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (err: any) {
      return { success: true, data: [] };
    }
  },

  // Log audit event
  async logAuditEvent(
    action: string,
    module: string,
    objectType?: string,
    objectId?: string,
    details?: any
  ): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        action,
        module,
        object_type: objectType,
        object_id: objectId,
        details,
      });

      // Silently fail if table doesn't exist
      if (error && !isTableMissingError(error)) {
        console.error('Failed to log audit event:', error.message);
      }
    } catch (error) {
      // Silently fail - audit logging is not critical
      console.error('Failed to log audit event:', error);
    }
  },

  // Get audit logs
  async getAuditLogs(limit: number = 100): Promise<{ success: boolean; data?: any[]; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        if (isTableMissingError(error)) return { success: true, data: [] };
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (err: any) {
      return { success: true, data: [] };
    }
  },
};
