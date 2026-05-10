import { buildTransactionParams } from './queryParams';
import { http, unwrapResponse } from './http';
import type { ApiResponse, PageRequestDto, SpringPage } from '../dtos/api';
import type {
  TxnFilterDto,
  TxnRequestDto,
  TxnResponseDto,
  UpdateTxnDto,
} from '../dtos/txn.dto';

export async function createTransaction(payload: TxnRequestDto) {
  const response = await http.post<ApiResponse<TxnResponseDto>>('/api/txn', payload);
  return unwrapResponse(response);
}

export async function searchTransactions(
  userId: number,
  filters: TxnFilterDto,
  pageRequest: PageRequestDto,
) {
  const response = await http.get<ApiResponse<SpringPage<TxnResponseDto>>>(
    `/api/txn/user/${userId}`,
    {
      params: buildTransactionParams(filters, pageRequest),
    },
  );

  return unwrapResponse(response);
}

export async function updateTransaction(
  transactionId: number,
  payload: UpdateTxnDto,
) {
  const response = await http.patch<ApiResponse<TxnResponseDto>>(
    `/api/txn/${transactionId}`,
    payload,
  );
  return unwrapResponse(response);
}

export async function deleteTransaction(transactionId: number) {
  const response = await http.delete<ApiResponse<null>>(`/api/txn/${transactionId}`);
  return unwrapResponse(response);
}
