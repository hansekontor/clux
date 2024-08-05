require('dotenv').config();

// node modules
import React, { useEffect, useState, useContext }  from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { CopyOutlined } from '@ant-design/icons';

// react components tbc
import { WalletContext } from '@utils/context';
import { currency } from '@components/Common/Ticker.js';
import { getUrlFromQueryString } from '@utils/bip70';
import { getPaymentRequest } from '../../utils/bip70';
import { LoadingCtn } from '@components/Common/Atoms';
import { isValidStoredWallet } from '@utils/cashMethods';
import { infoNotification, errorNotification } from '@components/Common/Notifications';
import { CashLoadingIcon, LoadingBlock } from '@components/Common/CustomIcons';
import { ReturnButton } from '@components/Common/PrimaryButton';
import Balance from '@components/Common/Balance';
import SeedPhrase from '@components/Common/SeedPhrase';
import { HelpButton } from '@components/Common/PrimaryButton';
import Header from '@components/Common/Header'; 
import { getWalletState } from '@utils/cashMethods';
import useBCH from '@hooks/useBCH';
import NavigationBar from '@components/Common/Navigation';

// styled css components
const AgreeCtn = styled.div`
    width: 100%;
    height: 100%;
    background-color: #EAEAEA;
`;
const Text = styled.div`
    color: black;
    font-family: "Inter-Medium", Helvetica;
    font-size: 16px;
`;
const Link = styled.a`
    text-decoration: underline;
`;
const Content = styled.div`
    overflow-y: auto;
    gap: 50px;
    display: grid;
    margin-top: 100px;
    width: 90%;
    max-height: 60%;
`;
const Tickets = styled.div`
    width: 100%;
`;
const AddressCtn = styled.div`
    width: 90%;
    margin: auto auto 0px;
`;
const AddressLabel = styled.div`
    margin: 0 auto;
    font-size: 14px;
    padding: 0;
    cursor: pointer;
`;
const Address = styled.div`
    background-color: #ededed;
    padding: 5px 10px;
    border-radius: 40px;
    color: #333333;
    cursor: pointer;
    word-break: break-all;
`;
const Table = styled.table`
    width: 85%;
`;
const TableHeader = styled.tr`
    background-color: #aeaeae;
`;
const TableRow = styled.tr``;
const LastTableRow = styled(TableRow)`
    border-style: none;
`;
const Label = styled.td`
    font-weight: 600;
`;
const Value = styled.td``;
const Result = styled(Label)``;
const Opponent = styled.div`
    width: 85%;
`;
const HashString = styled.div`
    font-size: 8px;
    font-weight: 400;
`;

// dev rmv
const shortifyHash = (hash) => {
        return String(hash.slice(0,8) + "..." + hash.slice(56,));
}

const TicketDetails = ({    
    ticket
}) => {

    const location = useLocation();

    const [details, setDetails] = useState(false);

    useEffect(()=> {
        if (!details) {
            const ticketHash = Buffer.from(ticket.id, 'hex');
            const ticketString = ticketHash.toString('hex');
            const blockHash = Buffer.from(ticket.blockHash, 'hex');
            const blockString = blockHash.toString('hex');
            const combineHashes = Buffer.concat([ticketHash, blockHash]);
            const combineString = combineHashes.toString('hex');
            const randomNumberHash = Hash256.digest(combineHashes);
            const randomNumberString = randomNumberHash.toString('hex');
            const playerNumbers = [23, 124, 3, 77];
            const opponentNumbers = [34,55,101,90];
            const sum = playerNumbers.map((number, index) => {
                return number + opponentNumbers[index];
            });
            const modulo = sum.map((number) => {
                return number % 16;
            })    
            const moduloSum = modulo.reduce((acc, value) => acc + value, 0);

            const newDetails = {
                ticket: ticketString,
                block: blockString,
                combine: combineString,
                randomNumber: randomNumberString,
                playerNumbers, 
                opponentNumbers, 
                sum, 
                modulo, 
                moduloSum
            }

            setDetails(newDetails);
        }   
    })




    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    } 

    // handlers
    const handleToPreviousTickets = () => {
        // redirect to ticket explorer
    }

    const handleCopyAddress = (address) => {
        navigator.clipboard.writeText(address);
        infoNotification("Copied!")
    }

    const title = "Ticket Details";
    const previousPath = location.state?.returnTo || "/ticket";

    return (
        <AgreeCtn>
            <Header />
            <NavigationBar 
                returnTo={previousPath}
                title={title}
            />

            {details && (
                <>
                    <Opponent>
                        <HashString>{details.randomNumber}</HashString>
                    </Opponent>

                    <Table>
                        <TableHeader>
                            <td>NUMBER</td>
                            <td>PLAYER</td>
                            <td>OPPONENT</td>
                            <td>SUM</td>
                            <td>MODULO</td>
                        </TableHeader>
                        <TableRow>
                            <Label>1</Label>
                            <Value>{details.playerNumbers[0]}</Value>
                            <Value>{details.opponentNumbers[0]}</Value>
                            <Value>{details.sum[0]}</Value>
                            <Result>{details.modulo[0]}</Result>
                        </TableRow>
                        <TableRow>
                            <Label>2</Label>
                            <Value>{details.playerNumbers[1]}</Value>
                            <Value>{details.opponentNumbers[1]}</Value>
                            <Value>{details.sum[1]}</Value>
                            <Result>{details.modulo[1]}</Result>
                        </TableRow>
                        <TableRow>
                            <Label>3</Label>
                            <Value>{details.playerNumbers[2]}</Value>
                            <Value>{details.opponentNumbers[2]}</Value>
                            <Value>{details.sum[2]}</Value>
                            <Result>{details.modulo[2]}</Result>
                        </TableRow>
                        <TableRow>
                            <Label>4</Label>
                            <Value>{details.playerNumbers[3]}</Value>
                            <Value>{details.opponentNumbers[3]}</Value>
                            <Value>{details.sum[3]}</Value>
                            <Result>{details.modulo[3]}</Result>
                        </TableRow>
                        <LastTableRow>
                            <Value></Value>
                            <Value></Value>
                            <Value></Value>
                            <Value></Value>
                            <Result>{details.moduloSum}</Result>
                        </LastTableRow>
                    </Table>                    
                </>
            )}
        </AgreeCtn>
    );

  
};

TicketDetails.propTypes = {
    ticket: PropTypes.object,
};

export default TicketDetails;