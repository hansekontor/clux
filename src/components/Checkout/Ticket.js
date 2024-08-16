import React from 'react';
import styled from 'styled-components';

import RandomNumbers from '@components/Common/RandomNumbers';
import TicketIconSvg from '@assets/ticket_icon_filled.svg';

const Circle = styled.div`
    background-color: #D0CED8;
    border-radius: 177px;
    height: 64px;
    width: 64px;
    cursor: pointer;
    cursor: pointer;
    text-align: center;
    cursor: pointer;    
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;
const SmallCircle = styled(Circle)`
    width: 40px;
    height: 40px;
    background-color: #FFFFFF;
    margin: 0px 12px;
    border-radius: 20px;
`;
const BoldText = styled.div`
    font-weight: 600;
    font-family: Helvetica;
    font-size: 14px;
`;
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
`
const Column = styled(Row)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 46px;
`;
const DateColumn = styled(Column)`
    align-items: baseline;
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
    background
}) => {
    return (
        <>
            <Details>
                <Row>
                    <SmallCircle>
                        <img src={TicketIconSvg} />
                    </SmallCircle>
                    <DateColumn>
                        <BoldText>Date</BoldText>
                        <BoldText>15 Oct 2024</BoldText>
                    </DateColumn>
                </Row>
                <PriceColumn>
                    <BoldText>Ticket Cost</BoldText>
                    <Price>$10</Price>
                </PriceColumn>
            </Details>
            <RandomNumbers 
                fixedRandomNumbers={numbers}
                background={background}
            />          
        </>
    )
}

export default Ticket;