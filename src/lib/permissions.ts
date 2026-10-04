// Permission definitions and utilities
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  
  // Homepage
  HOMEPAGE_VIEW: 'homepage.view',
  HOMEPAGE_CREATE: 'homepage.create',
  HOMEPAGE_EDIT: 'homepage.edit',
  HOMEPAGE_DELETE: 'homepage.delete',
  HOMEPAGE_REORDER: 'homepage.reorder',
  HOMEPAGE_PUBLISH: 'homepage.publish',
  
  // Designs
  DESIGNS_VIEW: 'designs.view',
  DESIGNS_CREATE: 'designs.create',
  DESIGNS_EDIT: 'designs.edit',
  DESIGNS_DELETE: 'designs.delete',
  
  // Collections
  COLLECTIONS_VIEW: 'collections.view',
  COLLECTIONS_CREATE: 'collections.create',
  COLLECTIONS_EDIT: 'collections.edit',
  COLLECTIONS_DELETE: 'collections.delete',
  
  // Media
  MEDIA_VIEW: 'media.view',
  MEDIA_UPLOAD: 'media.upload',
  MEDIA_EDIT: 'media.edit',
  MEDIA_DELETE: 'media.delete',
  
  // Bookings
  BOOKINGS_VIEW: 'bookings.view',
  BOOKINGS_EDIT: 'bookings.edit',
  BOOKINGS_DELETE: 'bookings.delete',
  
  // Appearance
  APPEARANCE_VIEW: 'appearance.view',
  APPEARANCE_EDIT: 'appearance.edit',
  APPEARANCE_PUBLISH: 'appearance.publish',
  
  // Users
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_ASSIGN_ROLE: 'users.assign_role',
  
  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',
  
  // SEO
  SEO_VIEW: 'seo.view',
  SEO_EDIT: 'seo.edit',
  
  // Audit
  AUDIT_VIEW: 'audit.view',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role definitions
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CONTENT_ADMIN: 'CONTENT_ADMIN',
  EDITOR: 'EDITOR',
  BOOKING_MANAGER: 'BOOKING_MANAGER',
  MEDIA_MANAGER: 'MEDIA_MANAGER',
  SEO_MANAGER: 'SEO_MANAGER',
  SUPPORT_VIEWER: 'SUPPORT_VIEWER',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Permission matrix for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  
  CONTENT_ADMIN: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.HOMEPAGE_VIEW, PERMISSIONS.HOMEPAGE_CREATE, PERMISSIONS.HOMEPAGE_EDIT, 
    PERMISSIONS.HOMEPAGE_DELETE, PERMISSIONS.HOMEPAGE_REORDER,
    PERMISSIONS.DESIGNS_VIEW, PERMISSIONS.DESIGNS_CREATE, PERMISSIONS.DESIGNS_EDIT, PERMISSIONS.DESIGNS_DELETE,
    PERMISSIONS.COLLECTIONS_VIEW, PERMISSIONS.COLLECTIONS_CREATE, PERMISSIONS.COLLECTIONS_EDIT, PERMISSIONS.COLLECTIONS_DELETE,
    PERMISSIONS.MEDIA_VIEW, PERMISSIONS.MEDIA_UPLOAD, PERMISSIONS.MEDIA_EDIT, PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.BOOKINGS_VIEW,
  ],
  
  EDITOR: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.HOMEPAGE_VIEW, PERMISSIONS.HOMEPAGE_EDIT, PERMISSIONS.HOMEPAGE_REORDER,
    PERMISSIONS.DESIGNS_VIEW, PERMISSIONS.DESIGNS_EDIT,
    PERMISSIONS.COLLECTIONS_VIEW, PERMISSIONS.COLLECTIONS_EDIT,
    PERMISSIONS.MEDIA_VIEW, PERMISSIONS.MEDIA_UPLOAD, PERMISSIONS.MEDIA_EDIT,
    PERMISSIONS.APPEARANCE_VIEW, PERMISSIONS.APPEARANCE_EDIT,
  ],
  
  BOOKING_MANAGER: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.BOOKINGS_VIEW, PERMISSIONS.BOOKINGS_EDIT,
    PERMISSIONS.DESIGNS_VIEW,
    PERMISSIONS.COLLECTIONS_VIEW,
  ],
  
  MEDIA_MANAGER: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.MEDIA_VIEW, PERMISSIONS.MEDIA_UPLOAD, PERMISSIONS.MEDIA_EDIT, PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.DESIGNS_VIEW,
    PERMISSIONS.COLLECTIONS_VIEW,
  ],
  
  SEO_MANAGER: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SEO_VIEW, PERMISSIONS.SEO_EDIT,
    PERMISSIONS.HOMEPAGE_VIEW, PERMISSIONS.HOMEPAGE_EDIT,
  ],
  
  SUPPORT_VIEWER: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DESIGNS_VIEW,
    PERMISSIONS.COLLECTIONS_VIEW,
    PERMISSIONS.BOOKINGS_VIEW,
    PERMISSIONS.MEDIA_VIEW,
    PERMISSIONS.HOMEPAGE_VIEW,
  ],
};

// Helper function to check if user has permission
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission);
}

// Helper function to check if user has any of the required permissions
export function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(perm => userPermissions.includes(perm));
}

// Helper function to check if user has all required permissions
export function hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(perm => userPermissions.includes(perm));
}

// Get permissions for a role
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Module access mapping for navigation
export const MODULE_ACCESS: Record<string, Permission> = {
  dashboard: PERMISSIONS.DASHBOARD_VIEW,
  designs: PERMISSIONS.DESIGNS_VIEW,
  collections: PERMISSIONS.COLLECTIONS_VIEW,
  bookings: PERMISSIONS.BOOKINGS_VIEW,
  homepage: PERMISSIONS.HOMEPAGE_VIEW,
  appearance: PERMISSIONS.APPEARANCE_VIEW,
  media: PERMISSIONS.MEDIA_VIEW,
  users: PERMISSIONS.USERS_VIEW,
  activity: PERMISSIONS.AUDIT_VIEW,
};
