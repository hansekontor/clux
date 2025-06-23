// node modules
import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CopyOutlined } from '@ant-design/icons';

// custom modules
import Button from '@components/Button';

// core functions
import { useApp } from 'blocklotto-sdk';
import sleep from '@utils/sleep';
import { useNotifications } from 'blocklotto-sdk';
import { getFormattedTicketData } from 'blocklotto-sdk';

// assets
import TicketSvg from '@assets/svgs/ticket_filled.svg';
import WinningTicketSvg from '@assets/svgs/ticket_filled_green.svg';
import RightArrowSvg from '@assets/svgs/arrow_right_white.svg';

// styled css components
import { Item } from './Styled';
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

const BaseButton = styled.button`
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
const RoundButton = styled(BaseButton)`
    border-radius: 70px;
    width: 25px;
    padding-right: 10px;
	transition: transform 0.5s;
	transform: ${props => props.$rotateDown ? "rotate(90deg)" : "none"};
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
const SyncButton = styled(Button)`
	font-family: "Helvetica";
	font-size: 14px;
	font-weight: 600;
	width: 100%;
`;
const RedeemButton = styled(SyncButton)``;

const shortifyHash = (hash, length) => {
	return String(hash.slice(0,length) + "..." + hash.slice(64-length,));
}

const Ticket = ({
	passLoadingStatus,
	ticket, 
	...props
}) => {
	const { setTicketsToRedeem } = useApp();
	const history = useHistory();
	const notify = useNotifications();

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
		notify({message: "Copied to clipboard", type: "success"});
    };
	const handleRedeemTicket = async (e) => {
		e.stopPropagation();
		passLoadingStatus("LOADING TICKET");
		setTicketsToRedeem([ticket]); 
		await sleep(1000);
		history.push("/waitingroom");
	}                      

	const formattedTicketData = getFormattedTicketData(ticket);

    return (
        <TicketCtn {...props}>
            <Item onClick={handleTicketOnClick}>
                <LeftCtn>
                    <StyledCircle>
						<img src={ticket.parsed?.payoutAmount > 0 ? WinningTicketSvg : TicketSvg} />
                    </StyledCircle>
                    <LabelCtn>
                        <Label>Ticket</Label>
                        <Subscript>									
							<IdCtn>
								<Id>{shortifyHash(formattedTicketData.primaryHash, 4)}</Id>
							</IdCtn>
							{formattedTicketData.displayTime &&
								<Time>{formattedTicketData.displayTime}</Time>		
							}
                        </Subscript>
                    </LabelCtn>
                </LeftCtn>
                <RightCtn>
                    {!ticket.redeemTx &&
						<BaseButton onClick={(e) => handleRedeemTicket(e)}>
							{ticket.issueTx?.height > 0 ? "Redeem" : "Request Redemption"}
						</BaseButton>
					}
                    <RoundButton $rotateDown={collapsed}>
                        <RightArrow src={RightArrowSvg} />
                    </RoundButton>                   
                </RightCtn>
            </Item>
			<Collapsible style={{ height }}>
				<TicketData ref={ref}>
					{formattedTicketData.issueDisplayTime && 
						<TicketDataItem>
							<Label>Issued</Label>
							<TicketDataValue>{formattedTicketData.issueDisplayTime}</TicketDataValue>
						</TicketDataItem>			
					}
					<TicketDataItem>
						<Label>Issue ID</Label>
						<TicketDataValue onClick={() => handleCopy(ticket.issueTx.hash)}>
							<CopyOutlined /> {' '}
							{shortifyHash(ticket.issueTx.hash, 8)}
						</TicketDataValue>
					</TicketDataItem>
					{formattedTicketData.displayPlayerNumbers && 
						<TicketDataItem>
							<Label>Player Numbers</Label>
							<TicketDataValue>{formattedTicketData.displayPlayerNumbers}</TicketDataValue>
						</TicketDataItem>			
					}

					{ticket.redeemTx && (
						<>					
							{formattedTicketData.redeemDisplayTime &&
								<TicketDataItem>
									<Label>Redeemed</Label>
									<TicketDataValue>{formattedTicketData.redeemDisplayTime}</TicketDataValue>
								</TicketDataItem>								
							}
							{ticket.parsed?.payoutAmount && 
								<TicketDataItem>
									<Label>Payout</Label>
									<TicketDataValue>${formattedTicketData.displayPayoutAmount}</TicketDataValue>
								</TicketDataItem>							
							}
							<TicketDataItem>
								<Label>Redeem ID</Label>
								<TicketDataValue onClick={() => handleCopy(ticket.redeemTx.hash)}>
									<CopyOutlined /> {' '}
									{shortifyHash(ticket.redeemTx.hash, 8)}</TicketDataValue>
							</TicketDataItem>		
							{formattedTicketData.displayResultingNumbers &&
								<TicketDataItem>
									<Label>Resulting Numbers</Label>
									<TicketDataValue>{formattedTicketData.displayResultingNumbers}</TicketDataValue>
								</TicketDataItem>	
							}
							
							<Divider />
							
							{ticket.parsed?.opponentNumbers && ticket.parsed?.resultingNumbers &&
								<>
									<TableHeader>Ticket Calculations</TableHeader>
									<Table>
										<thead>
											<TableRow>
												<Element key={0}	>You</Element>
												<Element key={1}>Block</Element>
												<Element key={2}>Combination</Element>
												<Element key={3}>Modulo</Element>
											</TableRow>											
										</thead>
										<tbody>
											{ticket.parsed.playerNumbers.map((choice, index) => {
												return (
													<TableRow key={index}>
														<Element>{choice}</Element>
														<Element>{ticket.parsed?.opponentNumbers[index]}</Element>
														<Element>{formattedTicketData.combinedNumbers[index]}</Element>
														<Element>{ticket.parsed?.resultingNumbers[index]}</Element>
													</TableRow>			
												)
											})}
											<TableRow key={"summary"}>
												<Element key={0}></Element>
												<Element key={1}></Element>
												<Element key={2}></Element>
												<Element key={3}><b>{ticket.parsed?.resultingNumbers?.reduce((acc, number) => acc+number, 0)}</b></Element>
											</TableRow>
										</tbody>
									</Table>							
								</>
							}
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


const VarHeightCtn = styled.div`
	width: 90%;
`;
const TicketHistoryCtn = styled.div`
	overflow-y: scroll;
	gap: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const TicketHistory = ({
	passLoadingStatus,
    tickets,
}) => {
	const { setTicketsToRedeem, redeemableTickets, ticketsToRedeem } = useApp();
	const history = useHistory();

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

	// only push to waitingroom if tickets are available in ticketsToRedeem
	useEffect(() => {
		if (ticketsToRedeem.length > 0) {
			console.log("push to waitingroom")
			history.push("/waitingroom");
		}
	}, [ticketsToRedeem]);

	const handleRedeemAll = () => {
		passLoadingStatus("LOADING TICKET");
		setTicketsToRedeem(redeemableTickets);
	}

    return (
		<VarHeightCtn>
			<TicketHistoryCtn>
				{tickets.find(ticket => !ticket.redeemTx && ticket.issueTx?.height > 0) &&
					<RedeemButton onClick={handleRedeemAll}>
						Redeem All
					</RedeemButton>							
				}
				{ticketList}
			</TicketHistoryCtn>
		</VarHeightCtn>
    )
}

TicketHistory.propTypes = {
    tickets: PropTypes.array
}

export default TicketHistory;