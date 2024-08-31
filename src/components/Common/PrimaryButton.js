import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { CashoutIcon, HelpIcon, WalletIcon, TicketIcon, BillIcon } from '@components/Common/CustomIcons';


const PrimaryButton = styled.button`
    color: #000000;
    background-color: ${props => props.inactive ? "b9b9b9" : "#f2bc57"};
    height: 52px;
    border-style: none;
    border-radius: 12px;
    font-family: "Sequel 100 Wide 95";
    font-size: 20px;
    cursor: pointer;
    width: 90%;
`;

export const SecondaryButton = styled(PrimaryButton)`
    background-color: #ffffff;
    border: 1px solid #000000;
`;

export const TertiaryButton = styled.button`
    background-color: #44405B;
    border-radius: 70px;
    padding: 7px;
    color: #FFFFFF;
    font-weight: 600;
`;

const AlertCtn = styled.div`
    background-color: red;
    border-radius: 40px;
    position: absolute;
    top: 0px;
    left: 80%;
    height: 12px;
    width: 12px;
    display: flex; 
    justify-content: center;
    align-items: center;
`;
const Indicator = styled.div`
    font-size: 9px;
    color: white;
    font-weight: 600;
    font-family: Helvetica;
`;
export const Alert = ({
    indicator
}) => {
    return (
        <AlertCtn>
            <Indicator>{indicator}</Indicator>
        </AlertCtn>
    )
}

export const WalletButton = ({
    returnTo,
    indicator
}) => {
    const history = useHistory();

    // handlers
    const handleToSettings = () => {
        history.push({pathname: "/wallet", state: { returnTo } });
    }

    return (
        <WalletIcon onClick={() => handleToSettings()} indicator={indicator}/>  
    )
}
WalletButton.defaultProps = {
    prev: "/select",
};
WalletButton.propTypes = {
    prev: PropTypes.string,
};


export const HelpButton = () => {

    const handleToHelp = () => {
        window.location.href = "https://block.lotto";        
    }

    return ( 
        <HelpIcon onClick={() => handleToHelp()} />
    )
}

export const CashoutButton = ({
    returnTo,
}) => {
    const history = useHistory();

    const handleToSettings = () => {
        history.push({pathname: "/payout", state: { returnTo } });
    }

    return (
        <CashoutIcon onClick={() => handleToSettings()} />
    )
}
CashoutButton.defaultProps = {
    returnTo : "/select",
};
CashoutButton.propTypes = {
    returnTo: PropTypes.string,
};


const ReturnButtonCtn = styled.div`
    padding: 10px;
    cursor: pointer;
`;

export const ReturnButton = (props) => {
    return (
        <ReturnButtonCtn {...props}>
            <ArrowLeftOutlined />
        </ReturnButtonCtn>
    )
}

const WhiteButton = styled.button`
    border-radius: 8px;
    background: #FFFFFF;
    color: #000000;
    height: 52px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-style: none;
    gap: 12px;
    flex-grow: 1;
    gap: 12px;
 `;
const Text = styled.div`
    font-size: 12px;
    font-weight: 700;      
`;
const CustomBillIcon = styled(BillIcon)`
    margin-left: 12px;
`;
const CustomTicketIcon = styled(TicketIcon)`
    margin-left: 12px;
`;

export const WhiteCashoutButton = () => {
    const history = useHistory();

    const handleToCashout = () => {
        history.push({path:'/cashout'})
    }
    
    return (
        <>
            <WhiteButton onClick={handleToCashout}>
                <CustomBillIcon />              
                <Text>
                    Cashout
                </Text> 
            </WhiteButton>         
        </>
    )
}

export const WhiteTicketButton = ({
    id
}) => {
    const history = useHistory();

    const handleToTicketDetails = () => {
        history.push({path:'/ticket'});
    }

    return (
        <WhiteButton>
            <CustomTicketIcon />
            <Text>
                Ticket Details
            </Text>
        </WhiteButton>
    )
}



export default PrimaryButton;
