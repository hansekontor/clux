import React from 'react';
import styled from 'styled-components';

import TicketSvg from '@assets/svgs/ticket_filled.svg';

import Typography from '@components/Typography';
import { formateTicketData } from '../../../utils/formateTicketData';

const Item = styled(Typography).attrs({
    variant: "textItem"
})`
    border-radius: 7px;
    background-color:${props => props.theme.app.background};
    min-height: 60px;
    display: flex;
    justify-content: space-between; 
    align-items: center;
`;

const TicketCtn = styled.div`
    border-radius: 7px;
    background-color: #f6f6f6;
    width: 100%;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const LeftCtn = styled.div`
    display: flex;
    gap: 12px;    
    margin-left: 12px;
`;

const RightCtn = styled.div`
    display: flex;
    gap: 12px;
    margin-right: 12px;
`;

const IdCtn = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3px;
    cursor: pointer;
`;

const Id = styled.div`
    font-size: 12px;`;

const Time = styled.div`
    font-size: 12px;
`;

const StyledCircle = styled.div`
    position: relative;
    background-color: #FFFFFF;
    border-radius: 50%;
    height: 35px;
    width: 35px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LabelCtn = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
`;

const Label = styled.div`
    font-weight: 600
`;

const Subscript = styled.div`    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 7px;
`;

const shortifyHash = (hash, length) => {
	return String(hash.slice(0,length) + "..." + hash.slice(64-length,));
}

export default function Ticket({ data }) {

    const { primaryHash, displayTime, displayAffiliateAmount } = formateTicketData(data, true);

    return (
        <TicketCtn>
            <Item>
                <LeftCtn>
                    <StyledCircle>
                        <img src={TicketSvg} />
                    </StyledCircle>
                    <LabelCtn>
                        <Label>Ticket</Label>
                        <Subscript>
                            <IdCtn>
                                <Id>{shortifyHash(primaryHash, 8)}</Id>
                            </IdCtn>
                            <Time>{displayTime}</Time>
                        </Subscript>
                    </LabelCtn>
                </LeftCtn>
                <RightCtn>
                    $ {displayAffiliateAmount}
                </RightCtn>
            </Item>
        </TicketCtn>
    )
}
