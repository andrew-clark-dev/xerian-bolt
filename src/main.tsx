import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider } from './components/ErrorDisplay';
import './index.css';
import outputs from '../amplify_outputs.json';

// Global error handler
window.onerror = (message, source, lineno, colno, error) => {
  const event = new CustomEvent('uncaughtError', { detail: error || new Error(String(message)) });
  window.dispatchEvent(event);
};

// Global promise rejection handler
window.onunhandledrejection = (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  const customEvent = new CustomEvent('uncaughtError', { detail: error });
  window.dispatchEvent(customEvent);
};

Amplify.configure(outputs);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorProvider>
  </StrictMode>
);