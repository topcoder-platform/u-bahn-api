/**
 * roles that used in service, all roles must match topcoder roles
 * Admin and Administrator are both admin user
 */
const UserRoles = {
  admin: 'Admin',
  administrator: 'Administrator',
  topcoderUser: 'Topcoder User',
  copilot: 'Copilot'
}
/**
 * all authenticated users.
 * @type {(string)[]}
 */
const AllAuthenticatedUsers = [UserRoles.admin, UserRoles.administrator, UserRoles.topcoderUser, UserRoles.copilot]

/**
 * all admin user
 */
const AdminUser = [UserRoles.admin, UserRoles.administrator]

module.exports = {
  UserRoles,
  AllAuthenticatedUsers,
  AdminUser
}
