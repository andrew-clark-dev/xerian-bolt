import { SyncData, SyncInterface } from '../../services/sync-data.service';
import { Input } from '../ui/Input';
import { theme } from '../../theme';

interface SyncDataFormProps {
  formData: Partial<SyncData>;
  isLoading: boolean;
  onChange: (field: keyof SyncData, value: unknown) => void;
}

const INTERFACES: SyncInterface[] = ['account', 'item', 'sales', 'category'];

export function SyncDataForm({ formData, isLoading, onChange }: SyncDataFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Sync Configuration</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interface
            </label>
            <select
              value={formData.interface || ''}
              onChange={(e) => onChange('interface', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {INTERFACES.map((interface_) => (
                <option key={interface_} value={interface_}>
                  {interface_.charAt(0).toUpperCase() + interface_.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Records
            </label>
            <Input
              type="number"
              value={formData.total || 0}
              onChange={(e) => onChange('total', parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className={`text-lg font-medium ${theme.text()}`}>Parameters</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Path
            </label>
            <Input
              type="text"
              value={formData.parameters?.path || ''}
              onChange={(e) => onChange('parameters', {
                ...formData.parameters,
                path: e.target.value
              })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Include
            </label>
            <Input
              type="text"
              value={formData.parameters?.include?.join(', ') || ''}
              onChange={(e) => onChange('parameters', {
                ...formData.parameters,
                include: e.target.value.split(',').map(s => s.trim())
              })}
              disabled={isLoading}
              placeholder="Enter comma-separated values"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expand
            </label>
            <Input
              type="text"
              value={formData.parameters?.expand?.join(', ') || ''}
              onChange={(e) => onChange('parameters', {
                ...formData.parameters,
                expand: e.target.value.split(',').map(s => s.trim())
              })}
              disabled={isLoading}
              placeholder="Enter comma-separated values"
            />
          </div>
        </div>
      </div>
    </div>
  );
}