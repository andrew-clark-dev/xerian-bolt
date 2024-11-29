import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { persistenceService } from '../services/persistence';
import { PasswordDialog } from '../components/PasswordDialog';

export function UpdateUser() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    status: 'active' as const,
    role: 'employee' as const,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!email) {
        navigate('/users');
        return;
      }

      try {
        const user = await persistenceService.getUserByEmail(email);
        if (!user) {
          navigate('/users');
          return;
        }
        setFormData(user);
      } catch (err) {
        console.error('Failed to load user:', err);
        navigate('/users');
      }
    };

    loadUser();
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email) return;
      
      await persistenceService.updateUser(email, {
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });
      navigate('/users');
    } catch (err) {
      setError('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (password: string) => {
    try {
      setIsLoading(true);
      await persistenceService.signUpUser(email!, password);
      setShowPasswordDialog(false);
      navigate('/users');
    } catch (err) {
      setError('Failed to sign up user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isPending = formData.status === 'pending';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/users"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Update User</h1>
      </div>

      <div className="max-w-2xl bg-white shadow-sm rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
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
                value={formData.status}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="service">Service</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/users"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            {isPending && (
              <button
                type="button"
                onClick={() => setShowPasswordDialog(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Sign Up
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>

      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onConfirm={handleSignUp}
      />
    </div>
  );
}