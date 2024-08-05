import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// assets 
import GiftboxSvg from '@assets/giftbox_icon.svg';
import ExportSvg from '@assets/export.svg';

// css styled components
const ButtonCtn = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding-bottom:16px;
`;
const CustomButton = styled.button`
    border-radius: 100px;
    background: #44405B;
    color: #FFFFFF;
    height: 34px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 7px 12px;
    border-style: none;
    gap: 4px;
 `;
const Text = styled.div`
    font-size: 12px;
    font-weight: 700;   
`;
const ButtonIcon = styled.img``;


const CashoutButton = () => {
    const history = useHistory();

    const handleToCashout = () => {
        history.push({path:'/payout'})
    }
    
    return (
        <>
            <CustomButton onClick={handleToCashout}>
                <Text>
                    Cashout
                </Text> 
                <ButtonIcon src={GiftboxSvg}/> 
            </CustomButton>         
        </>
    )
}

const TicketDetailButton = ({
    id
}) => {
    const history = useHistory();

    const handleToTicketDetails = () => {
        history.push({path:'/ticket'});
    }

    return (
        <CustomButton>
            <Text>
                Ticket details
            </Text>
            <ButtonIcon src={ExportSvg}/>
        </CustomButton>
    )
}


const TicketOptions = () => {
    return (
        <>
            <ButtonCtn>
                <CashoutButton />
                <TicketDetailButton />    
            </ButtonCtn>
    
        </>
    )
}

export default TicketOptions;