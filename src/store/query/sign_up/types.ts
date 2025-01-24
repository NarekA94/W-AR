export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  role: string;
  phone: Nullable<string>;
  state: string;
  accessToken: string;
  refreshToken: string;
}

export type SignUpRequest = LoginRequest;

export interface PhoneRequest {
  phone: string;
}
