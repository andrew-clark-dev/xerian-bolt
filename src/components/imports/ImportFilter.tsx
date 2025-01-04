import { theme } from '../../theme';

const IMPORT_TYPES = ['accounts', 'items', 'categories', 'sales', 'users'] as const;
export type ImportType = typeof IMPORT_TYPES[number];

interface ImportFilterProps {
  selectedType: ImportType | 'all';
  onChange: (type: ImportType | 'all') => void;
}

export function ImportFilter({ selectedType, onChange }: ImportFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label className={`text-sm font-medium ${theme.text('secondary')}`}>
        Type:
      </label>
      <select
        value={selectedType}
        onChange={(e) => onChange(e.target.value as ImportType | 'all')}
        className={`px-3 py-2 ${theme.border()} border rounded-lg ${theme.surface('secondary')} ${theme.text()}`}
      >
        <option value="all">All Types</option>
        {IMPORT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}