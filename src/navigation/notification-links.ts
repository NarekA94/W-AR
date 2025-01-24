import {DeepLinkPrefix} from './linking';

export enum NotificationType {
  order = '0',
  brand = '1',
}
export const notificationLinks: Record<NotificationType, string> = {
  [NotificationType.order]: 'rewards',
  [NotificationType.brand]: 'brand-screen',
};

export const getNotificationLink = (
  type: NotificationType,
  data?: Record<string, any>,
  body?: string,
) => {
  function extractOrderNumberFromBody(stringBody: string): string | null {
    const match = stringBody.match(/order #([A-Z0-9]+)/);
    return match ? match[1] : null;
  }

  if (type === NotificationType.brand) {
    return DeepLinkPrefix + notificationLinks[type] + '?brandId=' + data?.id;
  }
  if (type === NotificationType.order) {
    return (
      DeepLinkPrefix +
      notificationLinks[type] +
      '/' +
      extractOrderNumberFromBody(body || '')
    );
  }
  return DeepLinkPrefix + notificationLinks[type];
};
