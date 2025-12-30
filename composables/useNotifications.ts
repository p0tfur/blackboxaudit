import { readonly } from "vue";

type NotificationType = "success" | "error" | "info" | "warning";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  dismissAfter: number;
  createdAt: number;
}

interface NotificationOptions {
  title?: string;
  dismissAfter?: number;
}

interface NotificationPayload extends NotificationOptions {
  type?: NotificationType;
  message: string;
}

const TYPE_TITLES: Record<NotificationType, string> = {
  success: "Success",
  error: "Error",
  info: "Info",
  warning: "Warning",
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
};

export const useNotifications = () => {
  const notifications = useState<AppNotification[]>("notifications", () => []);

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((notification) => notification.id !== id);
  };

  const scheduleRemoval = (id: string, timeout: number) => {
    if (timeout <= 0 || !import.meta.client) {
      return;
    }
    window.setTimeout(() => {
      removeNotification(id);
    }, timeout);
  };

  const pushNotification = ({ message, type = "info", title, dismissAfter = 5000 }: NotificationPayload) => {
    const id = generateId();
    const notification: AppNotification = {
      id,
      type,
      title: title ?? TYPE_TITLES[type],
      message,
      dismissAfter,
      createdAt: Date.now(),
    };
    notifications.value = [notification, ...notifications.value];
    scheduleRemoval(id, dismissAfter);
    return id;
  };

  const success = (message: string, options?: NotificationOptions) =>
    pushNotification({ type: "success", message, ...options });

  const error = (message: string, options?: NotificationOptions) =>
    pushNotification({ type: "error", message, ...options });

  const info = (message: string, options?: NotificationOptions) =>
    pushNotification({ type: "info", message, ...options });

  const warning = (message: string, options?: NotificationOptions) =>
    pushNotification({ type: "warning", message, ...options });

  return {
    notifications: readonly(notifications),
    pushNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };
};
