// node modules
import React from 'react';
import styled from 'styled-components';

// react component
import PrimaryButton, { ReturnButton } from '@components/Common/PrimaryButton';
import Footer from '@components/Common/Footer';

// assets
import MerchantSvg from '@assets/merchant_icon.svg';

// styled css components
const AgreeCtn = styled.div`
    width: 100%;
    background-color: #EAEAEA;
    flex-grow: 1;
`;
const Scrollable = styled.div`
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    background-color: #EAEAEA;
`;
const TosList = styled.ol`
    align-items: flex-start;
    display: inline-flex;
    flex-direction: column;
    height: fit-content;
    position: relative;
    width: 90%;
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
    width: 90%;
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
    width: 90%;
`;
const TosLink = styled.a`
    text-decoration-line: none;
`;
const Tos = ({randomNumbers, handleAgree}) => {

    const previousPath = "/select";
    const title = "Agree";

    return (
        <Scrollable>
            <TosHeader>
                <b>You are purchasing a lottery ticket</b> for the Marianas Blockchain Lottery, the official state lottery of the Commonwealth of the Northern Mariana Islands.
            </TosHeader>
            <TosList>
                <TosText>
                    The seller of the digital good in this transaction is {" "}
                    <TosLink href={"https://nmrai.com"} rel="noopener noreferrer" target="_blank">
                    {' Marianas Rai Corp.'}
                    </TosLink>, the official licensed operator of the lottery.
                </TosText>
                <TosText>
                    This purchase is for a lottery ticket only. It is not a purchase of digital currency, credits on any third-party platform, or any other product or service.
                </TosText>
                <TosText>
                    Once purchased, the data comprising the lottery ticket will be stored, as a transaction, on the eCash (XEC) blockchain. When the ticket transaction is confirmed in a block, this unhosted and non-custodial wallet will independently use the lottery ticket data to perform ticket redemption and (if applicable) payout of credits.
                </TosText>
                <TosText>
                    You have read and understand the {" "}                    
                    <TosLink href="https://example.com" rel="noopener noreferrer" target="_blank">
                        {' Terms & Conditions '}
                    </TosLink> 
                    and
                    <TosLink href="https://example.com" rel="noopener noreferrer" target="_blank">
                        {' Privacy Policy '}
                    </TosLink>
                </TosText>                         
            </TosList>                    
        </Scrollable>
    )
}

export default Tos;