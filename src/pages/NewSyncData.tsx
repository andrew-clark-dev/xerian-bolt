import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SyncDataForm } from '../components/sync/SyncDataForm';
import { syncDataService, SyncData } from '../services/sync-data.service';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

export function NewSyncData() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<SyncData>>({
    interface: 'account',
    total: 0,
    lastSync: new Date().toISOString(),
    parameters: {
      path: '',
      include: [],
      expand: [],
    },
    log: {
      syncTime: new Date().toISOString(),
      recieved: 0,
      processed: 0,
      failed: 0,
    },
    history: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (field: keyof SyncData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await syncDataService.createSyncData(formData as SyncData);
      navigate('/sync');
    } catch (err) {
      console.error('Failed to create sync data:', err);
      setError('Failed to create sync data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/sync"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">New Sync Configuration</h1>
      </div>

      <div className={`${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <SyncDataForm
            formData={formData}
            isLoading={isLoading}
            onChange={handleFieldChange}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/sync"
              className={theme.component('button', 'secondary')}
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Sync Config'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}