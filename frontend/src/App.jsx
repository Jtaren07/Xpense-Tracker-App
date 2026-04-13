import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import useStore from './store';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Transactions from './pages/transactions';
import Account from './pages/account-page';
import { setAuthToken } from './libs/apiCall';
import { Toaster } from 'sonner';
import Navbar from './components/navbar';


const RootLayout = () => {
  const {user} = useStore((state) => state);
  if (user?.token) {
    setAuthToken(user.token);
  }

  return !user ? (
    < Navigate to="/sign-in" replace={true} />
  ) : (
  <>
  <Navbar />
  <div className="min-h-[calc(100vh-100px)]">
    <Outlet />
  </div>
  </>
  );
};

function App() {
  const { theme } = useStore((state) => state);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <main>
      <div className={`w-full min-h-screen px-6 md:px-20 ${theme === 'dark' ? 'dark:bg-slate-900' : 'bg-gray-100'}`}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/overview" />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>

      <Toaster richColors position="top-center " />
    </main>
  )
}

export default App
