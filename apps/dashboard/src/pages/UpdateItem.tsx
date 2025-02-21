import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { itemService, ItemUpdate, type Item } from '../services/item.service';
import { ItemForm } from '../components/items/ItemForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';
import { Sale } from '../services/sale.service';
import { formatPrice } from '../utils/format';

export function UpdateItem() {
  const navigate = useNavigate();
  const { sku } = useParams();
  const [formData, setFormData] = useState<Partial<Item>>({});
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      if (!sku) {
        navigate('/items');
        return;
      }

      try {
        const item = await itemService.findItem(sku);
        if (!item) {
          navigate('/items');
          return;
        }
        setFormData(item);

        // Load item sales if they exist
        const itemSales = await itemService.getSales(item);
        setSales(itemSales);
      } catch (err) {
        console.error('Failed to load item:', err);
        navigate('/items');
      }
    };

    loadItem();
  }, [sku, navigate]);

  const handleFieldChange = (field: keyof ItemUpdate, value: string | string[] | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!sku) return;

      const item = await itemService.findItem(sku);
      if (!item) {
        throw new Error('Item not found');
      }

      await itemService.updateItem({
        ...formData,
        sku: item.sku,
      });
      navigate('/items');
    } catch (err) {
      console.error('Failed to update item:', err);
      setError('Failed to update item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate sales statistics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/items"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Update Item</h1>
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

            <ItemForm
              formData={formData}
              isLoading={isLoading}
              onChange={handleFieldChange}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/items"
                className={theme.component('button', 'secondary')}
              >
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Item'}
              </Button>
            </div>
          </form>
        </div>

        <div className={`${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-medium ${theme.text()}`}>Item Sales</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${theme.text('secondary')}`}>Total Sales:</span>
                  <span className={`font-medium ${theme.text()}`}>{totalSales}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${theme.text('secondary')}`}>Total Revenue:</span>
                  <span className={`font-medium ${theme.text()}`}>{formatPrice(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sale Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Account Split
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No sales found for this item
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr
                      key={sale.number}
                      onClick={() => navigate(`/sales/${sale.number}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {sale.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(sale.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(sale.accountTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sale.status === 'Finalized'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : sale.status === 'Voided'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}
                        >
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}