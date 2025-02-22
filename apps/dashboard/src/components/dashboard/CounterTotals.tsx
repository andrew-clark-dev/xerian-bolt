import { useState, useEffect } from 'react';
import { counterService } from '../../services/counter.service';
import { theme } from '../../theme';
import { FileSpreadsheet, ShoppingBag, Receipt } from 'lucide-react';

interface CounterTotal {
    name: string;
    total: number;
    icon: React.ComponentType<{ className?: string }>;
}

export function CounterTotals() {
    const [totals, setTotals] = useState<CounterTotal[]>([
        { name: 'Accounts', total: 0, icon: FileSpreadsheet },
        { name: 'Items', total: 0, icon: ShoppingBag },
        { name: 'Transactions', total: 0, icon: Receipt },
    ]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTotals = async () => {
            try {
                const results = await Promise.all([
                    counterService.findTotal('Account'),
                    counterService.findTotal('Item'),
                    counterService.findTotal('Transaction'),
                ]);

                setTotals(prev => prev.map((item, index) => ({
                    ...item,
                    total: results[index]?.val || 0
                })));
            } catch (error) {
                console.error('Failed to load totals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTotals();
    }, []);

    if (isLoading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse`}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${theme.surface()} ${theme.border()} p-6 rounded-xl h-32`}>
                        <div className="h-full flex flex-col justify-between">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {totals.map((total) => {
                const Icon = total.icon;
                return (
                    <div
                        key={total.name}
                        className={`${theme.surface()} ${theme.border()} p-6 rounded-xl`}
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit">
                                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className={`${theme.text('secondary')} text-sm`}>{total.name}</p>
                                <p className={`${theme.text()} text-2xl font-bold mt-1`}>
                                    {total.total.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}