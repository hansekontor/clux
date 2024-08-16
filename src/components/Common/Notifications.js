import React, { useState, useEffect } from 'react';
import Paragraph from 'antd/lib/typography/Paragraph';
import { currency } from '@components/Common/Ticker';
import { notification } from 'antd';
import styled, {css} from 'styled-components';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { FadeOutAnimationLong, SlideInAnimation } from '@components/Common/CssAnimations';

const SlideIn = styled.div`
    z-index: 33;
    height: 50px;
    padding: 0 17px;
    position: absolute;
    top: 13%;
    border-radius: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: ${props => props.type ? (
        props.type === 'success' ? '#38A368' : '#FB918E'
        ) : '#FFFFFF'};

    animation: slide-in-from-top 0.5s cubic-bezier(0.24, 0.48, 0.47, 0.95);
    ${SlideInAnimation}

    ${FadeOutAnimationLong}
    visibility: ${props => props.fadeOut ? "hidden" : "visible"};
    opacity: ${props => props.fadeOut ? 0 : 1};
    transition: ${props => props.fadeOut ? "visibility 0s 2s, opacity 2s linear" : "none"};
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
    color: ${props => props.type ? (
        props.type === 'success' ? '#FFFFFF' : '#002152'
    ) : '#002152'};
    font-size: 18px;
    font-weight: 600;
`;

const Notification = ({
    type,
    message,
    callback
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(async () => {
        await sleep(currency.notificationDurationLong * 1000);
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
        <SlideIn animate={true} type={type} fadeOut={isClosing}>
            {type ? (
                <>
                    {type === "success" && <CheckIcon />}
                    {type === "error" && <ErrorIcon />}                
                </>
            ) : (
                <InfoIcon />
            )}
            <Text type={type}>{message}</Text>
        </SlideIn>
    )
}



export const infoNotification = (infoString) => {
    notification.info({
        message: infoString,
        duration: 5,
        style: {
            width: "90%",
            height: "50px",
            position: "absolute",
            top: "5%",
            borderRadius: "100px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
        }
    })
}

export const successNotification = (successString) => {
    notification.success({
        message: successString,
        duration: 5,
        style: {color: 'green'}
    })
}

export const selfMintTokenNotification = () => {
    notification.success({
        message: 'Success',
        description: (
            <Paragraph>
                Tokens successfully minted!
            </Paragraph>
        ),
        duration: currency.notificationDurationLong,
        style: { borderRadius: '0px' },
    });
};

export const sendTokenNotification = link => {
    notification.success({
        message: 'Success',
        description: (
            <a href={link} target="_blank" rel="noopener noreferrer">
                <Paragraph>
                    Transaction successful!
                </Paragraph>
            </a>
        ),
        duration: currency.notificationDurationLong,
        style: { borderRadius: '0px' },
    });
};

export const eTokenReceivedNotification = (
    currency,
    receivedSlpTicker,
    receivedSlpQty,
    receivedSlpName,
) => {
    notification.success({
        message: `${currency.tokenTicker} transaction received: ${receivedSlpTicker}`,
        description: (
            <Paragraph>
                You received {receivedSlpQty.toString()} {receivedSlpName}
            </Paragraph>
        ),
        duration: currency.notificationDurationShort,
        style: { width: '100%', borderRadius: '0px' },
    });
};
export const errorNotification = (error, message, stringDescribingCallEvent) => {
    notification.error({
        message: 'Error',
        description: message,
        duration: currency.notificationDurationLong,
        style: { borderRadius: '0px' },
    });
};



export default Notification;