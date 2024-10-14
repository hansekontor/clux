// node modules
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// custom react modules
import Notification from './Notification';

// styled css components
const NotificationBody = styled.div`
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const NotificationCtn = styled.div`
	position: fixed;
	top: 30px;
    width: 480px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 480px) {
        width: 100%;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
`;


const NotificationCollector = ({
    setNotification
}) => {
    const [notificationArray, setNotificationArray] = useState([]);

    const createNotification = (type, message) => {
        setNotificationArray((previousNotifications) => {
            return [
                ...previousNotifications, 
                {
                    type, 
                    message,
                    id: previousNotifications.length,
                }
            ];
        })
    };

    const destroyNotification = (id) => {
        const remainingNotifications = notificationArray.filter(
            (_, index) => id !== index, []
        );
        setNotificationArray(remainingNotifications);
    };
    
    useEffect(() => {
        setNotification(({ type, message}) => {
            createNotification(type, message);
        });
    }, [setNotification]);

    return (
        <NotificationBody>
            <NotificationCtn>
                <>
                    {notificationArray.map((item, index) => {
                        return (
							<Notification 
								key={item.id}
								message={item.message}
								type={item.type}
							/>        
                        )
                    })}                
                </>
            </NotificationCtn>
        </NotificationBody>        
    )
}

NotificationCollector.propTypes = {
    setNotification: PropTypes.func.isRequired
};

export default NotificationCollector;