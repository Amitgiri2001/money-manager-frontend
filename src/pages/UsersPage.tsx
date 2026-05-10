import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { listUsers } from '../api/usersApi';
import { AppErrorAlert } from '../components/AppErrorAlert';
import { PageHeader } from '../components/PageHeader';
import type { UserResponseDto } from '../dtos/user.dto';
import { useApiAction } from '../hooks/useApiAction';
import { formatDateTime } from '../utils/date';

export function UsersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const { loading, error, run } = useApiAction();

  async function loadUsers() {
    await run(async () => {
      setUsers(await listUsers());
    });
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  return (
    <>
      <PageHeader
        title="Users"
        action={
          <Button startIcon={<RefreshIcon />} variant="outlined" disabled={loading} onClick={loadUsers}>
            Refresh
          </Button>
        }
      />
      <Stack spacing={2}>
        <AppErrorAlert error={error} />
        {isMobile ? (
          <MobileUsersList users={users} loading={loading} />
        ) : (
          <DesktopUsersTable users={users} loading={loading} />
        )}
      </Stack>
    </>
  );
}

function DesktopUsersTable({ users, loading }: { users: UserResponseDto[]; loading: boolean }) {
  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && users.length === 0 && <DesktopUsersSkeleton />}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <UserStatusChip user={user} />
                </TableCell>
                <TableCell>{formatDateTime(user.createdAt)}</TableCell>
              </TableRow>
            ))}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function MobileUsersList({ users, loading }: { users: UserResponseDto[]; loading: boolean }) {
  return (
    <Stack spacing={1.5}>
      {loading && users.length === 0 && <MobileUsersSkeleton />}
      {users.map((user) => (
        <Card key={user.id} variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <UserStatusChip user={user} />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                ID {user.id} · Created {formatDateTime(user.createdAt)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
      {!loading && users.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
          No users found.
        </Typography>
      )}
    </Stack>
  );
}

function UserStatusChip({ user }: { user: UserResponseDto }) {
  return (
    <Chip
      size="small"
      color={user.isDeleted ? 'default' : 'success'}
      label={user.isDeleted ? 'Deleted' : 'Active'}
    />
  );
}

function DesktopUsersSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton width={40} /></TableCell>
          <TableCell><Skeleton width={140} /></TableCell>
          <TableCell><Skeleton width={220} /></TableCell>
          <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
          <TableCell><Skeleton width={150} /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function MobileUsersSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            <Stack spacing={1}>
              <Skeleton width="50%" />
              <Skeleton width="80%" />
              <Skeleton width="65%" />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
