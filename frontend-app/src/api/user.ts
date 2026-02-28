// src/api/user.ts
import { apiGet } from "./client";

export interface MeResponse {
  id: number;
  email: string;
  // add other fields if your User model has them
}

export async function getMe(token: string): Promise<MeResponse> {
  return apiGet<MeResponse>("/auth/me", token);
}
