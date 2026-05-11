import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { getMonthlyAnalytics } from '../api/analyticsApi';
import { queryKeys } from '../api/queryKeys';
import { AppErrorAlert } from '../components/AppErrorAlert';
import { PageHeader } from '../components/PageHeader';
import type { MonthlyAnalyticsDto } from '../dtos/txn.dto';
import type { AppOutletContext } from '../types/app';
import { formatCurrency, toMonthInputValue } from '../utils/date';
import { toApiError } from '../api/http';

const cards: Array<{ label: string; key: keyof MonthlyAnalyticsDto; currency?: boolean }> = [
  { label: 'Income', key: 'totalIncome', currency: true },
  { label: 'Expense', key: 'totalExpense', currency: true },
  { label: 'Investment', key: 'totalInvestment', currency: true },
  { label: 'Loan', key: 'totalLoan', currency: true },
  { label: 'Effective Balance', key: 'effectiveBalance', currency: true },
  { label: 'Current Balance', key: 'currentBalance', currency: true },
  { label: 'Transactions', key: 'transactionCount' },
];

export function DashboardPage() {
  const { userId } = useOutletContext<AppOutletContext>();
  const [month, setMonth] = useState(toMonthInputValue());
  const {
    data: analytics = null,
    error,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<MonthlyAnalyticsDto>({
    queryKey: queryKeys.analytics.monthly(userId, month),
    queryFn: () => getMonthlyAnalytics(userId, month),
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              label="Month"
              type="month"
              size="small"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: 0, sm: 180 }, flexGrow: { xs: 1, sm: 0 } }}
            />
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              disabled={isFetching}
              onClick={() => refetch()}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Refresh
            </Button>
          </Stack>
        }
      />
      <Stack spacing={3}>
        <AppErrorAlert error={error ? toApiError(error) : null} />
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.key}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" variant="body2">
                    {card.label}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {isLoading && !analytics ? (
                      <Skeleton width="70%" />
                    ) : card.currency ? (
                      formatCurrency(Number(analytics?.[card.key] ?? 0))
                    ) : (
                      Number(analytics?.[card.key] ?? 0)
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </>
  );
}
