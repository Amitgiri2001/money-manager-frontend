import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import InsightsIcon from '@mui/icons-material/Insights';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

type AppShellProps = {
  userId: number;
  onUserIdChange: (userId: number) => void;
};

const navItems = [
  { to: '/', label: 'Dashboard', icon: <InsightsIcon /> },
  { to: '/transactions', label: 'Transactions', icon: <ReceiptLongIcon /> },
  { to: '/voice', label: 'Voice transaction', icon: <GraphicEqIcon /> },
  { to: '/users', label: 'Users', icon: <PeopleIcon /> },
];

export function AppShell({ userId, onUserIdChange }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 8, sm: 0 } }}>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar
          sx={{
            gap: { xs: 1.25, sm: 2 },
            minHeight: { xs: 64, sm: 72 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            py: { xs: 1, sm: 0 },
          }}
        >
          <AccountBalanceWalletIcon color="primary" />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Money Manager
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {navItems.map((item) => (
              <Tooltip key={item.to} title={item.label}>
                <IconButton
                  component={NavLink}
                  to={item.to}
                  color="inherit"
                  sx={{
                    '&.active': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Stack>
          <TextField
            label="User ID"
            type="number"
            size="small"
            value={userId}
            onChange={(event) => onUserIdChange(Number(event.target.value))}
            inputProps={{ min: 1 }}
            sx={{ width: { xs: '100%', sm: 120 } }}
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Outlet context={{ userId }} />
      </Container>
      <BottomNavigation
        showLabels
        value={location.pathname}
        onChange={(_, value) => navigate(value)}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.to}
            label={item.label === 'Voice transaction' ? 'Voice' : item.label}
            value={item.to}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
