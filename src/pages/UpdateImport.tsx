import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ImportedObject, importedObjectService } from '../services/import/imported-object.service';
import { ImportForm } from '../components/imports/ImportForm';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

export function UpdateImport() {
  const navigate = useNavigate();
  const { externalId } = useParams<{ externalId: string }>();
  const [formData, setFormData] = useState<Partial<ImportedObject>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadImport = async () => {
      if (!externalId) {
        console.error('No import ID provided');
        navigate('/imports');
        return;
      }

      try {
        setIsLoading(true);
        const importObj = await importedObjectService.getImportedObject(externalId);
        setFormData(importObj);
      } catch (err) {
        console.error('Failed to load import:', err);
        setError('Failed to load import. Please try again.');
        // Don't navigate away on error, let user see the error message
      } finally {
        setIsLoading(false);
      }
    };

    loadImport();
  }, [externalId, navigate]);

  const handleFieldChange = (field: keyof ImportedObject, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalId) {
      setError('Import ID is required');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await importedObjectService.updateImportedObject(externalId, formData);
      navigate('/imports');
    } catch (err) {
      console.error('Error updating import:', err);
      setError('Failed to update import. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/imports"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Update Import</h1>
        </div>
      </div>

      <div className={`${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <ImportForm
            formData={formData}
            isLoading={isLoading}
            onChange={handleFieldChange}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/imports"
              className={theme.component('button', 'secondary')}
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Import'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}