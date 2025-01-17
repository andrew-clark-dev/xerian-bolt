import { UserProfile } from '../../services/profile.service';
import { Input } from '../ui/Input';
import { theme } from '../../theme';

interface UserFormProps {
  formData: Partial<UserProfile>;
  isLoading: boolean;
  onChange: (field: keyof UserProfile, value: string | null) => void;
}

export function UserForm({ formData, isLoading, onChange }: UserFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nickname
            </label>
            <Input
              type="text"
              value={formData.nickname || ''}
              onChange={(e) => onChange('nickname', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => onChange('phoneNumber', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Account Settings */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Account Settings</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status || 'Pending'}
              onChange={(e) => onChange('status', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role || 'Guest'}
              onChange={(e) => onChange('role', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
              <option value="Service">Service</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <Input
              type="url"
              value={formData.photo || ''}
              onChange={(e) => onChange('photo', e.target.value)}
              disabled={isLoading}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>
      </div>

      {/* Settings JSON */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme.text()}`}>User Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Settings (JSON)
          </label>
          <textarea
            value={formData.settings || ''}
            onChange={(e) => onChange('settings', e.target.value)}
            disabled={isLoading}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}