import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { saleService, type Sale } from '../services/sale.service';
import { SaleForm } from '../components/sales/SaleForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type SaleFormData = Omit<Sale, 'id' | 'items' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>;

export function NewSale() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SaleFormData>({
    number: '',
    customerEmail: '',
    accoutNumber: '',
    status: 'Pending',
    discount: 0,
    gross: 0,
    subTotal: 0,
    total: 0,
    tax: 0,
    change: 0,
    refund: 0,
    accountTotal: 0,
    storeTotal: 0,
    transaction: '',
    refundedSale: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (field: keyof SaleFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if sale number already exists
      const existingSale = await saleService.findSale(formData.number);
      if (existingSale) {
        setError('A sale with this number already exists.');
        setIsLoading(false);
        return;
      }

      await saleService.createSale(formData);
      navigate('/sales');
    } catch (error) {
      console.error('Failed to create sale:', error);
      setError('Failed to create sale. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/sales"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Sale</h1>
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
              {isLoading ? 'Creating...' : 'Create Sale'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}