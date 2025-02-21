import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService, type Item } from '../services/item.service';
import { ItemForm } from '../components/items/ItemForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';
import { Search } from 'lucide-react';

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

  const handleFindSimilar = async () => {
    if (!formData.title && !formData.category && !formData.brand) {
      setError('Please enter a title, category, or brand to find similar items');
      return;
    }

    // Build search query from available fields
    const searchTerms = [formData.title, formData.category, formData.brand]
      .filter(Boolean)
      .join(' ');

    try {
      const similarItem = await itemService.findFirstExternalItem(searchTerms);
      if (similarItem) {
        setFormData(prev => ({
          ...prev,
          category: similarItem.category || prev.category,
          brand: similarItem.brand || prev.brand,
          color: similarItem.color || prev.color,
          size: similarItem.size || prev.size,
          split: similarItem.split || prev.split,
          price: similarItem.price || prev.price,
        }));
      } else {
        setError('No similar items found');
      }
    } catch (error) {
      console.error('Failed to find similar items:', error);
      setError('Failed to find similar items. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">New Item</h1>
        <Button
          type="button"
          onClick={handleFindSimilar}
          className="inline-flex items-center gap-2"
          variant="secondary"
        >
          <Search className="w-4 h-4" />
          Find Similar
        </Button>
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
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/items')}
            >
              Cancel
            </Button>
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