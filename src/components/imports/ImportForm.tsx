import { ImportedObject } from '../../services/import/imported-object.service';
import { Input } from '../ui/Input';
import { theme } from '../../theme';

interface ImportFormProps {
  formData: Partial<ImportedObject>;
  isLoading: boolean;
  onChange: (field: keyof ImportedObject, value: string) => void;
}

export function ImportForm({ formData, isLoading, onChange }: ImportFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Import Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              External ID
            </label>
            <Input
              type="text"
              value={formData.externalId || ''}
              onChange={(e) => onChange('externalId', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <Input
              type="text"
              value={formData.type || ''}
              onChange={(e) => onChange('type', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <Input
              type="text"
              value={formData.userId || ''}
              onChange={(e) => onChange('userId', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Data</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Import Data
            </label>
            <textarea
              value={formData.data || ''}
              onChange={(e) => onChange('data', e.target.value)}
              disabled={isLoading}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}