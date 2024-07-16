// node modules
import React from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';

// react components 
import PrimaryButton, { SettingsButton, HelpButton, PayoutButton } from '@components/Common/PrimaryButton';
import Balance from '@components/Common/Balance';
import RandomNumbers, {ResultingNumbers} from '@components/Common/RandomNumbers';

// assets
import CnmiPng from '@assets/cnmi.png';

// styled css components
const LightFooterBackground = styled.div`
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0; 
    width: 100%;
    height: 100%;
    background-color: #eaeaea;
`;
const FooterCtn = styled.div`
    background-color: #48445c;
    align-items: center;
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    width: inherit;
    padding-top: 18px;
    border-radius: 16px 16px 0 0;
`;
const Ticket = styled.div``;
const Links = styled.div`
    margin-top: 3px;
    color: #aaa9b4
`;

const SupportBarCtn = styled.div`
    display: flex;
    justify-content: space-evenly;
    padding-top: 18px;
    width: 88%;
`;
const ButtonCtn = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-grow: 1;
`;
const CnmiIconCtn = styled.div`
    cursor: pointer;
`
const CnmiIcon = styled.img`
    height: 35px;
    width: 35px;
`;

const SupportBar = ({
    returnTo
}) => {
    
    // handler 
    const handleCnmiRedirect = () => {
        window.location.href = "https://example.com";        
    }

    return ( 
        <SupportBarCtn>
            {/* <ButtonCtn> */}
                <SettingsButton returnTo={returnTo}/>
                <HelpButton />                
            {/* </ButtonCtn> */}
            <Balance />
            <PayoutButton returnTo={returnTo}/>
            <CnmiIconCtn onClick={() => handleCnmiRedirect()}>
                <CnmiIcon src={CnmiPng}/>
            </CnmiIconCtn>
        </SupportBarCtn>
    )
}

const Footer = ({
    origin,
    randomNumbers, 
    buttonOnClick,
    buttonText,
    activeButton = true,
    resultingNumbers,
    activeResult,
    lightBackground = false
}) => {
    return (
        <FooterCtn>
            {lightBackground && 
                <LightFooterBackground />
            }
            {randomNumbers && 
                <RandomNumbers fixedRandomNumbers={randomNumbers} />
            }
            {resultingNumbers && 
                <ResultingNumbers numberArray={resultingNumbers} active={activeResult}/>
            }
            {buttonText && 
                <>
                    {/* {buttonText.startsWith("Pay") ? (
                        <PrimaryButton active={activeButton} type="submit" form="checkout-form">
                            {buttonText}
                        </PrimaryButton>
                    ) : ( */}
                        <PrimaryButton onClick={buttonOnClick} active={activeButton}>
                            {buttonText}
                        </PrimaryButton>  
                    {/* )} */}
                </> 
            }
            <SupportBar returnTo={origin}/>
            <Links>
                Terms of Service - Privacy Policy
            </Links>
        </FooterCtn>
    )
}

Footer.defaultProps = {
    origin: "/select",
}
Footer.propTypes = {
    origin: PropTypes.string,
    randomNumbers: PropTypes.array,
    buttonOnClick: PropTypes.func,
    buttonText: PropTypes.string
}

export default Footer;