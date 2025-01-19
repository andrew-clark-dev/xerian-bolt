import { ItemCreate } from '../../services/item.service';
import { Input } from '../ui/Input';
import { theme } from '../../theme';

interface ItemFormProps {
  formData: Partial<ItemCreate>;
  isLoading: boolean;
  onChange: (field: keyof ItemCreate, value: string | string[] | number | boolean | null) => void;
}

// interface ItemFormProps {

//   formData: Partial<ItemFormData>;

//   isLoading: boolean;

//   onChange: (field: keyof ItemFormData, value: string | number | boolean | null) => void;

// }

export function ItemForm({ formData, isLoading, onChange }: ItemFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <Input
              type="text"
              value={formData.sku || ''}
              onChange={(e) => onChange('sku', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              type="text"
              value={formData.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Input
              type="text"
              value={formData.category || ''}
              onChange={(e) => onChange('category', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <Input
              type="text"
              value={formData.brand || ''}
              onChange={(e) => onChange('brand', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <Input
                type="text"
                value={formData.color || ''}
                onChange={(e) => onChange('color', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <Input
                type="text"
                value={formData.size || ''}
                onChange={(e) => onChange('size', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              value={formData.details || ''}
              onChange={(e) => onChange('details', e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images (URLs, one per line)
            </label>
            <textarea
              value={formData.images?.join('\n') || ''}
              onChange={(e) => onChange('images', e.target.value.split('\n').filter(Boolean))}
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>
        </div>
      </div>

      {/* Item Status */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme.text()}`}>Item Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status || 'Created'}
              onChange={(e) => onChange('status', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Created">Created</option>
              <option value="Tagged">Tagged</option>
              <option value="Active">Active</option>
              <option value="Sold">Sold</option>
              <option value="ToDonate">To Donate</option>
              <option value="Donated">Donated</option>
              <option value="Parked">Parked</option>
              <option value="Returned">Returned</option>
              <option value="Expired">Expired</option>
              <option value="Lost">Lost</option>
              <option value="Stolen">Stolen</option>
              <option value="Multi">Multi</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              value={formData.condition || 'NotSpecified'}
              onChange={(e) => onChange('condition', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AsNew">As New</option>
              <option value="Good">Good</option>
              <option value="Marked">Marked</option>
              <option value="Damaged">Damaged</option>
              <option value="Unknown">Unknown</option>
              <option value="NotSpecified">Not Specified</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <Input
              type="number"
              value={formData.quantity || 1}
              onChange={(e) => onChange('quantity', parseInt(e.target.value))}
              disabled={isLoading}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme.text()}`}>Pricing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (in cents)
            </label>
            <Input
              type="number"
              value={formData.price || 0}
              onChange={(e) => onChange('price', parseInt(e.target.value))}
              disabled={isLoading}
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Split Percentage
            </label>
            <Input
              type="number"
              value={formData.split || 50}
              onChange={(e) => onChange('split', parseInt(e.target.value))}
              disabled={isLoading}
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme.text()}`}>Account</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <Input
            type="text"
            value={formData.accountNumber || ''}
            onChange={(e) => onChange('accountNumber', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}