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
        Header: () => (
          <div className="flex flex-col items-center py-8">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl mb-4">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Login
            </h1>
          </div>
        ),
      }}
      services={{
        async validateCustomSignUp(formData) {
          if (!formData.email) {
            return {
              email: 'Email is required',
            };
          }
          if (!formData.password) {
            return {
              password: 'Password is required',
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