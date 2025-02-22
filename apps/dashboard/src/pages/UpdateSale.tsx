import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { saleService, type Sale, type Transaction } from '../services/sale.service';
import { SaleForm } from '../components/sales/SaleForm';
import { SaleItemList } from '../components/sales/SaleItemList';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';
import { formatPrice } from '../utils/format';

export function UpdateSale() {
  const navigate = useNavigate();
  const { number } = useParams();
  const [formData, setFormData] = useState<Partial<Sale>>({});
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSale = async () => {
      if (!number) {
        navigate('/sales');
        return;
      }

      try {
        const sale = await saleService.findSale(number);
        if (!sale) {
          navigate('/sales');
          return;
        }
        setFormData(sale);

        // Load transaction details
        if (sale.transaction) {
          const transactionDetails = await saleService.getTransaction(sale);
          setTransaction(transactionDetails);
        }
      } catch (err) {
        console.error('Failed to load sale:', err);
        navigate('/sales');
      }
    };

    loadSale();
  }, [number, navigate]);

  const handleFieldChange = (field: keyof Sale, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!number) return;

      const sale = await saleService.findSale(number);
      if (!sale) {
        throw new Error('Sale not found');
      }

      await saleService.updateSale({
        ...formData,
        number: sale.number,
      });
      navigate('/sales');
    } catch (err) {
      console.error('Failed to update sale:', err);
      setError('Failed to update sale. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/sales"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Update Sale</h1>
        </div>
      </div>

      <div className={`${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <SaleForm
            formData={formData}
            isLoading={isLoading}
            onChange={handleFieldChange}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/sales"
              className={theme.component('button', 'secondary')}
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Sale'}
            </Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Information */}
        <div className={`${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-medium ${theme.text()}`}>Transaction Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text('secondary')} mb-1`}>
                  Transaction ID
                </label>
                <div className={`text-sm ${theme.text()}`}>
                  {transaction?.id || '-'}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.text('secondary')} mb-1`}>
                  Payment Type
                </label>
                <div className={`text-sm ${theme.text()}`}>
                  {transaction?.paymentType || '-'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text('secondary')} mb-1`}>
                  Amount
                </label>
                <div className={`text-sm ${theme.text()}`}>
                  {formatPrice(transaction?.amount)}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.text('secondary')} mb-1`}>
                  Tax
                </label>
                <div className={`text-sm ${theme.text()}`}>
                  {formatPrice(transaction?.tax)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text('secondary')} mb-1`}>
                  Type
                </label>
                <div className={`text-sm ${theme.text()}`}>
                  {transaction?.type || '-'}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.text('secondary')} mb-1`}>
                  Status
                </label>
                <div className={`text-sm ${theme.text()}`}>
                  {transaction?.status || '-'}
                </div>
              </div>
            </div>

            {transaction?.linked && (
              <div>
                <label className={`block text-sm font-medium ${theme.text('secondary')} mb-1`}>
                  Linked Transaction
                </label>
                <div className={`text-sm ${theme.text()}`}>
                  {transaction.linked}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sale Items */}
        <div className={`${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-medium ${theme.text()}`}>Sale Items</h2>
          </div>
          <div className="p-4">
            <SaleItemList items={(formData.items || []).filter(item => item !== null && item !== undefined)} />
          </div>
        </div>
      </div>
    </div>
  );
}