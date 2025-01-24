export interface CustomerNotification {
  id: number;
  state: number;
  type: number;
  subject: string;
  message: string;
  isSystemNotification: boolean;
  createdAt: string;
}
