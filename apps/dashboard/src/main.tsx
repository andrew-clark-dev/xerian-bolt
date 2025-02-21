import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { ThemeProvider } from '@aws-amplify/ui-react';
import App from './App';
import { ErrorProvider } from './components/ErrorDisplay';
import { authenticatorTheme } from './theme/authenticator';
import './index.css';
import outputs from '../../backend/amplify_outputs.json';

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
      <ThemeProvider theme={authenticatorTheme}>
        <App />
      </ThemeProvider>
    </ErrorProvider>
  </StrictMode>
);