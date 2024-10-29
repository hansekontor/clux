// node modules
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CopyOutlined } from '@ant-design/icons';

// 
import { TertiaryButton } from '@components/Common/PrimaryButton'

// assets
import TicketSvg from '@assets/ticket_filled.svg';
import RightArrowSvg from '@assets/arrow_right_white.svg';

// styled css components
import { Item } from './Wallet.js';
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
const StyledCircle = styled.div`
    position: relative;
    background-color: #FFFFFF;
    border-radius: 20px;
    height: 35px;
    width: 35px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Button = styled.button`
    background-color: #44405B;
    border-radius: 100px;
    padding: 7px;
    color: #FFFFFF
    font-weight: 600;
    height: 25px;
    display: flex; 
    align-items: center;
	border-style: none;
`;
const RoundButton = styled(Button)`
    border-radius: 70px;
    width: 25px;
    padding-right: 10px;
	transition: transform 0.5s;
	transform: ${props => props.rotate ? "rotate(90deg)" : "none"};
	position: relative;
`;
const LabelCtn = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
`;
const Subscript = styled.div`    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 7px;
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
const TicketData = styled.div`
    width: 100%;
`;
const TicketDataItem = styled.div`
    display: flex;
    justify-content: space-between;
`;
const Label = styled.div`
    font-weight: 600
`;
const TicketDataValue = styled.div`
    font-weight: 500;
`;
const Divider = styled.div`
    height: 1px;
    width: 100%;
    background-color: #EAEAEA;
    margin: 18px 0px;
`;
const TableHeader = styled(Label)`
    font-size: 16ps;
    text-align: left;
    padding-bottom: 7px;
`;
const Table = styled.table`
    width: 100%;
    border-style: none;
`;
const TableRow = styled.tr``;
const Element = styled.td`
    border-style: none;
`;
const RightArrow = styled.img`
    height: 12px;
	left: 10px;
	position: absolute;
`;
const Collapsible = styled.div`
	overflow: hidden;
	transition: height 0.5s ease-in-out;
	width: 95%;
`;


const Ticket = ({
    data
}) => {

    const [collapsed, setCollapsed] = useState(false);
    const [copied, setCopied] = useState(false);
	const [height, setHeight] = useState(collapsed ? 0 : undefined);

	const ref = useRef(null);

	useEffect(() => {
		if (!collapsed) 
			setHeight(0)
		else 
			setHeight(ref.current?.getBoundingClientRect().height);
	}, [collapsed]);

    const handleTicketOnClick = () => {
		setCollapsed((prev) => !prev);
    }
    const handleCopyId = () => {
        navigator.clipboard.writeText(data.id);
        setCopied(true);
    };

	const TableRows = data.results.map(item => {
		return (
			<TableRow>
				<Element>{item.player}</Element>
				<Element>{item.block}</Element>
				<Element>{item.sum}</Element>
				<Element>{item.modulo}</Element>
			</TableRow>			
		)
	});                       

    return (
        <TicketCtn>
            <Item onClick={handleTicketOnClick}>
                <LeftCtn>
                    <StyledCircle>
                        <img src={TicketSvg}/>
                    </StyledCircle>
                    <LabelCtn>
                        <Label>Ticket</Label>
                        <Subscript>
                            <IdCtn onClick={handleCopyId}>
                                <Id>qwer...tzui</Id>
                                <CopyOutlined />
                            </IdCtn>
                            <Time>12:06 GMT</Time>
                        </Subscript>
                    </LabelCtn>
                </LeftCtn>
                <RightCtn>
                    <Button>Redeem</Button>
                    <RoundButton rotate={collapsed}>
                        <RightArrow src={RightArrowSvg} />
                    </RoundButton>                   
                </RightCtn>
            </Item>
			<Collapsible style={{ height }}>
				<TicketData ref={ref}>
					<TicketDataItem>
						<Label>Broadcasted</Label>
						<TicketDataValue>12:06 GMT</TicketDataValue>
					</TicketDataItem>
					<TicketDataItem>
						<Label>Ticket ID</Label>
						<TicketDataValue>qwer...tzui</TicketDataValue>
					</TicketDataItem>
					<TicketDataItem>
						<Label>Redeemed</Label>
						<TicketDataValue>12:06 GMT</TicketDataValue>
					</TicketDataItem>
					<TicketDataItem>
						<Label>Payout</Label>
						<TicketDataValue>$20</TicketDataValue>
					</TicketDataItem>
					<TicketDataItem>
						<Label>Payout ID</Label>
						<TicketDataValue>qwer...tzui</TicketDataValue>
					</TicketDataItem>

					<Divider />
					<TableHeader>Ticket Calculations</TableHeader>
					<Table>
						<TableRow>
							<Element>You</Element>
							<Element>Block</Element>
							<Element>Sum</Element>
							<Element>Modulo</Element>
						</TableRow>
						{TableRows}
					</Table>
				</TicketData>
			</Collapsible>

        </TicketCtn>

    )
}

Ticket.propTypes = {
    data: PropTypes.array
}
Ticket.defaultProps = {
    data: {
		results: [
			{ player: 3, block: 24, sum: 442, modulo: 2 },
			{ player: 100, block: 122, sum: 35, modulo: 6 },
			{ player: 70, block: 89, sum: 75, modulo: 15 },
			{ player: 33, block: 4, sum: 576, modulo: 8 },
		]
	}
}


const TicketHistory = ({
    tickets
}) => {
    return (
        <>
            {tickets.map((ticket, index) => (
                <Ticket>
                    key={index}
                    data={ticket}
                </Ticket>
            ))}
        </>
    )
}

TicketHistory.propTypes = {
    tickets: PropTypes.array
}
TicketHistory.defaultProps = {
    tickets: [{}, {}, {}, {}, {}]
}

export default TicketHistory;