export interface VerifyPhoneStateData {
  state: 'sent' | 'timeout' | 'verified' | 'error';
  verificationId: string;
  code: string | null;
  error: unknown;
}
