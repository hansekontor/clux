import styles from './styles.module.css';

const createNotificationContainer = () => {

    const containerId = "notification_container";
    let container = document.getElementById(containerId);
    if (container)
        return container;
    container = document.createElement('div');
    container.setAttribute('id', containerId);
    container.className = styles.container;
    document.body.appendChild(container);
    
    return container;
}

export default createNotificationContainer;