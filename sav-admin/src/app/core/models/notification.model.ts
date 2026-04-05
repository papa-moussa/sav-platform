export type NotificationType = 'INFO' | 'ALERT' | 'MAINTENANCE';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  targetCompanyId: number | null;
  targetCompanyNom: string | null;
  createdAt: string;
}

export interface NotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  targetCompanyId: number | null;
}
