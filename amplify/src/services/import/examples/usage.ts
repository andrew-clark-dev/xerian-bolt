import { ImportService } from '../ImportService';

async function example() {
  // Initialize import service for Accounts
  const importService = new ImportService({
    modelType: 'Account',
    batchSize: 50,
    retryAttempts: 3,
    retryDelay: 1000
  });

  try {
    // Start import process
    for await (const progress of importService.execute()) {
      console.log(
        `Progress: ${progress.count}/${progress.total} - ${progress.message}`
      );
    }
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Example of aborting an import
async function abortExample() {
  const importService = new ImportService({
    modelType: 'Account'
  });

  // Start import in background
  const importPromise = (async () => {
    for await (const progress of importService.execute()) {
      console.log(
        `Progress: ${progress.count}/${progress.total} - ${progress.message}`
      );
    }
  })();

  // Abort after 5 seconds
  setTimeout(() => {
    importService.abort();
  }, 5000);

  await importPromise;
}