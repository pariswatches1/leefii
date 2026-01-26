// Role-based permissions for the admin panel

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface RolePermissions {
  // Content management
  strains: Permission;
  dispensaries: Permission;
  news: Permission;
  blog: Permission;
  deals: Permission;

  // User management
  users: Permission;
  sellers: Permission;
  reviews: Permission;

  // Business management
  sellerApplications: Permission;
  leadReferrals: Permission;
  products: Permission;
  journalEntries: Permission;

  // Admin management
  adminUsers: Permission;
  settings: Permission;
  analytics: Permission;
}

const fullAccess: Permission = { create: true, read: true, update: true, delete: true };
const readOnly: Permission = { create: false, read: true, update: false, delete: false };
const readUpdate: Permission = { create: false, read: true, update: true, delete: false };
const noAccess: Permission = { create: false, read: false, update: false, delete: false };

export const rolePermissions: Record<AdminRole, RolePermissions> = {
  SUPER_ADMIN: {
    strains: fullAccess,
    dispensaries: fullAccess,
    news: fullAccess,
    blog: fullAccess,
    deals: fullAccess,
    users: fullAccess,
    sellers: fullAccess,
    reviews: fullAccess,
    sellerApplications: fullAccess,
    leadReferrals: fullAccess,
    products: fullAccess,
    journalEntries: readOnly,
    adminUsers: fullAccess,
    settings: fullAccess,
    analytics: fullAccess,
  },
  ADMIN: {
    strains: fullAccess,
    dispensaries: fullAccess,
    news: fullAccess,
    blog: fullAccess,
    deals: fullAccess,
    users: readUpdate,
    sellers: readUpdate,
    reviews: fullAccess,
    sellerApplications: fullAccess,
    leadReferrals: readOnly,
    products: readOnly,
    journalEntries: readOnly,
    adminUsers: noAccess,
    settings: readOnly,
    analytics: readOnly,
  },
  EDITOR: {
    strains: { create: true, read: true, update: true, delete: false },
    dispensaries: { create: true, read: true, update: true, delete: false },
    news: fullAccess,
    blog: fullAccess,
    deals: fullAccess,
    users: readOnly,
    sellers: readOnly,
    reviews: readUpdate,
    sellerApplications: readOnly,
    leadReferrals: noAccess,
    products: readOnly,
    journalEntries: noAccess,
    adminUsers: noAccess,
    settings: noAccess,
    analytics: readOnly,
  },
};

export function hasPermission(
  role: AdminRole,
  resource: keyof RolePermissions,
  action: keyof Permission
): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;

  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions[action];
}

export function canAccess(
  role: AdminRole,
  resource: keyof RolePermissions
): boolean {
  return hasPermission(role, resource, "read");
}
