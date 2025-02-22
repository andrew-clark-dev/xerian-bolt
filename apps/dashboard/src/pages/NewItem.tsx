import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { itemService, type Item } from '../services/item.service';
import { ItemForm } from '../components/items/ItemForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type ItemFormData = Omit<Item, 'id' | 'account' | 'transactions' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>;

export function NewItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ItemFormData>({
    sku: '',
    title: '',
    category: '',
    brand: '',
    color: '',
    size: '',
    description: '',
    details: '',
    images: [],
    condition: 'NotSpecified',
    quantity: 1,
    split: 50,
    price: 0,
    status: 'Created',
    statuses: null,
    printedAt: null,
    lastSoldAt: null,
    lastViewedAt: null,
    deletedAt: null,
    accountNumber: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (field: keyof ItemFormData, value: string | string[] | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if item with SKU already exists
      const existingItem = await itemService.findItem(formData.sku);
      if (existingItem) {
        setError('An item with this SKU already exists.');
        setIsLoading(false);
        return;
      }

      await itemService.createItem(formData);
      navigate('/items');
    } catch (error) {
      console.error('Failed to create item:', error);
      setError('Failed to create item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/items"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Item</h1>
      </div>

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
              {isLoading ? 'Creating...' : 'Create Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}