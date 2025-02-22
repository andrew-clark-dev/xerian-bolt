import { theme } from '../../../theme';
import { DateRange } from '../../../services/import/types';

interface DateRangeFieldsProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

function setTimeToMidday(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(12, 0, 0, 0);
  return newDate;
}

export function DateRangeFields({ value, onChange }: DateRangeFieldsProps) {
  const handleDateChange = (field: keyof DateRange, dateStr: string) => {
    const date = setTimeToMidday(new Date(dateStr));
    onChange({
      ...value,
      [field]: date
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="fromDate" className={`block text-sm font-medium ${theme.text()} mb-1`}>
          From Date
        </label>
        <input
          type="date"
          id="fromDate"
          value={value.from.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange('from', e.target.value)}
          className={`w-full px-3 py-2 ${theme.border()} border rounded-lg ${theme.surface('secondary')} ${theme.text()}`}
          required
        />
      </div>
      <div>
        <label htmlFor="toDate" className={`block text-sm font-medium ${theme.text()} mb-1`}>
          To Date
        </label>
        <input
          type="date"
          id="toDate"
          value={value.to.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange('to', e.target.value)}
          className={`w-full px-3 py-2 ${theme.border()} border rounded-lg ${theme.surface('secondary')} ${theme.text()}`}
          required
        />
      </div>
    </div>
  );
}