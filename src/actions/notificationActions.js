import Notifications from 'react-notification-system-redux';

export function displayNotification(level, title, message) {
  let notificationOps = {
    title,
    message,
    position: 'tr'
  };
  switch(level) {
    case 'success':
      notificationOps = {...notificationOps, autoDismiss: 2};
      return Notifications.success(notificationOps);
    case 'error':
      notificationOps = {...notificationOps, autoDismiss: 3};
      return Notifications.error(notificationOps);
    case 'warning':
      notificationOps = {...notificationOps, autoDismiss: 3};
      return Notifications.warning(notificationOps);
    default:
      notificationOps = {...notificationOps, autoDismiss: 3};
      return Notifications.info(notificationOps);
  }
}
