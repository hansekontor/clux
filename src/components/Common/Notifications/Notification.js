import React, { useState, useEffect } from 'react';
import Paragraph from 'antd/lib/typography/Paragraph';
import { currency } from '@components/Common/Ticker';
import { notification } from 'antd';
import styled from 'styled-components';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { SlideInAnimation } from '@components/Common/CssAnimations';
import { theme } from '@components/styles';

const AnimationCtn = styled.div`
	max-width: 480px;
	position: relative;
	z-index: 3000;

    animation: slide-in-from-top 0.5s cubic-bezier(0.24, 0.48, 0.47, 0.95);
    ${SlideInAnimation}	

	overflow: hidden;
    visibility: ${props => props.$fadeOut ? "hidden" : "visible"};
    opacity: ${props => props.$fadeOut ? 0 : 1};
    transition: ${props => props.$fadeOut ? "visibility 0.5s linear, opacity 0.5s linear, max-height 1s 0.5s ease-out, margin-bottom 1s 0.5s" : "none"};
	max-height: ${props => props.$fadeOut ? "0px" : "50px"};
	margin-bottom: ${props => props.$fadeOut ? "0px" : "12px"};
`;
const NotificationCtn =  styled.div`    
	height: 50px;    
	padding: 0 17px;    
	gap: 10px;
    border-radius: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: ${props => props.$color ? props.color : '#FFFFFF'};
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
    color: ${props => props.$color ? props.color : '#002152'};
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


const Notification = ({
    type, 
    message,
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(async () => {
        await sleep(currency.notificationDurationShort * 1000);
        setIsClosing(true);
    }, []);

    useEffect(async() => {
        if (isClosing) {
            await sleep(2000);
            setIsClosed(true);            
        }
    }, [isClosing])

    if (isClosed) {
        return null;
    }

    return (
		<AnimationCtn $animate={true} fadeOut={isClosing}>
			<NotificationCtn $color={backgroundColor[type]}>
				{type === "success" && <CheckIcon />}
				{type === "error" && <ErrorIcon />}                
				{type === "info" && <InfoIcon />}
				<Text $color={textColor[type]}>{message}</Text>
			</NotificationCtn>s
		</AnimationCtn>

    )
}

export default Notification;