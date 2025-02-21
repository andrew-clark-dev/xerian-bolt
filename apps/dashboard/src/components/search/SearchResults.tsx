import { Link } from 'react-router-dom';
import { Account } from '../../services/account.service';
import { Item } from '../../services/item.service';
import { Sale } from '../../services/sale.service';
import { theme } from '../../theme';
import { formatPrice } from '../../utils/format';

interface SearchResultsProps {
    accounts: Account[];
    items: Item[];
    sales: Sale[];
    isLoading: boolean;
    onClose: () => void;
}

export function SearchResults({ accounts, items, sales, isLoading, onClose }: SearchResultsProps) {
    if (!isLoading && accounts.length === 0 && items.length === 0 && sales.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No results found
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Searching...
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {accounts.length > 0 && (
                <div className="p-4">
                    <h3 className={`text-sm font-medium ${theme.text()} mb-2`}>Accounts</h3>
                    <div className="space-y-2">
                        {accounts.map(account => (
                            <Link
                                key={account.id}
                                to={`/accounts/${account.number}`}
                                onClick={onClose}
                                className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-sm font-medium ${theme.text()}`}>
                                            {account.number}
                                        </div>
                                        <div className={`text-sm ${theme.text('secondary')}`}>
                                            {[account.firstName, account.lastName].filter(Boolean).join(' ')}
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.status === 'Active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                            }`}
                                    >
                                        {account.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {items.length > 0 && (
                <div className="p-4">
                    <h3 className={`text-sm font-medium ${theme.text()} mb-2`}>Items</h3>
                    <div className="space-y-2">
                        {items.map(item => (
                            <Link
                                key={item.id}
                                to={`/items/${item.sku}`}
                                onClick={onClose}
                                className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-sm font-medium ${theme.text()}`}>
                                            {item.sku}
                                        </div>
                                        <div className={`text-sm ${theme.text('secondary')}`}>
                                            {item.title || item.category}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatPrice(item.price)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {sales.length > 0 && (
                <div className="p-4">
                    <h3 className={`text-sm font-medium ${theme.text()} mb-2`}>Sales</h3>
                    <div className="space-y-2">
                        {sales.map(sale => (
                            <Link
                                key={sale.id}
                                to={`/sales/${sale.number}`}
                                onClick={onClose}
                                className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-sm font-medium ${theme.text()}`}>
                                            {sale.number}
                                        </div>
                                        <div className={`text-sm ${theme.text('secondary')}`}>
                                            {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatPrice(sale.total)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}