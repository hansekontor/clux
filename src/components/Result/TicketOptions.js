import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// assets 
import BillIconSvg from '@assets/bill.svg';
import TicketIconSvg from '@assets/ticket_filled.svg';

// css styled components
const ButtonCtn = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-bottom:16px;
`;
const CustomButton = styled.button`
    border-radius: 8px;
    background: #FFFFFF;
    color: #000000;
    height: 52px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-style: none;
    gap: 4px;
    flex-grow: 1;
    gap: 12px;
 `;
const Text = styled.div`
    font-size: 12px;
    font-weight: 700;      
`;
const Circle = styled.div`
    position: relative;
    background-color: #D0CED8;
    border-radius: 20px;
    height: 35px;
    width: 35px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 12px;
`;
const CashoutCircle = styled(Circle)`
    background-color: #D2EFD0;
`;
const TicketCircle = styled(Circle)`
    background-color: #FBEDD2;
`;

const CashoutButton = () => {
    const history = useHistory();

    const handleToCashout = () => {
        history.push({path:'/payout'})
    }
    
    return (
        <>
            <CustomButton onClick={handleToCashout}>
                <CashoutCircle>
                    <img src={BillIconSvg}/>
                </CashoutCircle>                
                <Text>
                    Cashout
                </Text> 
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
            <TicketCircle>
                <img src={TicketIconSvg} />
            </TicketCircle>           
            <Text>
                Ticket Details
            </Text>
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