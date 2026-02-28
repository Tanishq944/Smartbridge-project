// src/api/auth.ts
import { apiPost } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginRequest, LoginResponse>("/auth/login", data);
}
