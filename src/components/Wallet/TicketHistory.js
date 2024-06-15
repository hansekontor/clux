import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse } from 'antd';
import { SecondaryButton } from '@components/Common/PrimaryButton';



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
const TicketData = ({ticket}) => {
    return(
        <>
            <TicketDataItem>
                <TicketDataLabel>Broadcasted:</TicketDataLabel>
                <TicketDataValue>{ticket.time}</TicketDataValue>
            </TicketDataItem>
            <TicketDataItem>
                <TicketDataLabel>Ticket Txid:</TicketDataLabel>
                <Link href={`https://explorer.cert.cash/tx/${ticket.id}`}>{ticket.idShort}</Link>
            </TicketDataItem>
            {ticket.payout && (
                <>
                    <TicketDataItem>
                        <TicketDataLabel>Redeemed:</TicketDataLabel>
                        <TicketDataValue>{ticket.payout.time}</TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                        <TicketDataLabel>Payout:</TicketDataLabel>
                        <TicketDataValue>{ticket.payout.value}</TicketDataValue>
                    </TicketDataItem>
                    <TicketDataItem>
                        <TicketDataLabel>Payout Txid:</TicketDataLabel>
                        <Link href={`https://explorer.cert.cash/tx/${ticket.payout.id}`}>{ticket.payout.idShort}</Link>
                    </TicketDataItem>                             
                </>
            )}
            <SecondaryButton onClick={() => handleRedeemTicket()}>Redeem and Play</SecondaryButton>
        </>
    )
}
const StyledCollapse = styled(Collapse)`
    margin: 0px auto; 10px;
    background-color: #ffffff;
    min-width: 300px;
    width: 100%;
`;

const TicketHistory = ({ 
    // txs 
    passLoadingStatus
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
        console.log("handleChange key", key);
        setActiveKey(key);
    }
    const handleRedeemTicket = async () => {
        passLoadingStatus("FETCHING TICKET DATA")
        await sleep(2000);
        passLoadingStatus("REDEEMING TICKET")
        await sleep(2000);
        history.push('/game');
    }


    const tickets = [
        {id:"1234567890123456789012345678901234567890123456789012345678901234", time: "33:33 33.33.33 GMT"},
        {id:"123456789012345678901234567890", time: "33:33 33.33.33 GMT"},
        {id:"123456789012345678901234567890", time: "33:33 33.33.33 GMT"},
    ]

    const formattedTickets = tickets.map((ticket, index) => {
        ticket.idShort = String(ticket.id.slice(0,8) + "..." + ticket.id.slice(56,));
        ticket.payout = {
            time: "33:33 33.33.33 GMT",
            value: 20,
            id: ticket.id,
            idShort: ticket.idShort,
        }
        ticket.key = index;
        ticket.label = ticket.payout ? "Redeemed Ticket"+index : "Open Ticket"+index;

        return ticket;
    });

    const displayTickets = formattedTickets.map(ticket => {
        ticket.children = <TicketData ticket={ticket}/>;
        return ticket;
    })

    return (
        <StyledCollapse accordion items={displayTickets}></StyledCollapse>
    );
};

TicketHistory.propTypes = {
    txs: PropTypes.array,
    fiatPrice: PropTypes.number,
    fiatCurrency: PropTypes.string,
};

export default TicketHistory;