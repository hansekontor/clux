import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    StyledCustomBillIcon,
    StyledCustomTicketIcon,
    StyledText,
    StyledWhiteButton
} from './Button.styles';

export const WhiteCashoutButton = () => {
    const history = useHistory();

    const handleToCashout = () => {
        history.push({ pathname: '/cashout' })
    }

    return (
        <>
            <StyledWhiteButton onClick={handleToCashout}>
                <StyledCustomBillIcon />
                <StyledText>
                    Cashout
                </StyledText>
            </StyledWhiteButton>
        </>
    )
}

export const WhiteTicketButton = ({
    id
}) => {
    const history = useHistory();

    const handleToTicketDetails = () => {
        history.push({ pathname: '/wallet' });
    }

    return (
        <StyledWhiteButton onClick={handleToTicketDetails}>
            <StyledCustomTicketIcon />
            <StyledText>
                Tickets
            </StyledText>
        </StyledWhiteButton>
    )
}