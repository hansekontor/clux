// node modules
import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CopyOutlined } from '@ant-design/icons';

// 
import { TertiaryButton } from '@components/Common/PrimaryButton'
import { successNotification } from '@components/Common/Notifications';

// assets
import TicketSvg from '@assets/ticket_filled.svg';
import WinningTicketSvg from '@assets/ticket_filled_green.svg';
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
    border-radius: 50%;
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
	cursor: pointer;
`;
const RoundButton = styled(Button)`
    border-radius: 70px;
    width: 25px;
    padding-right: 10px;
	transition: transform 0.5s;
	transform: ${props => props.rotateDown ? "rotate(90deg)" : "none"};
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

const shortifyHash = (hash, length) => {
	return String(hash.slice(0,length) + "..." + hash.slice(64-length,));
}

const Ticket = ({
	passLoadingStatus,
	ticket
}) => {
	const history = useHistory();

    const [collapsed, setCollapsed] = useState(false);
	const [height, setHeight] = useState(collapsed ? 0 : undefined);

	const ref = useRef(null);

	useEffect(() => {
		if (!collapsed) 
			setHeight(0)
		else  {
			const ticketDataHeight = ref.current?.getBoundingClientRect().height;
			setHeight(ticketDataHeight);
		}
	}, [collapsed]);

    const handleTicketOnClick = () => {
		setCollapsed((prev) => !prev);
    }
    const handleCopy = (copy) => {
        navigator.clipboard.writeText(copy);
		successNotification("Copied to Clipboard!")
    };
	const handleRedeemTicket = () => {
		passLoadingStatus("LOADING TICKET");
		history.push({
			pathname: "/waitingroom", 
			state: { ticketToRedeem: ticket	} 
		});
	}

	// const TableRows = data.playerChoice.map((choice, index) => {
	// 	return (
	// 		<TableRow>
	// 			<Element>{choice}</Element>
	// 			<Element>{1}</Element>
	// 			<Element>{3}</Element>
	// 			<Element>{4}</Element>
	// 		</TableRow>			
	// 	)
	// });                       

	// get redeem utc string
	let displayTime = false;
	let redeemDisplayTime = false;
	if (ticket.redeemTx?.time && !redeemDisplayTime) {
		const date = new Date(ticket.redeemTx.time * 1000);
		const displayTime = date.toUTCString();
		redeemDisplayTime = displayTime;	
	}

	// get issue utc string
	let issueDisplayTime = false;
	if (ticket.issueTx?.time) {
		const date = new Date(ticket.issueTx.time * 1000);
		const displayTime = date.toUTCString();
		issueDisplayTime = displayTime;				
	}

	if (redeemDisplayTime)
		displayTime = redeemDisplayTime.slice(0,16);
	else if (issueDisplayTime)
		displayTime = issueDisplayTime.slice(0,16);

	const primaryHash = ticket.redeemTx ? ticket.redeemTx?.hash : ticket.issueTx?.hash;
	const displayPlayerNumbers =  ticket.details?.playerNumbers?.join(", ");
	const displayPayoutAmount = ticket.details?.payoutAmount / 100;
	const displayResultingNumbers = ticket.details?.game?.resultingNumbers?.join(", ");

    return (
        <TicketCtn>
            <Item onClick={handleTicketOnClick}>
                <LeftCtn>
                    <StyledCircle>
						<img src={ticket.details?.payoutAmount > 0 ? WinningTicketSvg : TicketSvg} />
                    </StyledCircle>
                    <LabelCtn>
                        <Label>Ticket</Label>
                        <Subscript>									
							<IdCtn>
								<Id>{shortifyHash(primaryHash, 4)}</Id>
							</IdCtn>
							{displayTime &&
								<Time>{displayTime}</Time>		
							}
                        </Subscript>
                    </LabelCtn>
                </LeftCtn>
                <RightCtn>
                    {!ticket.redeemTx &&
						<Button onClick={handleRedeemTicket}>
							{ticket.issueTx?.height > 0 ? "Redeem" : "Request Redemption"}
						</Button>
					}
                    <RoundButton rotateDown={collapsed}>
                        <RightArrow src={RightArrowSvg} />
                    </RoundButton>                   
                </RightCtn>
            </Item>
			<Collapsible style={{ height }}>
				<TicketData ref={ref}>
					{issueDisplayTime && 
						<TicketDataItem>
							<Label>Issued</Label>
							<TicketDataValue>{issueDisplayTime}</TicketDataValue>
						</TicketDataItem>			
					}
					<TicketDataItem>
						<Label>Issue ID</Label>
						<TicketDataValue onClick={() => handleCopy(ticket.issueTx.hash)}>
							<CopyOutlined /> {' '}
							{shortifyHash(ticket.issueTx.hash, 8)}
						</TicketDataValue>
					</TicketDataItem>
					{displayPlayerNumbers && 
						<TicketDataItem>
							<Label>Player Numbers</Label>
							<TicketDataValue>{displayPlayerNumbers}</TicketDataValue>
						</TicketDataItem>			
					}

					{ticket.redeemTx && (
						<>					
							{redeemDisplayTime &&
								<TicketDataItem>
									<Label>Redeemed</Label>
									<TicketDataValue>{redeemDisplayTime}</TicketDataValue>
								</TicketDataItem>								
							}
							{ticket.details?.payoutAmount && 
								<TicketDataItem>
									<Label>Payout</Label>
									<TicketDataValue>${displayPayoutAmount}</TicketDataValue>
								</TicketDataItem>							
							}
							<TicketDataItem>
								<Label>Redeem ID</Label>
								<TicketDataValue onClick={() => handleCopy(ticket.redeemTx.hash)}>
									<CopyOutlined /> {' '}
									{shortifyHash(ticket.redeemTx.hash, 8)}</TicketDataValue>
							</TicketDataItem>		
							{displayResultingNumbers &&
								<TicketDataItem>
									<Label>Resulting Numbers</Label>
									<TicketDataValue>{displayResultingNumbers}</TicketDataValue>
								</TicketDataItem>	
							}
							
							<Divider />
							
							{/* <TableHeader>Ticket Calculations</TableHeader>
							<Table>
								<TableRow>
									<Element>You</Element>
									<Element>Block</Element>
									<Element>Sum</Element>
									<Element>Modulo</Element>
								</TableRow>
								{TableRows}
							</Table> */}
						</>
					)}



				</TicketData>
			</Collapsible>
        </TicketCtn>

    )
}

Ticket.propTypes = {
    ticket: PropTypes.object
}
// Ticket.defaultProps = {
//     data: {
// 		results: [
// 			{ player: 3, block: 24, sum: 442, modulo: 2 },
// 			{ player: 100, block: 122, sum: 35, modulo: 6 },
// 			{ player: 70, block: 89, sum: 75, modulo: 15 },
// 			{ player: 33, block: 4, sum: 576, modulo: 8 },
// 		]
// 	}
// }

const TicketHistoryCtn = styled.div`
	overflow-y: scroll;
	gap: 12px;
	display: flex;
	flex-direction: column;
`;

const TicketHistory = ({
	passLoadingStatus,
    tickets
}) => {
	console.log("# of Tickets in History", tickets.length)
	const ticketList = tickets.map((ticket, index) => {
		return (
			<Ticket 
				key={index}
				ticket={ticket}
				passLoadingStatus={passLoadingStatus}
			/>
		)
	});

    return (
		<div>
			<TicketHistoryCtn>
				{ticketList}
			</TicketHistoryCtn>
		</div>
    )
}

TicketHistory.propTypes = {
    tickets: PropTypes.array
}

export default TicketHistory;