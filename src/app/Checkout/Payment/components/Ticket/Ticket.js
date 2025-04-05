import React from 'react';

import PlayerNumbers from '@components/PlayerNumbers';
import { TicketFilledIcon } from '@components/Icons';
import Typography from '@components/Typography';
import { DateColumn, Details, Price, PriceColumn, Row } from './Ticket.styles';

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