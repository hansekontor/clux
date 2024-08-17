import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ArrowLeftOutlined } from '@ant-design/icons';
import GiftboxSvg from '@assets/giftbox_icon.svg';
import QuestionMarkSvg from '@assets/questionmark_icon.svg';
import WalletSvg from '@assets/wallet_white_icon.svg';


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

const Circle = styled.div`
    background-color: #1A1826;
    border-radius: 20px;
    height: 40px;
    width: 40px;
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
const Icon = styled.img`
    width: 24px;
    height: 24px;
    position: absolute;
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
        <Circle onClick={() => handleToSettings()}>
            {indicator > 0 && <Alert indicator={indicator} />}
            <Icon src={WalletSvg} />
        </Circle>    
    )
}
WalletButton.defaultProps = {
    prev: "/select",
};
WalletButton.propTypes = {
    prev: PropTypes.string,
};


export const HelpButton = ({
    returnTo
}) => {
    // handlers 
    const handleToHelp = () => {
        window.location.href = "https://block.lotto";        
    }

    return (
        <>
            <Circle onClick={() => handleToHelp()}>
                <Icon src={QuestionMarkSvg} />
            </Circle>       
        </>
    )
}
HelpButton.defaultProps = {
    returnTo: "/select",
};  
HelpButton.propTypes = {
    returnTo: PropTypes.string,
};


export const PayoutButton = ({
    returnTo,
}) => {
    const history = useHistory();

    // handlers
    const handleToSettings = () => {
        history.push({pathname: "/payout", state: { returnTo } });
    }

    return (
        <Circle onClick={() => handleToSettings()}>
            <Icon src={GiftboxSvg} />
        </Circle>    
    )
}
PayoutButton.defaultProps = {
    returnTo : "/select",
};
PayoutButton.propTypes = {
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



export default PrimaryButton;
