import React from 'react';
import styled from 'styled-components';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { theme } from '@components/styles';

const NotificationCtn =  styled.div`    
	height: 50px;    
	padding: 0 17px;    
	gap: 10px;
    border-radius: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: ${props => props.$color ? props.$color : '#FFFFFF'};
`;

const CheckIcon = styled(CheckCircleOutlined)`
    color: #FFFFFF;
`;

const ErrorIcon = styled(CloseCircleOutlined)`
    color: #002152;
`;

const InfoIcon = styled(ExclamationCircleOutlined)`
    color: #002152;
`;

const Text = styled. div`
    color: ${props => props.$color ? props.$color : '#002152'};
    font-size: 18px;
    font-weight: 600;
`;

const backgroundColor = {
    info: theme.info.background,
    success: theme.success.background,
    error: theme.error.background
};

const textColor = {
    info: theme.info.color,
    success: theme.success.color,
    error: theme.error.color
};

export default function Notification({
    type,
    message,
}) {
    return (
        <NotificationCtn $color={backgroundColor[type]}>
            {type === "success" && <CheckIcon />}
            {type === "error" && <ErrorIcon />}
            {type === "info" && <InfoIcon />}
            <Text $color={textColor[type]}>{message}</Text>
        </NotificationCtn>
    )
}
