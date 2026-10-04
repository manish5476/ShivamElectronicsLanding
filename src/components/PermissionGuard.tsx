import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS, type Permission } from '../lib/permissions';
import { Shield } from 'lucide-react';

interface PermissionGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { hasPermission, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-light-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <PermissionDenied />;
  }

  return <>{children}</>;
}

export function PermissionDenied() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto mb-6 bg-cream rounded-full flex items-center justify-center">
          <Shield size={40} className="text-muted-gold" />
        </div>
        <h1 className="heading-serif text-3xl font-semibold text-espresso mb-4">
          Access Restricted
        </h1>
        <p className="text-taupe leading-relaxed mb-8">
          You don't have permission to access this area. Please contact your administrator if you believe this is an error.
        </p>
        <a
          href="#/admin/dashboard"
          className="inline-flex items-center gap-2 bg-espresso text-ivory px-6 py-3 text-sm font-sans font-medium hover:bg-espresso/90 transition-colors"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}

// Higher-order component for wrapping entire pages
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission
) {
  return function PermissionWrapped(props: P) {
    return (
      <PermissionGuard permission={permission}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}
