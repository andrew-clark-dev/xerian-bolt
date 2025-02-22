import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { ThemeProvider } from '@aws-amplify/ui-react';
import App from './App';
import { ErrorProvider } from './components/ErrorDisplay';
import { authenticatorTheme } from './theme/authenticator';
import './index.css';
import outputs from '../../../packages/backend/amplify_outputs.json';

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