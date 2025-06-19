import React from 'react'

// core functions
import { useCheckout } from "blocklotto-sdk";

import Button from '@components/Button';

export default function TermsOfService() {
    const { handleAgree } = useCheckout();

    return (
        <>            
            <div>
            <b>You are purchasing a lottery ticket</b> for the Marianas Blockchain Lottery, the official state lottery of the Commonwealth of the Northern Mariana Islands.
            <ul>
                <li>
                    The seller of the digital good in this transaction is {" "}
                    <a href={"https://nmrai.com"} rel="noopener noreferrer" target="_blank">
                        {' Marianas Rai Corp.'}
                    </a>, the official licensed operator of the lottery.
                </li>
                <li>
                    This purchase is for a lottery ticket only. It is not a purchase of digital currency, credits on any third-party platform, or any other product or service.
                </li>
                <li>
                    Once purchased, the data comprising the lottery ticket will be stored, as a transaction, on the eCash (XEC) blockchain. When the ticket transaction is confirmed in a block, this unhosted and non-custodial wallet will independently use the lottery ticket data to perform ticket redemption and (if applicable) payout of credits.
                </li>
                <li>
                    You have read and understand the {" "}
                    <a href="https://example.com" rel="noopener noreferrer" target="_blank">
                        {' Terms & Conditions '}
                    </a>
                    and
                    <a href="https://example.com" rel="noopener noreferrer" target="_blank">
                        {' Privacy Policy '}
                    </a>
                </li>
            </ul>

        </div>
            <Button size={"sm"} color={"tertiary"} onClick={handleAgree}>Agree</Button>
        </>
    )
}
