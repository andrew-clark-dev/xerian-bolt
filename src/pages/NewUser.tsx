import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { persistenceService } from '../services/persistence';
import { SuccessMessage } from '../components/SuccessMessage';
import { RoleCheckboxes } from '../components/user/RoleCheckboxes';
import type { Schema } from '../../amplify/data/resource';
import type { UserRole } from '../../amplify/data/resource';

type UserDAO = Schema['User']['type'];

export function NewUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    status: 'Pending' as const,
    roles: ['Employee'] as UserRole[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Check if user with email already exists
      const existingUser = await persistenceService.getUserByEmail(formData.email);
      if (existingUser) {
        setError('A user with this email already exists.');
        return;
      }

      const now = new Date().toISOString();
      const userDao: Omit<UserDAO, 'id'> = {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber || undefined,
        status: formData.status,
        role: formData.roles,
        settings: {},
        createdAt: now,
        updatedAt: now,
      };

      const createdUser = await persistenceService.createUser(userDao);
      setSuccessMessage(`User created successfully with ID: ${createdUser.id}`);

      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      setError('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/users"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New User</h1>
      </div>

      <div className="max-w-2xl bg-white shadow-sm rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <SuccessMessage
              message={successMessage}
              onClose={() => setSuccessMessage('')}
            />
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <input
                type="text"
                value="Pending"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roles
              </label>
              <RoleCheckboxes
                selectedRoles={formData.roles}
                onChange={(roles) => setFormData({ ...formData, roles })}
              />
              {formData.roles.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  Please select at least one role
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/users"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || formData.roles.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}