import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SettingsSvg from '@assets/settings.svg';
import { RollbackOutlined } from '@ant-design/icons';



const PrimaryButton = styled.button`
    all: unset;
    align-items: center;
    background-color: #ffffff;
    color: #000000;
    border-radius: 16px;
    font-family: "Sequel 100 Wide 95", Helvetica;
    font-size: 27px;
    font-weight: 600;
    letter-spacing: 0.54px;
    text-align: center;
    border-width: 4px 10px 9px 5px;
    border-style: solid;
    height: 51px;
    padding: 4px 10px 0px;
    cursor: pointer;
    transition-duration: 0.2s;

    &: hover {
        color: rgba(0,0,0,0.7);
    }
`;

/* sorted out from old primary button
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 12px 16px;
    position: relative; 
    width: 100%;
    cursor: pointer;
*/

export const SecondaryButton = styled.button`
    border-radius: 40px;
    background-color: #000000;
    color: #ffffff;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 44px;
    padding: 0 15px;
    cursor: pointer;
`;


const Circle = styled.div`
    background-color: #ededed;
    border-radius: 20px;
    height: 40px;
    width: 40px;
    cursor: pointer;
    text-align: center;
`;
const SettingsIcon = styled.img`
    width: 28px;
    height: 28px;
    top: 6px;
    position: relative;
`;
const QuestionMark = styled.div`
    width: 14px;
    height: 18px;
    left: 12px;
    top: 3px;
    position: relative;
    color: #000000;
    font-family: "Inter-SemiBold", Helvetica;
    font-size: 24.5px;
    font-weight: 600;
`;


export const SettingsButton = ({
    prev
}) => {
    const history = useHistory();

    // handlers
    const handleToSettings = () => {
        history.push({pathname: "/wallet", state: { prev } });
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
    prev
}) => {
    const history = useHistory();

    // handlers 
    const handleToSettings = () => {
        history.push({pathname: '/how', state: { prev } });
    }

    return (
        <Circle onClick={() => handleToSettings()}>
            <QuestionMark>?</QuestionMark>
        </Circle>
    )
}
HelpButton.defaultProps = {
    prev: "/select",
};
HelpButton.propTypes = {
    prev: PropTypes.string,
};


const CustomReturn = styled(RollbackOutlined)`
    color: black;
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
`;

export const ReturnButton = ({
    returnToPath
}) => {
    const history = useHistory();

    // handlers 
    const handleReturn = () => {
        history.push(returnToPath);
    }

    return (
        <Circle onClick={() => handleReturn()}>
            <CustomReturn />
        </Circle>
    )
}
ReturnButton.defaultProps = {   
    returnToPath: "/select",
};
ReturnButton.propTypes = {
    returnToPath: PropTypes.string,
};


export const Support = styled.div`
    top: 90%;
    position: absolute;
    width: 86%;
    justify-content: space-between;
    display: inline-flex;
    left: 7%;
`;

export const SupportButtons = ({
    prev
}) => {
    return (
        <Support>
            <SettingsButton prev={prev}/>
            <HelpButton prev={prev}/>
        </Support>
    )
}


export default PrimaryButton;
