// node modules
import React from 'react';
import styled from 'styled-components';

// custom react modules
import { ReturnButton } from '@components/Common/PrimaryButton';

// assets
import MerchantSvg from '@assets/merchant_icon.svg';

// styled css components
const AgreeHeader = styled.div`
    width: 100%;
    background-color: ${props => props.theme.checkout.navigation.background};
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid ${props => props.theme.checkout.methods.border};
    margin-top: 0px;
`;
const Title = styled.div`
    font-family:  Helvetica;
    font-weight: 600;
`;
const Navigation = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-left: 3%;
`;
const Merchant = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3px;
    padding-right: 6%;
`;
const MerchantLabel = styled.div`
    font-family: "Inter-Regular", Helvetica;
    font-size: 14px;
    font-weight: 400;`
;
const MerchantName = styled.div`
    font-family: "Inter-SemiBold", Helvetica;
    font-size: 14px;
    font-weight: 600;
`;


const NavigationBar = ({
    title,
    merchantTag,
    handleOnClick
}) => {

    return (
        <AgreeHeader>
            <Navigation>
                <ReturnButton onClick={handleOnClick}/>
                <Title>{title}</Title>                        
            </Navigation>       
            {merchantTag && (
                <Merchant>
                    <img src={MerchantSvg} />
                    <MerchantLabel></MerchantLabel>
                    <MerchantName>Marianas Blockchain Lottery</MerchantName>                        
                </Merchant>                    
            )}             

        </AgreeHeader>
    );
}

export default NavigationBar;