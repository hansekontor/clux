// node_modules
import React from 'react';
import ReactDOM from 'react-dom';

// custom react components
import NotificationCollector from './Collector';
import Notification from "./Notification";
import createNotificationContainer from './createContainer';

const container = createNotificationContainer();
let notify;

ReactDOM.render(
    <NotificationCollector
        setNotification={(notifier) => {
            notify = notifier;
        }}
    />,
    container
)

export const infoNotification = (message) => {
    return notify({
        type: "info",
        message
    });
}

export const successNotification = (message) => {
    return notify({
      type: "success",
      message
    });
  }

export const errorNotification = (message) => {
    return notify({
        type: "error",
        message
    })
}

export { Notification };