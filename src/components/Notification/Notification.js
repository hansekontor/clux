import React from 'react'
import { StyledCheckIcon, StyledErrorIcon, StyledInfoIcon, StyledNotification, StyledText } from './Notification.styles'
import { theme } from '@styles';

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
        <StyledNotification $color={backgroundColor[type]}>
            {type === "success" && <StyledCheckIcon />}
            {type === "error" && <StyledErrorIcon />}
            {type === "info" && <StyledInfoIcon />}
            <StyledText $color={textColor[type]}>{message}</StyledText>
        </StyledNotification>
    )
}
