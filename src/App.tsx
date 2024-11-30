import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginForm } from './components/auth/LoginForm';
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
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onSignOut={logout} />}>
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
  );
}