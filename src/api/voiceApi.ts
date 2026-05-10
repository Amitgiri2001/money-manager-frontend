import { http, unwrapResponse } from './http';
import type { ApiResponse } from '../dtos/api';
import type {
  ConfirmTxnDto,
  ConfirmTxnResponseDto,
  ParsedTxnDto,
} from '../dtos/voice.dto';

export async function parseVoiceCommand(userId: number, command: string) {
  const response = await http.post<ApiResponse<ParsedTxnDto>>(
    `/api/voice/parse/${userId}`,
    command,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    },
  );

  return unwrapResponse(response);
}

export async function confirmVoiceTransaction(payload: ConfirmTxnDto) {
  const response = await http.post<ApiResponse<ConfirmTxnResponseDto>>(
    '/api/voice/confirm',
    payload,
  );

  return unwrapResponse(response);
}
