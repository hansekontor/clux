import React from 'react';
import styled from 'styled-components';
import MerchantSvg from '@assets/merchant_icon.svg';
import { 
    Header, 
    HeaderTitle,
    Merchant, 
    MerchantIcon, 
    MerchantTag,
    MerchantName, 
} from '@components/Common/ContentHeader';
import PrimaryButton from '@components/Common/PrimaryButton';

const Agree = ({offer_name, merchant_name, handleAgree}) => {

    const Divider = styled.div`
        height: 1px;
        width: 100%;
        background-color: #000000;
    `;
    const AgreeCtn = styled.div`
        width: 85%;
    `;
    const TosList = styled.ol`
        align-items: flex-start;
        display: inline-flex;
        flex-direction: column;
        height: fit-conten;
        position: relative;
        width: 100%;
        padding-left: 15px;
        gap: 10px;
    `;
    const TosHeader = styled.p`
        color: #000000;
        font-family: "Inter-Medium", Helvetica;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 0; 
        line-height: 25px;
        position: relative;
        width: 100%;
        top: 10px;
        text-align: left;
    `; 
    const TosText = styled.li`
        color: #000000;
        font-family: "Inter-Medium", Helvetica;
        font-size: 14x;
        font-weight: 500;
        letter-spacing: 0; 
        line-height: 20px;
        position: relative;
        text-align: left;
        width: 100%;
    `;
    const TosLink = styled.a`
        text-decoration-line: underline;
    `;

    return (
        <>
            <AgreeCtn>
                <Divider />
                <Header>
                    <HeaderTitle>AGREE</HeaderTitle>
                    <Merchant>
                        <MerchantIcon src={MerchantSvg} />
                        <MerchantTag>Merchant</MerchantTag>
                        <MerchantName>{merchant_name}</MerchantName>
                    </Merchant>
                </Header>
                <Divider />          
                <TosHeader>
                    You are about to Purchase a lottery ticket using a self-mint authorization code.
                </TosHeader>
                <TosList>
                    <TosText>
                        The seller of the digital good in this transaction is {" "}
                        <TosLink href={"https://example.com"} rel="noopener noreferrer" target="_blank">
                        {' [MRC Services Inc.]'}
                        </TosLink>.
                    </TosText>
                    <TosText>
                        This purchase is for an authorization code only. It is not a purchase of digital currency, credits on any third-party platform, or any other product or service. 
                    </TosText>
                    <TosText>
                        This unhosted wallet, upon receiving the authorization code (after your credit card payment is made),
                        will mint and send lottery tickets to settle the payment request.
                    </TosText>
                    <TosText>
                        You have read and understand the CLUX {" "}                    
                        <TosLink href="https://example.com" rel="noopener noreferrer" target="_blank">
                            Terms of Service
                        </TosLink>.
                    </TosText>                         
                </TosList>
                <PrimaryButton onClick={() => handleAgree()}>I Agree</PrimaryButton>
            </AgreeCtn>
        </>

    )
}

export default Agree;