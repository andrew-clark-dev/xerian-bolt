import { ChevronUp, ChevronDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortColumn: keyof T | null;
  sortDirection: SortDirection;
  onSort: (column: keyof T) => void;
}

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
}

export function TableHeader<T>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key as string}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {column.sortable ? (
              <button
                className="flex items-center gap-1 hover:text-gray-700"
                onClick={() => onSort(column.key)}
              >
                {column.label}
                <span className="inline-flex flex-col">
                  <ChevronUp
                    className={`w-3 h-3 ${
                      sortColumn === column.key && sortDirection === 'asc'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <ChevronDown
                    className={`w-3 h-3 -mt-1 ${
                      sortColumn === column.key && sortDirection === 'desc'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  />
                </span>
              </button>
            ) : (
              column.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}