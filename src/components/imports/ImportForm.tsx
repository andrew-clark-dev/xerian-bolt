import { ImportedObject } from '../../services/import/imported-object.service';
import { Input } from '../ui/Input';
import { theme } from '../../theme';

interface ImportFormProps {
  formData: Partial<ImportedObject>;
  isLoading: boolean;
  readOnly?: boolean;
  onChange?: (field: keyof ImportedObject, value: string) => void;
}

export function ImportForm({ formData, isLoading, readOnly, onChange }: ImportFormProps) {
  const handleChange = (field: keyof ImportedObject, value: string) => {
    if (readOnly || !onChange) return;
    onChange(field, value);
  };

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
              onChange={(e) => handleChange('externalId', e.target.value)}
              disabled={isLoading}
              readOnly={readOnly}
              className={readOnly ? 'bg-gray-50' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <Input
              type="text"
              value={formData.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              disabled={isLoading}
              readOnly={readOnly}
              className={readOnly ? 'bg-gray-50' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <Input
              type="text"
              value={formData.userId || ''}
              onChange={(e) => handleChange('userId', e.target.value)}
              disabled={isLoading}
              readOnly={readOnly}
              className={readOnly ? 'bg-gray-50' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}