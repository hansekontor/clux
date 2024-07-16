import React from 'react';
import styled from 'styled-components';

// assets 
import CashoutSvg from '@assets/cashout_white.svg';
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
 `;
const Text = styled.div`
    font-size: 12px;
    font-weight: 700;   
`;
const ButtonIcon = styled.img``;


const CashoutButton = () => {
    return (
        <CustomButton>
            <Text>
                Cashout
            </Text>
            <ButtonIcon src={CashoutSvg}/>
        </CustomButton>
    )
}

const TicketDetailButton = () => {
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