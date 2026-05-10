import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { useSelectedUser } from './hooks/useSelectedUser';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { UsersPage } from './pages/UsersPage';
import { VoiceTransactionPage } from './pages/VoiceTransactionPage';
import { theme } from './theme';

export function App() {
  const selectedUser = useSelectedUser();

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AppShell
          userId={selectedUser.userId}
          onUserIdChange={selectedUser.setUserId}
        />
      ),
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'transactions', element: <TransactionsPage /> },
        { path: 'voice', element: <VoiceTransactionPage /> },
        { path: 'users', element: <UsersPage /> },
      ],
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
