import React from 'react';
import styled from 'styled-components';

import PlayerNumbers from '@components/PlayerNumbers';
import { TicketFilledIcon } from '@components/Icons';
import Typography from '@components/Typography';


const Details = styled.div`
    background-color: #f2bc57;
    height: 95px;
    display: flex; 
    justify-content: space-between;
    align-items: center;
    border-radius: 16px 16px 0 0;
    margin-top: 12px;
    width: 90%;
    border-bottom: 1px dashed black;
`;
const Row = styled.div`
    display: flex;
    align-items: center;
    margin-left: 12px;
    gap: 12px;
`;
const Column = styled(Row)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 46px;
    margin: 0;
`;
const DateColumn = styled(Column)`
    align-items: baseline;
    gap: 0px;
`;
const PriceColumn = styled(Column)`
    align-items: end;
    padding-right: 24px;
`;
const Price = styled.div`
    font-family: "Sequel 100 Wide 95", Helvetica;
`;

const Ticket = ({
    numbers,
    background,
    quantity
}) => {

    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const displayDate = `${day} ${month} ${year} `;

    return (
        <>
            <Details>
                <Row>
                    <TicketFilledIcon />
                    <DateColumn>
                        <Typography weight="bold">Date</Typography>
                        <Typography weight="bold">{displayDate}</Typography>
                    </DateColumn>
                </Row>
                <PriceColumn>
                    <Typography weight="bold">Ticket Cost</Typography>
                    <Price>${10 * quantity}</Price>
                </PriceColumn>
            </Details>
            <PlayerNumbers
                fixedRandomNumbers={numbers}
                background={background}
            />
        </>
    )
}

export default Ticket;