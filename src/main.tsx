import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { ThemeProvider as AmplifyThemeProvider } from '@aws-amplify/ui-react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import outputs from '../amplify_outputs.json';

// Global error handler
window.onerror = (message, source, lineno, colno, error) => {
  // Find the error display element and show the error
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

const theme = {
  name: 'modern-dashboard',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#f0f9ff' },
          20: { value: '#e0f2fe' },
          40: { value: '#bae6fd' },
          60: { value: '#7dd3fc' },
          80: { value: '#38bdf8' },
          90: { value: '#0ea5e9' },
          100: { value: '#0284c7' },
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: { value: '0' },
          boxShadow: { value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
        },
      },
    },
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AmplifyThemeProvider theme={theme}>
        <App />
      </AmplifyThemeProvider>
    </ThemeProvider>
  </StrictMode>
);