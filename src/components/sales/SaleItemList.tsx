import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme';
import { formatPrice } from '../../utils/format';
import { SaleItem } from '@/src/services/item.service';

interface SaleItemListProps {
  items: SaleItem[];
}

export function SaleItemList({ items }: SaleItemListProps) {
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className={`text-center py-8 ${theme.text('secondary')}`}>
        No items in this sale
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item) => (
            <tr
              key={item.sku}
              onClick={() => navigate(`/items/${item.sku}`)}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {item.sku}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.title || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.price ? formatPrice(item.price) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}