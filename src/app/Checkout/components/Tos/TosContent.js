import React from 'react';
import { Scrollable, TosHeader, TosLink, TosList, TosText } from './TosStyles';

const TosContent = () => {
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

export default TosContent;