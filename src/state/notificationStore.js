export let notifications = [];

export function setNotifications(data) {
    notifications = data;
}

export function addNotificationData(title, message, type = 'general') {
    notifications.unshift({
        id: "NOTIF-" + Date.now(),
        title: title,
        message: message,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: type
    });
}
