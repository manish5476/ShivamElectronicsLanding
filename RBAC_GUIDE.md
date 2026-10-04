# Role-Based Access Control (RBAC) System

This document explains the RBAC system implemented in Mimiko Studio.

## Overview

The RBAC system provides granular permission control for admin users, ensuring that each user can only access the features and perform the actions appropriate for their role.

## Roles

### 1. Super Admin
**Full control over the entire platform**

Permissions:
- All permissions (view, create, edit, delete) for all modules
- User management (create, edit, delete users, assign roles)
- System settings and configuration
- Audit log access
- Publish changes to production

**Use case:** Platform owner, technical administrator

---

### 2. Content Admin
**Manage website content and homepage**

Permissions:
- Homepage: view, create, edit, delete, reorder sections
- Designs: view, create, edit, delete
- Collections: view, create, edit, delete
- Media: view, upload, edit, delete
- Bookings: view only

**Use case:** Content manager, marketing team lead

---

### 3. Editor
**Manage visual presentation and brand content**

Permissions:
- Homepage: view, edit, reorder (no create/delete)
- Designs: view, edit (no create/delete)
- Collections: view, edit (no create/delete)
- Media: view, upload, edit (no delete)
- Appearance: view, edit (no publish)

**Use case:** Designer, brand manager

---

### 4. Booking Manager
**Handle customer enquiries and bookings**

Permissions:
- Bookings: view, edit (change status)
- Designs: view only
- Collections: view only
- Dashboard: view

**Use case:** Customer service, sales team

---

### 5. Media Manager
**Manage photography and visual assets**

Permissions:
- Media: view, upload, edit, delete
- Designs: view only
- Collections: view only
- Dashboard: view

**Use case:** Photographer, asset manager

---

### 6. SEO Manager
**Manage search visibility and promotions**

Permissions:
- SEO: view, edit
- Homepage: view, edit (limited)
- Dashboard: view

**Use case:** SEO specialist, marketing analyst

---

### 7. Support/Viewer
**Read-only access for staff visibility**

Permissions:
- All modules: view only
- Dashboard: view

**Use case:** Support staff, interns, stakeholders

---

## Permission System

### Permission Structure

Each permission follows the format: `module.action`

**Modules:**
- `dashboard` - Dashboard access
- `homepage` - Homepage builder
- `designs` - Design/product management
- `collections` - Collection management
- `media` - Media library
- `bookings` - Booking management
- `appearance` - Appearance/theme settings
- `users` - User management
- `settings` - System settings
- `seo` - SEO settings
- `audit` - Audit logs

**Actions:**
- `view` - View/list items
- `create` - Create new items
- `edit` - Edit existing items
- `delete` - Delete items
- `publish` - Publish changes to production
- `assign_role` - Assign roles to users

### Example Permissions

```
designs.view      - Can view designs list
designs.create    - Can create new designs
designs.edit      - Can edit existing designs
designs.delete    - Can delete designs

homepage.view     - Can view homepage builder
homepage.create   - Can add new sections
homepage.edit     - Can edit section content
homepage.delete   - Can delete sections
homepage.publish  - Can publish homepage changes

users.view        - Can view user list
users.create      - Can create new users
users.edit        - Can edit user details
users.delete      - Can delete users
users.assign_role - Can change user roles
```

---

## Implementation

### Database Schema

The RBAC system uses the following tables:

1. **roles** - Defines available roles
2. **permissions** - Defines all possible permissions
3. **role_permissions** - Maps permissions to roles (many-to-many)
4. **users** - Extends Supabase auth.users with role assignment
5. **audit_logs** - Tracks all administrative actions

### Frontend Components

#### PermissionGuard
Wraps protected components and shows "Access Restricted" if user lacks permission.

```tsx
<PermissionGuard permission={PERMISSIONS.DESIGNS_CREATE}>
  <button>Create Design</button>
</PermissionGuard>
```

#### useAuth Hook
Provides permission checking functions:

```tsx
const { hasPermission, hasAnyPermission, role, permissions } = useAuth();

// Check single permission
if (hasPermission(PERMISSIONS.DESIGNS_CREATE)) {
  // Show create button
}

// Check multiple permissions (any)
if (hasAnyPermission([PERMISSIONS.DESIGNS_EDIT, PERMISSIONS.DESIGNS_CREATE])) {
  // Show edit/create options
}
```

### Navigation Filtering

The admin sidebar automatically filters navigation items based on user permissions:

```tsx
const navItems = allNavItems.filter(item => 
  hasPermission(item.permission)
);
```

Users only see menu items they have permission to access.

---

## User Management

### Accessing User Management

Navigate to `/admin/users` (requires `users.view` permission)

### Managing Users

1. **View Users** - See all admin users with their roles and status
2. **Edit User** - Change user's role or status
3. **User Statuses:**
   - `ACTIVE` - User can login and access the system
   - `SUSPENDED` - User account temporarily disabled
   - `DISABLED` - User account permanently disabled

### Changing Roles

1. Click the edit icon next to a user
2. Select new role from dropdown
3. Click save
4. User's permissions update immediately (may need to refresh browser)

---

## Audit Logging

### Accessing Audit Logs

Navigate to `/admin/activity` (requires `audit.view` permission)

### What Gets Logged

- User login/logout events
- Create/Update/Delete operations
- Role changes
- Permission changes
- Publishing actions

### Log Information

Each audit log entry contains:
- **Timestamp** - When the action occurred
- **User** - Who performed the action (email)
- **Action** - What type of action (CREATE, UPDATE, DELETE, etc.)
- **Module** - Which module was affected
- **Object Type** - What type of object (design, collection, user, etc.)
- **Object ID** - ID of the affected object
- **Details** - Additional context (JSON)

---

## Security Features

### 1. Frontend Permission Checks
- Navigation items filtered by permissions
- Action buttons hidden if user lacks permission
- Protected routes show "Access Restricted" page

### 2. Backend Permission Enforcement
- Supabase Row Level Security (RLS) policies
- API endpoints check user permissions
- Database operations restricted by role

### 3. Audit Trail
- All administrative actions logged
- Immutable audit logs (cannot be deleted)
- Tracks who did what and when

### 4. Session Management
- Secure session tokens
- Session expiration
- Logout from all devices option

---

## Best Practices

### For Super Admins

1. **Principle of Least Privilege**
   - Assign users the minimum permissions needed
   - Use specific roles instead of Super Admin when possible

2. **Regular Audits**
   - Review audit logs periodically
   - Check for unusual activity
   - Remove inactive users

3. **Role Assignment**
   - Start with Support/Viewer for new users
   - Upgrade permissions as needed
   - Document why each user has their role

### For Content Admins

1. **Content Review**
   - Review changes before publishing
   - Use preview mode to test changes
   - Keep backups of important content

2. **Media Management**
   - Organize media with clear naming
   - Delete unused media periodically
   - Use appropriate image sizes

### For All Users

1. **Security**
   - Use strong passwords
   - Log out when done
   - Don't share login credentials

2. **Responsibility**
   - Only perform actions within your role
   - Report permission issues to admin
   - Follow content guidelines

---

## Troubleshooting

### User Can't Access a Feature

1. Check user's role in User Management
2. Verify role has the required permission
3. User may need to refresh browser
4. Check if user status is ACTIVE

### Permission Changes Not Taking Effect

1. User needs to refresh browser or log out/in
2. Check if changes were saved in User Management
3. Verify Supabase connection is working

### Audit Log Not Recording

1. Check if user has `audit.view` permission
2. Verify audit_logs table exists in Supabase
3. Check browser console for errors

---

## Future Enhancements

Potential improvements for the RBAC system:

1. **Custom Roles** - Allow creating custom role combinations
2. **Permission Groups** - Group related permissions for easier management
3. **Temporary Permissions** - Grant time-limited permissions
4. **IP Restrictions** - Limit access by IP address
5. **Two-Factor Authentication** - Add 2FA for sensitive roles
6. **Approval Workflows** - Require approval for certain actions
7. **Bulk Operations** - Manage multiple users at once
8. **Permission Templates** - Pre-configured permission sets

---

## Support

For questions or issues with the RBAC system:

1. Check this documentation
2. Review audit logs for recent changes
3. Contact Super Admin for permission issues
4. Check Supabase dashboard for database errors

---

## Summary

The RBAC system provides:
- ✅ Granular permission control
- ✅ Role-based access management
- ✅ Audit logging for all actions
- ✅ Secure backend enforcement
- ✅ User-friendly admin interface
- ✅ Scalable permission model

This ensures that Mimiko Studio can grow with a secure, maintainable admin system where each team member has exactly the access they need.
