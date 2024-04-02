import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse } from 'antd';

import { SecondaryButton } from '@components/Common/PrimaryButton';

// const TicketHistoryCtn = styled.div`
//     width: 100%;
//     margin: auto auto 0;
//     overflow: auto;
// `;
const TxLink = styled.a``;
const StyledCollapse = styled(Collapse)`
    border: none;
    background-color: #ffffff;
    width: 90%;
    margin-left: 5%;

    .ant-collapse-item > .ant-collapse-header {
        color: black;
        font-family: "Seymour One", Helvetica;
        font-size: 18px;
        font-weight: 200;
    }
`;
const PanelStyle = {
    backgroundColor: "#ededed",
    border: "1px solid #333333",
    textColor: "black",
    marginBottom: "5px",
    cursor: "pointer",
    borderRadius: "40px",
    borderWidth: "1px",
    overflow: "hidden",
};
const TicketDataItem = styled.div`
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
`;
const TicketDataLabel = styled.div`
    color: black;
    font-weight: 500;
`;
const TicketDataValue = styled.div`
    color: black;
    margin-bottom: 20px;
`;
const Link = styled.div`
    color: black;
    text-decoration: underline;
    margin-bottom: 20px;
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

    const formattedTickets = tickets.map(ticket => {
        ticket.idShort = String(ticket.id.slice(0,8) + "..." + ticket.id.slice(56,));
        ticket.payout = {
            time: "33:33 33.33.33 GMT",
            value: 20,
            id: ticket.id,
            idShort: ticket.idShort,
        }
        return ticket;
    });


    return (
        // <TicketHistoryCtn>
        <>
            {/* {txs.map(tx => (
                <TxLink
                    key={tx.txid}
                    href={`https://explorer.cert.cash/tx/${tx.txid}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Tx
                        data={tx}
                        fiatPrice={fiatPrice}
                        fiatCurrency={fiatCurrency}
                    />
                </TxLink>
            ))} */}
            <StyledCollapse accordion defaultActiveKey={["1"]} activeKey={activeKey} onChange={(key) => handleChange(key)}>
                {tickets.map((ticket, index) => (
                    <Collapse.Panel header={ticket.payout ? "Redeemed Ticket" : "Open Ticket"} key={index+1} style={PanelStyle}>
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
                    </Collapse.Panel>                    
                ))}
            </StyledCollapse>
        {/*</TicketHistoryCtn>*/}
        </>
    );
};

TicketHistory.propTypes = {
    txs: PropTypes.array,
    fiatPrice: PropTypes.number,
    fiatCurrency: PropTypes.string,
};

export default TicketHistory;