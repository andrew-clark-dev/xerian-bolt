import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { itemService, ItemUpdate, type Item } from '../services/item.service';
import { ItemForm } from '../components/items/ItemForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

export function UpdateItem() {
  const navigate = useNavigate();
  const { sku } = useParams();
  const [formData, setFormData] = useState<Partial<Item>>({});
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

  return (
    <div className="space-y-6">
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
    </div>
  );
}