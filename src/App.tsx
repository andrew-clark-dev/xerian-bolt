import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Accounts } from './pages/Accounts';
import { NewAccount } from './pages/NewAccount';
import { UpdateAccount } from './pages/UpdateAccount';
import { Users } from './pages/Users';
import { NewUser } from './pages/NewUser';
import { UpdateUserProfile } from './pages/UpdateUser';
import { Maintenance } from './pages/Maintenance';
import { Imports } from './pages/Imports';
import { UpdateImport } from './pages/UpdateImport';
import { SyncData } from './pages/SyncData';
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
                <Route index element={<Dashboard />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="accounts/new" element={<NewAccount />} />
                <Route path="accounts/:number" element={<UpdateAccount />} />
                <Route path="users" element={<Users />} />
                <Route path="users/new" element={<NewUser />} />
                <Route path="users/:email" element={<UpdateUserProfile />} />
                <Route path="imports" element={<Imports />} />
                <Route path="imports/:externalId" element={<UpdateImport />} />
                <Route path="sync" element={<SyncData />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="maintenance" element={<Maintenance />} />
              </Route>
            </Routes>
          </BrowserRouter>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}