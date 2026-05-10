import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import InsightsIcon from '@mui/icons-material/Insights';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { NavLink, Outlet } from 'react-router-dom';

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
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <AccountBalanceWalletIcon color="primary" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Money Manager
          </Typography>
          <Stack direction="row" spacing={0.5}>
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
            sx={{ width: 120 }}
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet context={{ userId }} />
      </Container>
    </Box>
  );
}
