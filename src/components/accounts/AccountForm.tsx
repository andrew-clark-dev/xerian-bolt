import { Account } from '../../services/account.service';
import { Input } from '../ui/Input';
import { theme } from '../../theme';
import { formatBalance } from './AccountColumns';

interface AccountFormProps {
  formData: Partial<Account>;
  isLoading: boolean;
  onChange: (field: keyof Account, value: any) => void;
}

export function AccountForm({ formData, isLoading, onChange }: AccountFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <Input
              type="text"
              value={formData.number}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => onChange('firstName', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <Input
              type="text"
              value={formData.lastName || ''}
              onChange={(e) => onChange('lastName', e.target.value)}
              disabled={isLoading}
            />
          </div>

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

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Address</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1
            </label>
            <Input
              type="text"
              value={formData.addressLine1 || ''}
              onChange={(e) => onChange('addressLine1', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <Input
              type="text"
              value={formData.addressLine2 || ''}
              onChange={(e) => onChange('addressLine2', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Input
              type="text"
              value={formData.city || ''}
              onChange={(e) => onChange('city', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                type="text"
                value={formData.state || ''}
                onChange={(e) => onChange('state', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <Input
                type="text"
                value={formData.postcode || ''}
                onChange={(e) => onChange('postcode', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme.text()}`}>Account Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status || 'Active'}
              onChange={(e) => onChange('status', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              value={formData.kind || 'Standard'}
              onChange={(e) => onChange('kind', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Standard">Standard</option>
              <option value="VIP">VIP</option>
              <option value="Vender">Vendor</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Communication Preference
            </label>
            <select
              value={formData.comunicationPreferences || 'None'}
              onChange={(e) => onChange('comunicationPreferences', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TextMessage">Text Message</option>
              <option value="Email">Email</option>
              <option value="Whatsapp">WhatsApp</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme.text()}`}>Account Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Balance
            </label>
            <Input
              type="text"
              value={formData.balance ? formatBalance(formData.balance) : '-'}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Split
            </label>
            <Input
              type="number"
              value={formData.defaultSplit || 0}
              onChange={(e) => onChange('defaultSplit', parseInt(e.target.value))}
              disabled={isLoading}
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Sales
            </label>
            <Input
              type="text"
              value={formData.noSales || 0}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Items
            </label>
            <Input
              type="text"
              value={formData.noItems || 0}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}