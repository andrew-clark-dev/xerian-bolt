import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { NewItem } from './pages/NewItem';
import { Items } from './pages/Items';
import { UpdateItem } from './pages/UpdateItem';
import '@aws-amplify/ui-react/styles.css';

export default function App() {
  return (
    <ThemeProvider>
      <Authenticator
        initialState="signIn"
        signUpAttributes={['nickname']}
      >
        {({ signOut }) => (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout onSignOut={signOut} />}>
                <Route index element={<NewItem />} />
                <Route path="items" element={<Items />} />
                <Route path="items/:sku" element={<UpdateItem />} />
              </Route>
            </Routes>
          </BrowserRouter>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}