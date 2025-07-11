import React from 'react';
import styled from 'styled-components';

import Ticket from './Ticket';
import Typography from '@components/Typography';

const TicketContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
`

const Heading = styled.div`
    font-size: 22px;
    font-weight: 600;
    color: ${({ theme }) => theme.select.text};
    margin-bottom: 16px;
`

export default function Activity({ ticketActivity }) {
    return (
        <div>
            <Heading>Activity</Heading>
            <TicketContainer>
                {ticketActivity.map((data, index) => (
                    <Ticket 
                        key={index}
                        data={data}
                    />
                ))}

                {ticketActivity.length === 0 && (
                    <Typography>
                        You have no referral tickets yet, start referring now to earn money!
                    </Typography>
                )}
            </TicketContainer>
        </div>
    )
}
