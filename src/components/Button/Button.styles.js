import styled from "styled-components";
import { TicketIcon, BillIcon } from '@components/Icons';

export const StyledButtonPrimary = styled.button`
    color: ${props => props.theme.buttons.primary.color};
    background-color: ${props => props.$inactive ? props.theme.buttons.primary.inactive.background : props.theme.buttons.primary.background};
    height: 52px;
    border-style: none;
    border-radius: 12px;
    font-family: '${props => props.theme.buttons.primary.font}';
    font-size: 20px;
    cursor: pointer;
    width: 90%;
    letter-spacing: 1px;
`;

export const StyledButtonSecondary = styled(StyledButtonPrimary)`
    background-color ${props => props.theme.buttons.secondary.background};
    font-family: '${props => props.theme.buttons.secondary.font}';
    border: 1px solid #000000;
`;

export const StyledButtonTertiary = styled.button`
    background-color: ${props => props.theme.buttons.tertiary.background};
    border-radius: 70px;
    padding: 7px;
    color: ${props => props.theme.buttons.tertiary.color};
    font-weight: 600;
    font-family: '${props => props.theme.buttons.tertiary.font}';
`;

export const StyledReturnButtonContainer = styled.div`
    padding: 10px;
    cursor: pointer;
`;

export const StyledWhiteButton = styled.button`
    border-radius: 8px;
    background: #FFFFFF;
    color: #000000;
    height: 52px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-style: none;
    gap: 12px;
    flex-grow: 1;
    gap: 12px;
	cursor: pointer;
	width: 100%;
 `;

export const StyledText = styled.div`
    font-size: 12px;
    font-weight: 700;      
`;

export const StyledCustomBillIcon = styled(BillIcon)`
    margin-left: 12px;
`;

export const StyledCustomTicketIcon = styled(TicketIcon)`
    margin-left: 12px;
`;