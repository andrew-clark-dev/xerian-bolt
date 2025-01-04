import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ImportedObject, importedObjectService } from '../services/imported-object.service';
import { ImportForm } from '../components/imports/ImportForm';
import { JsonViewer } from '../components/ui/JsonViewer';
import { theme } from '../theme';

export function ViewImport() {
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
        if (!importObj) {
          throw new Error('Import not found');
        }
        setFormData(importObj);
      } catch (err) {
        console.error('Failed to load import:', err);
        setError('Failed to load import. Please try again.');
        navigate('/imports');
      } finally {
        setIsLoading(false);
      }
    };

    loadImport();
  }, [externalId, navigate]);

  if (!externalId) {
    return null;
  }

  const importData = typeof formData.data === 'string' ? JSON.parse(formData.data) : null;

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
          <h1 className="text-2xl font-semibold text-gray-900">View Import</h1>
        </div>
      </div>

      <div className={`${theme.surface()} ${theme.border()} rounded-lg shadow-sm`}>
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <ImportForm
            formData={formData}
            isLoading={isLoading}
            readOnly
          />

          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme.text()}`}>Import Data</h3>
            {importData && (
              <JsonViewer data={importData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}