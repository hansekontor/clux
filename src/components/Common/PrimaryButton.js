import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SettingsSvg from '@assets/settings.svg';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CashoutSvg from '@assets/cashout.svg';


const PrimaryButton = styled.button`
    color: #000000;
    background-color: ${props => props.inactive ? "b9b9b9" : "#f2bc57"};
    height: 52px;
    border-style: none;
    border-radius: 12px;
    font-family: "Sequel 100 Wide 95";
    font-size: 20px;
    cursor: pointer;
    width: 88%;
`;

export const SecondaryButton = styled(PrimaryButton)`
    background-color: #ffffff;
    border: 1px solid #000000;
`;


const Circle = styled.div`
    background-color: #ededed;
    border-radius: 20px;
    height: 35px;
    width: 35px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    &: hover {
        color: #ffffff;
    }
`;
const SettingsIcon = styled.img`
    width: 24px;
    height: 24px;
`;
const QuestionMark = styled.div`
    width: 8px;
    height: 8px;
    position: relative;
    top: -6px;
    left: -1px;
    color: #000000;
    font-family: "Inter-SemiBold", Helvetica;
    font-size: 18px;
    font-weight: 600;
`;


export const SettingsButton = ({
    returnTo
}) => {
    console.log("SettingsButton returnTo", returnTo);
    const history = useHistory();

    // handlers
    const handleToSettings = () => {
        history.push({pathname: "/wallet", state: { returnTo } });
    }

    return (
        <Circle onClick={() => handleToSettings()}>
            <SettingsIcon src={SettingsSvg} />
        </Circle>    
    )
}
SettingsButton.defaultProps = {
    prev: "/select",
};
SettingsButton.propTypes = {
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
                <QuestionMark>?</QuestionMark>
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


const CashoutIcon = styled.img`
`;

export const PayoutButton = ({
    returnTo
}) => {
    const history = useHistory();

    // handlers
    const handleToSettings = () => {
        history.push({pathname: "/payout", state: { returnTo } });
    }

    return (
        <Circle onClick={() => handleToSettings()}>
            <CashoutIcon src={CashoutSvg} />
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

export const ReturnButton = ({
    returnTo
}) => {
    console.log("ReturnButton returnTo", returnTo);
    const history = useHistory();

    // handlers
    const handleReturn = () => {
        history.push({pathname: returnTo});
    }

    return (
        <ReturnButtonCtn onClick={() => handleReturn()}>
            <ArrowLeftOutlined />
        </ReturnButtonCtn>
    )
}

export default PrimaryButton;
