import styled from 'styled-components';
import ChickenBackgroundPng from '@assets/ResultBackground.png';
import { Flash } from 'react-ruffle';

const FlashCtn = styled.div`
    border-radius: 12px;
    width: 90%;
    height: 40%;
    flex-grow: 1;
	background-image: url(${ChickenBackgroundPng});
	position: relative;
	display: flex;
	justify-content:center;
	overflow: hidden;
`;
const StyledFlash = styled(Flash)`
	position: absolute;
	bottom: 0;
`;	
const Scrollable = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: scroll;
    z-index: 1;
    flex-grow: 1;
    gap: 16px;
    height: 70%;
`;
const Ticket = styled.div`
    width: 100%;
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const ButtonCtn = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
`;

export {
    FlashCtn, 
    StyledFlash, 
    Scrollable, 
    Ticket, 
    ButtonCtn,
}