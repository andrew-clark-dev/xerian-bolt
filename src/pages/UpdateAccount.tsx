import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { accountService, type Account } from '../services/account.service';
import { AccountForm } from '../components/accounts/AccountForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

export function UpdateAccount() {
  const navigate = useNavigate();
  const { number } = useParams();
  const [formData, setFormData] = useState<Partial<Account>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      if (!number) {
        navigate('/accounts');
        return;
      }

      try {
        const account = await accountService.findAccount(number);
        if (!account) {
          navigate('/accounts');
          return;
        }
        setFormData(account);
      } catch (err) {
        console.error('Failed to load account:', err);
        navigate('/accounts');
      }
    };

    loadAccount();
  }, [number, navigate]);

  const handleFieldChange = (field: keyof Account, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!number) return;

      const account = await accountService.findAccount(number);
      if (!account) {
        throw new Error('Account not found');
      }

      await accountService.updateAccount(account.id, formData);
      navigate('/accounts');
    } catch (err) {
      console.error(`Error in update account}:`, err);

      setError('Failed to update account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/accounts"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Update Account</h1>
        </div>
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
              {isLoading ? 'Updating...' : 'Update Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}