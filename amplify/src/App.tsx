import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Accounts } from './pages/Accounts';
import { NewAccount } from './pages/NewAccount';
import { UpdateAccount } from './pages/UpdateAccount';
import { Users } from './pages/Users';
import { NewUser } from './pages/NewUser';
import { UpdateUser } from './pages/UpdateUser';
import { Maintenance } from './pages/Maintenance';
import '@aws-amplify/ui-react/styles.css';

export default function App() {
  return (
    <Authenticator
      initialState="signIn"
      components={{
        Header() {
          return (
            <div className="flex flex-col items-center py-8">
              <h1 className="text-2xl font-bold text-gray-900">Modern Dashboard</h1>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>
          );
        },
      }}
      services={{
        async validateCustomSignUp(formData) {
          if (!formData.password || formData.password.length < 20) {
            return {
              password: 'Password must be at least 20 characters long',
            };
          }
          if (!/\d/.test(formData.password)) {
            return {
              password: 'Password must contain at least one number',
            };
          }
          return {};
        },
      }}
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
              <Route path="users/:email" element={<UpdateUser />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="maintenance" element={<Maintenance />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </Authenticator>
  );
}