// node modules
import React from 'react';
import styled from 'styled-components';

// styled css components
import { ReturnButton } from '@components/Common/PrimaryButton';
import MerchantSvg from '@assets/merchant_icon.svg';

const AgreeHeader = styled.div`
    width: 100%;
    background-color: #FEFFFE;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #b9b9b9;
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
const MerchantIcon = styled.img``;
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
    returnTo,
    title,
    merchantTag
}) => {

    return (
        <AgreeHeader>
            <Navigation>
                <ReturnButton returnTo={returnTo}/>
                <Title>{title}</Title>                        
            </Navigation>       
            {merchantTag && (
                <Merchant>
                    <MerchantIcon src={MerchantSvg} />
                    <MerchantLabel></MerchantLabel>
                    <MerchantName>MRC</MerchantName>                        
                </Merchant>                    
            )}             

        </AgreeHeader>
    );
}

export default NavigationBar;