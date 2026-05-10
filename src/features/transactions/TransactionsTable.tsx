import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { SpringPage } from '../../dtos/api';
import type { TxnResponseDto } from '../../dtos/txn.dto';
import { formatCurrency, formatDateTime } from '../../utils/date';

type TransactionsTableProps = {
  page: SpringPage<TxnResponseDto> | null;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDelete: (transactionId: number) => void;
};

export function TransactionsTable({
  page,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: TransactionsTableProps) {
  const rows = page?.content ?? [];

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
            {rows.length === 0 && (
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
