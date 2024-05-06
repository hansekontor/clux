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
import PrimaryButton from '@components/Common/PrimaryButton';
import Balance from '@components/Common/Balance';
import SeedPhrase from '@components/Common/SeedPhrase';
import TicketHistory from './TicketHistory';
import { Support, ReturnButton, HelpButton } from '@components/Common/PrimaryButton';
import Header from '@components/Common/Header'; 

// styled css components
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

const Wallet = ({    
    passLoadingStatus,
}) => {
    const history = useHistory();
    const location = useLocation();
    const ContextValue = useContext(WalletContext);
    const { wallet, loading } = ContextValue;
console.log("wallet", wallet)
    // states
    const [activeTickets, setActiveTickets] = useState(true);

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
    
    return (
        <>  
            <Header />
            {!loading && (
                <Content>
                    <Tickets>
                        {activeTickets ? (
                            <>
                                <TicketHistory 
                                    passLoadingStatus={passLoadingStatus}
                                />            
                                <Link>See previous Tickets</Link>
                            </>
                        ) : (
                            <>
                                <Text>There are no unused tickets</Text>
                                <Link href="https://explorer.cert.cash">See previous Tickets</Link>
                            </>
                        )}                                  
                    </Tickets>
                    <AddressCtn>
                        <AddressLabel onClick={() => handleCopyAddress(wallet.Path1899.cashAddress)}>Your Address <CopyOutlined /></AddressLabel>
                        <Address onClick={() => handleCopyAddress(wallet.Path1899.cashAddress)}>{wallet.Path1899.cashAddress ? wallet.Path1899?.cashAddress : ""}</Address>                    
                    </AddressCtn>

                    <SeedPhrase 
                        phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                    />                
                </Content>                
            )}


            <Support>
                <ReturnButton 
                    returnToPath={location.state?.prev || "/select"}
                />
                <Balance/> 
                <HelpButton />
            </Support>
        </>
    );

  
};

Wallet.defaultProps = {
    paymentUrl: "",
    paymentRequest: {},
    onSuccess: (hash, link) => {
        console.log("Payment successful", hash)
        console.log("Explorer view:", link);
    },
    onCancel: status => {
        console.log("Payment cancelled:", status);
    },
    origin: "/",
    passLoadingStatus: () => {
        console.log("placeholder function");
    },
};

Wallet.propTypes = {
    paymentUrl: PropTypes.string,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    passLoadingStatus: PropTypes.func,
    origin: PropTypes.string,
};

export default Wallet;