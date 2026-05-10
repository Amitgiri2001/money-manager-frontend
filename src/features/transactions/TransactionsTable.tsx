import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { SpringPage } from '../../dtos/api';
import type { TxnResponseDto } from '../../dtos/txn.dto';
import { formatCurrency, formatDateTime } from '../../utils/date';

type TransactionsTableProps = {
  page: SpringPage<TxnResponseDto> | null;
  loading: boolean;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDelete: (transactionId: number) => void;
};

export function TransactionsTable({
  page,
  loading,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: TransactionsTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const rows = page?.content ?? [];

  if (isMobile) {
    return (
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <Stack spacing={1.5} sx={{ p: 1.5 }}>
          {loading ? (
            <MobileTransactionSkeleton />
          ) : (
            rows.map((transaction) => (
              <Card key={transaction.id} variant="outlined">
                <CardContent>
                  <Stack spacing={1.25}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(transaction.time)}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Chip size="small" label={transaction.type} color="primary" variant="outlined" />
                          <Chip size="small" label={transaction.category} />
                        </Stack>
                      </Box>
                      <Typography variant="h6" align="right">
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {transaction.note || 'No note'}
                      </Typography>
                      <Tooltip title="Delete transaction">
                        <IconButton color="error" onClick={() => onDelete(transaction.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
          {!loading && rows.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No transactions found.
            </Typography>
          )}
        </Stack>
        <TablePagination
          component="div"
          count={page?.totalElements ?? 0}
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[10, 20, 50]}
          onPageChange={(_, nextPage) => onPageChange(nextPage)}
          onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
        />
      </Paper>
    );
  }

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <DesktopTransactionSkeleton />}
            {rows.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{formatDateTime(transaction.time)}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>{transaction.note || '-'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Delete transaction">
                    <IconButton color="error" onClick={() => onDelete(transaction.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    No transactions found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={page?.totalElements ?? 0}
        page={pageIndex}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageChange={(_, nextPage) => onPageChange(nextPage)}
        onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
      />
    </Paper>
  );
}

function DesktopTransactionSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton width={140} /></TableCell>
          <TableCell><Skeleton width={80} /></TableCell>
          <TableCell><Skeleton width={100} /></TableCell>
          <TableCell align="right"><Skeleton width={90} sx={{ ml: 'auto' }} /></TableCell>
          <TableCell><Skeleton width="70%" /></TableCell>
          <TableCell align="right"><Skeleton variant="circular" width={32} height={32} sx={{ ml: 'auto' }} /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function MobileTransactionSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Skeleton width="55%" />
              <Skeleton variant="rounded" height={28} width="75%" />
              <Skeleton width="40%" />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
