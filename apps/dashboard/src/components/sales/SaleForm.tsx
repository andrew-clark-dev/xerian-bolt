import { Sale } from '../../services/sale.service';
import { Input } from '../ui/Input';
import { theme } from '../../theme';

interface SaleFormProps {
  formData: Partial<Sale>;
  isLoading: boolean;
  onChange: (field: keyof Sale, value: string | number | null) => void;
}


export function SaleForm({ formData, isLoading, onChange }: SaleFormProps) {
  // Convert cents to CHF for display
  const grossInCHF = formData.gross ? (formData.gross / 100).toFixed(2) : '0.00';
  const discountInCHF = formData.discount?.value ? (formData.discount.value / 100).toFixed(2) : '0.00';
  const taxInCHF = formData.tax ? (formData.tax / 100).toFixed(2) : '0.00';
  const totalInCHF = formData.total ? (formData.total / 100).toFixed(2) : '0.00';
  const accountTotalInCHF = formData.accountTotal ? (formData.accountTotal / 100).toFixed(2) : '0.00';
  const storeTotalInCHF = formData.storeTotal ? (formData.storeTotal / 100).toFixed(2) : '0.00';

  const handleAmountChange = (field: keyof Sale, value: string) => {
    // Convert CHF to cents for storage
    const amountInCents = Math.round(parseFloat(value) * 100);
    onChange(field, amountInCents);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Number
            </label>
            <Input
              type="text"
              value={formData.number || ''}
              onChange={(e) => onChange('number', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Email
            </label>
            <Input
              type="email"
              value={formData.customerEmail || ''}
              onChange={(e) => onChange('customerEmail', e.target.value)}
              disabled={isLoading}
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status || 'Pending'}
              onChange={(e) => onChange('status', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="Finalized">Finalized</option>
              <option value="Parked">Parked</option>
              <option value="Voided">Voided</option>
            </select>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Financial Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gross Amount (CHF)
            </label>
            <Input
              type="number"
              value={grossInCHF}
              onChange={(e) => handleAmountChange('gross', e.target.value)}
              disabled={isLoading}
              required
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (CHF)
            </label>
            <Input
              type="number"
              value={discountInCHF}
              onChange={(e) => handleAmountChange('discount', e.target.value)}
              disabled={isLoading}
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax (CHF)
            </label>
            <Input
              type="number"
              value={taxInCHF}
              onChange={(e) => handleAmountChange('tax', e.target.value)}
              disabled={isLoading}
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total (CHF)
            </label>
            <Input
              type="number"
              value={totalInCHF}
              onChange={(e) => handleAmountChange('total', e.target.value)}
              disabled={isLoading}
              required
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Split Information */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme.text()}`}>Split Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Total (CHF)
            </label>
            <Input
              type="number"
              value={accountTotalInCHF}
              onChange={(e) => handleAmountChange('accountTotal', e.target.value)}
              disabled={isLoading}
              required
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Total (CHF)
            </label>
            <Input
              type="number"
              value={storeTotalInCHF}
              onChange={(e) => handleAmountChange('storeTotal', e.target.value)}
              disabled={isLoading}
              required
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${theme.text()}`}>Additional Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID
            </label>
            <Input
              type="text"
              value={formData.transaction || ''}
              onChange={(e) => onChange('transaction', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refunded Sale Number
            </label>
            <Input
              type="text"
              value={formData.refundedSale || ''}
              onChange={(e) => onChange('refundedSale', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}