import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { accountService, type Account } from '../services/account.service';
import { profileService } from '../services/profile.service';
import { AccountForm } from '../components/accounts/AccountForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type AccountFormData = Omit<Account, 'id' | 'items' | 'transactions' | 'createdAt' | 'updatedAt' | 'tags' | 'userId'>;

export function NewAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AccountFormData>({
    number: '',
    lastActivityBy: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    isMobile: false,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postcode: '',
    comunicationPreferences: 'None',
    status: 'Active',
    kind: 'Standard',
    defaultSplit: 0,
    balance: 0,
    noSales: 0,
    noItems: 0,
    lastActivityAt: new Date().toISOString(),
    lastItemAt: null,
    lastSettlementAt: null,
    deletedAt: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (field: keyof AccountFormData, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if account number already exists
      const existingAccount = await accountService.findAccount(formData.number);
      if (existingAccount) {
        setError('An account with this number already exists.');
        setIsLoading(false);
        return;
      }

      const currentUserProfile = await profileService.getCurrentUserProfile();
      await accountService.createAccount({
        ...formData,
        lastActivityBy: currentUserProfile.id,
      });

      navigate('/accounts');
    } catch (error) {
      console.error('Failed to create account:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/accounts"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Account</h1>
      </div>

      <div className={`${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <AccountForm
            formData={formData}
            isLoading={isLoading}
            onChange={handleFieldChange}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/accounts"
              className={theme.component('button', 'secondary')}
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}