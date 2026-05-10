import { http, unwrapResponse } from './http';
import type { ApiResponse } from '../dtos/api';
import type { MonthlyAnalyticsDto } from '../dtos/txn.dto';

export async function getMonthlyAnalytics(userId: number, month: string) {
  const response = await http.get<ApiResponse<MonthlyAnalyticsDto>>(
    `/api/txn/user/${userId}/analytics/monthly`,
    {
      params: { month },
    },
  );

  return unwrapResponse(response);
}
