import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse } from 'antd';
import PrimaryButton, {SecondaryButton, TertiaryButton} from '@components/Common/PrimaryButton';


const TicketDataItem = styled.div`
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
`;
const TicketDataLabel = styled.div`
    color: black;
    font-weight: 500;
`;
const TicketDataValue = styled.div`
    color: black;
`;
const Link = styled.div`
    color: black;
    text-decoration: underline;
`;
const TicketData = ({ticket, passSelectedTicket}) => {
    const history = useHistory();
    
    const handleTicketDetails = () => {
        passSelectedTicket(ticket);
        history.push("/ticketdetails");
    }

    return(
        <>
            <TicketDataItem>
                <TicketDataLabel>Broadcasted:</TicketDataLabel>
                <TicketDataValue>{ticket.time}</TicketDataValue>
            </TicketDataItem>
            <TicketDataItem>
                <TicketDataLabel>Ticket ID:</TicketDataLabel>
                <Link href={`https://explorer.cert.cash/tx/${ticket.id}`}>{ticket.displayId}</Link>
            </TicketDataItem>
            {ticket.payout && (
                <>
                    <TicketDataItem>
                        <TicketDataLabel>Redeemed:</TicketDataLabel>
                        <TicketDataValue>{ticket.payout.time}</TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                        <TicketDataLabel>Payout Amount:</TicketDataLabel>
                        <TicketDataValue>{ticket.payout.value}</TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                        <TicketDataLabel>Payout ID:</TicketDataLabel>
                        <Link href={`https://explorer.cert.cash/tx/${ticket.payout.id}`}>{ticket.payout.displayId}</Link>
                    </TicketDataItem>                             
                </>
            )}
            <SecondaryButton onClick={() => handleTicketDetails()}>See Ticket Details</SecondaryButton>
            <PrimaryButton onClick={() => handleRedeemTicket()}>Redeem</PrimaryButton>
        </>
    )
}

const Circle = styled.div`
    position: relative;
    background-color: #ffffff;
    border-radius: 20px;
    height: 35px;
    width: 35px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const LeftGroup = styled.div`
    gap: 7px;
`;
const RightGroup = styled(LeftGroup)``;
const TicketItem = styled.div`
    background-color: #a6a6a6;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const Label = styled.div`
    font-weight: 600;
`;
const RightArrow = styled.div``;
const TicketHistory = ({ 
    tickets,
    passLoadingStatus, 
    passSelectedTicket
}) => {
    const history = useHistory();

    // states
    const [activeKey, setActiveKey] = useState(1);

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // handlers
    const handleChange = (key) => {
        setActiveKey(key);
    }
    const handleRedeemTicket = async () => {
        passLoadingStatus("FETCHING TICKET DATA")
        await sleep(2000);
        passLoadingStatus("REDEEMING TICKET")
        await sleep(2000);
        history.push('/game');
    }

    const displayTickets = tickets.map(ticket => {
        let label = "Ticket";
        if (!ticket.payout && ticket.height) {
            ticket.label = "Redeem your Ticket";
        }
        const children = <TicketData ticket={ticket} passSelectedTicket={passSelectedTicket}/>;

        return {
            label, 
            children
        };
    })

    return (
        <TicketItem>
            <LeftGroup>
                <Circle />
                <Label>Ticket 01</Label>                
            </LeftGroup>
            <RightGroup>
                <TertiaryButton>Redeem</TertiaryButton>
                <TertiaryButton>
                    <RightArrow>{"->"}</RightArrow>
                </TertiaryButton>
            </RightGroup>

        </TicketItem>
    );
};

TicketHistory.propTypes = {
    txs: PropTypes.array,
    fiatPrice: PropTypes.number,
    fiatCurrency: PropTypes.string,
};

export default TicketHistory;