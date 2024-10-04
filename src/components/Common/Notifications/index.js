import React from 'react';
import ReactDOM from 'react-dom';

import NotificationCollector from './Collector';
import Notification from "./Notification";
import createNotificationContainer from './createContainer';

const container = createNotificationContainer();
let notify;

ReactDOM.render(
    <NotificationCollector
        setNotification={(notifyFn) => {
            notify = notifyFn;
        }}
    />,
    container
)

export { Notification };

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