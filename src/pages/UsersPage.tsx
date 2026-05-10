import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { listUsers } from '../api/usersApi';
import { AppErrorAlert } from '../components/AppErrorAlert';
import { PageHeader } from '../components/PageHeader';
import type { UserResponseDto } from '../dtos/user.dto';
import { useApiAction } from '../hooks/useApiAction';
import { formatDateTime } from '../utils/date';

export function UsersPage() {
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={user.isDeleted ? 'default' : 'success'}
                        label={user.isDeleted ? 'Deleted' : 'Active'}
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
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
      </Stack>
    </>
  );
}
