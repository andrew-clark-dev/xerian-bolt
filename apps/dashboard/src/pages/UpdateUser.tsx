import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { profileService, UserProfile, UserRole, UserStatus } from '../services/profile.service';
import { PasswordDialog } from '../components/PasswordDialog';


export function UpdateUserProfile() {
  const navigate = useNavigate();
  const { nickname } = useParams();
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    phoneNumber: string;
    status: UserStatus;
    role: UserRole;
  }>({
    username: '',
    email: '',
    phoneNumber: '',
    status: 'Active',
    role: 'Employee',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!nickname) {
        navigate('/users');
        return;
      }

      try {
        const user = await profileService.findUserProfileByNickname(nickname);
        if (!user) {
          navigate('/users');
          return;
        }

        setFormData({
          username: user.nickname || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          status: user.status,
          role: user.role,
        });
      } catch (err) {
        console.error('Failed to load user:', err);
        navigate('/users');
      }
    };

    loadUserProfile();
  }, [nickname, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!nickname) return;

      const user = await profileService.findUserProfileByNickname(nickname);
      if (!user) {
        throw new Error('UserProfile not found');
      }

      await profileService.updateUserProfile({
        id: user.id,
        nickname: formData.username,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      navigate('/users');
    } catch (err) {
      console.error('Failed to update user:', err);

      setError('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (password: string) => {
    try {
      setIsLoading(true);
      // Implementation for password reset would go here
      console.error('reset password not implemented: ', password);

      setShowPasswordDialog(false);
      navigate('/users');
    } catch (err) {
      console.error('reset password:', err);

      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isPending = formData.status === 'Pending';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/users"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Update UserProfile</h1>
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
                UserProfilename
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
                value={formData.status ?? ''}
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
                value={formData.role ?? ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserProfile['role'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
                <option value="Service">Service</option>
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
                Reset Password
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update UserProfile'}
            </button>
          </div>
        </form>
      </div>

      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onConfirm={handlePasswordReset}
      />
    </div>
  );
}