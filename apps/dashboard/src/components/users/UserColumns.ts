import type { UserProfile } from '../../services/profile.service';

export const RECORDS_PER_PAGE_OPTIONS = [10, 30, 100] as const;

export const columns = [
  { key: 'nickname' as keyof UserProfile, label: 'Name', sortable: true },
  { key: 'email' as keyof UserProfile, label: 'Email', sortable: true },
  { key: 'phoneNumber' as keyof UserProfile, label: 'Phone', sortable: true },
  { key: 'status' as keyof UserProfile, label: 'Status', sortable: true },
  { key: 'role' as keyof UserProfile, label: 'Role', sortable: true },
];

export const getStatusColor = (status: UserProfile['status']) => {
  const colors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };
  return colors[status] || colors.Inactive;
};

export const getRoleColor = (role: UserProfile['role']) => {
  const colors = {
    Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Employee: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    Service: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    Guest: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };
  return colors[role] || colors.Guest;
};