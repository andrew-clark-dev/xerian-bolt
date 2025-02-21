import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { accountService, type Account } from '../services/account.service';
import { AccountForm } from '../components/accounts/AccountForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';
import { Item } from '../services/item.service';
import { formatPrice } from '../utils/format';

// Calculate minimum height for 5 rows plus header
// Row height (48px) * 5 rows + Header height (48px) = 288px
const MIN_TABLE_HEIGHT = '288px';

export function UpdateAccount() {
  const navigate = useNavigate();
  const { number } = useParams();
  const [formData, setFormData] = useState<Partial<Account>>({});
  const [items, setItems] = useState<Item[]>([]);
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

        // Load account items
        const accountItems = await accountService.getItems(number);
        if (accountItems) {
          setItems(accountItems);
        }
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

      await accountService.updateAccount({ ...formData, number: account.number });
      navigate('/accounts');
    } catch (err) {
      console.error(`Error in update account}:`, err);
      setError('Failed to update account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate item statistics
  const totalItems = items.length;
  const soldItems = items.filter(item => item.status === 'Sold').length;

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex-none">
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
      </div>

      <div className="flex-1 min-h-0 flex flex-col space-y-6 overflow-auto">
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

        <div className={`flex-1 min-h-0 flex flex-col ${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
          <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${theme.text()}`}>Account Items</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${theme.text('secondary')}`}>Total Items:</span>
                  <span className={`font-medium ${theme.text()}`}>{totalItems}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${theme.text('secondary')}`}>Sold Items:</span>
                  <span className={`font-medium ${theme.text()}`}>{soldItems}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto" style={{ minHeight: MIN_TABLE_HEIGHT }}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No items found for this account
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr
                      key={item.sku}
                      onClick={() => navigate(`/items/${item.sku}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.title || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : item.status === 'Sold'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {/* Add empty rows to maintain minimum height when there are fewer than 5 items */}
                {items.length > 0 && items.length < 5 && Array.from({ length: 5 - items.length }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td colSpan={5} className="px-6 py-4">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}