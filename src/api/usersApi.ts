import { http, unwrapResponse } from './http';
import type { ApiResponse } from '../dtos/api';
import type { UpdateUserDto, UserRequestDto, UserResponseDto } from '../dtos/user.dto';

export async function createUser(payload: UserRequestDto) {
  const response = await http.post<ApiResponse<UserResponseDto>>('/api/users/register', payload);
  return unwrapResponse(response);
}

export async function getUser(userId: number) {
  const response = await http.get<ApiResponse<UserResponseDto>>(`/api/users/${userId}`);
  return unwrapResponse(response);
}

export async function updateUser(userId: number, payload: UpdateUserDto) {
  const response = await http.patch<ApiResponse<UserResponseDto>>(`/api/users/${userId}`, payload);
  return unwrapResponse(response);
}

export async function deleteUser(userId: number) {
  const response = await http.delete<ApiResponse<UserResponseDto>>(`/api/users/${userId}`);
  return unwrapResponse(response);
}

export async function listUsers() {
  const response = await http.get<ApiResponse<UserResponseDto[]>>('/api/users/all');
  return unwrapResponse(response);
}
