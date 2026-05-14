import type {
  TxnClassificationDto,
  TxnClassificationLevel,
  TxnClassificationRequestDto,
} from '../dtos/txnClassification.dto';
import { http, unwrapResponse } from './http';

export async function fetchTxnClassifications(userId: number, level: TxnClassificationLevel) {
  const response = await http.get(`/api/txn-classifier/${userId}`, {
    params: { level },
  });

  return unwrapResponse<TxnClassificationDto[]>(response);
}

export async function createTxnClassification(payload: TxnClassificationRequestDto) {
  const response = await http.post('/api/txn-classifier', payload);

  return unwrapResponse<TxnClassificationDto>(response);
}
