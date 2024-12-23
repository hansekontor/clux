// node modules
import React from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';

// react components 
import PrimaryButton, { WalletButton, HelpButton, CashoutButton } from '@components/Common/PrimaryButton';
import Balance from '@components/Common/Balance';
import RandomNumbers, { ResultingNumbers } from '@components/Common/RandomNumbers';
import { CnmiIcon } from '@components/Common/CustomIcons';

// styled css components
export const LightFooterBackground = styled.div`
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0; 
    width: 100%;
    height: 100%;
    background-color: #FEFFFE;
`;
export const FooterCtn = styled.div`
    background-color: #48445c;
    align-items: center;
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    width: inherit;
    border-radius: 16px 16px 0 0;
    padding: 18px 0;
`;

const SupportBarCtn = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 90%;
    padding-top: 18px;
`;  


export const SupportBar = ({
    returnTo,
    ticketIndicator,
	slpBalances
}) => {
    
    const handleCnmiRedirect = () => {
        window.location.href = "https://example.com";        
    }

    return ( 
        <SupportBarCtn>
            <WalletButton returnTo={returnTo} indicator={ticketIndicator}/>
            <HelpButton />                
            <Balance slpBalances={slpBalances}/>
            <CashoutButton returnTo={returnTo}/>
            <CnmiIcon onClick={() => handleCnmiRedirect()}/>
        </SupportBarCtn>
    )
}

const Footer = ({
    origin,
    randomNumbers, 
    buttonOnClick,
    buttonText,
    ticketIndicator,
	slpBalances
}) => {
    return (
        <FooterCtn>
            {randomNumbers && 
                <RandomNumbers fixedRandomNumbers={randomNumbers} />
            }
            {buttonText && 
                <>
                    <PrimaryButton onClick={buttonOnClick}>
                        {buttonText}
                    </PrimaryButton>  
                </> 
            }
            <SupportBar returnTo={origin} ticketIndicator={ticketIndicator} slpBalances={slpBalances}/>
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