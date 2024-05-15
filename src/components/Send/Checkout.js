// node modules
import React, { useState, useEffect, useRef } from 'react';
import { 
    // useLocation,
    useHistory
} from 'react-router-dom';
// import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
// import { WalletContext } from '@utils/context';

// import { CashLoadingIcon } from '@components/Common/CustomIcons';
// import PrimaryButton from '@components/Common/PrimaryButton';
// import useBCH from '@hooks/useBCH';
import {
//     sendXecNotification,
//     sendTokenNotification,
//     selfMintTokenNotification,
    errorNotification,
} from '@components/Common/Notifications';
// import {
//     currency
// } from '@components/Common/Ticker.js';
// import { Event } from '@utils/GoogleAnalytics';
// import { 
//     getWalletState,
//     fromSmallestDenomination
// } from '@utils/cashMethods';
// import ApiError from '@components/Common/ApiError';
// import { formatFiatBalance } from '@utils/validation';
// import cashaddr from 'ecashaddrjs';
// import { 
//     Output,
//     Script,
//     script
// } from '@hansekontor/checkout-components';
// const { SLP } = script;
// import { U64 } from 'n64';
import {
    AuthCodeCtn, AuthCode,
    AuthCodeTextCtn, AuthCodeText, InfoIcon, 
    AuthCodeAmount, 
    AuthCodeDescription, 
    Offer, OfferHeader, OfferName, OfferDescription,
    Fee, FeeLabel, FeeAmount, 
    Total, TotalLabel, TotalAmount,
    TooltipLine, TooltipExpand, TooltipExpandText,
    Invoice, 
    Overlay, WidgetContent, WidgetCtn
} from "../../assets/styles/checkout.styles";
// import { AcceptHosted, HostedForm } from 'react-acceptjs';
// import ProgressDots from '@components/Common/ProgressDots';
import styled, { css } from 'styled-components';
import {
    Form,
    Modal,
    Spin
} from 'antd';

// custom react components
import Header from '@components/Common/Header';
import Agree from '@components/Send/Agree';
import { Enfold } from '@components/Common/CssAnimations';
import PrimaryButton, { ReturnButton, Support } from '../Common/PrimaryButton';
import { 
    Merchant, MerchantName, MerchantTag, MerchantIcon
} from '@components/Common/ContentHeader';

// assets
import CheckOutIcon from "@assets/checkout_icon.svg";
import MerchantSvg from '@assets/merchant_icon.svg';
import InfoPng from '@assets/info_icon.png';

// styled css components
const ReturnCtn = styled(Support)`
    justify-content: left;
`;
const Divider = styled.div`
    height: 1px;
    width: 85%;
    background-color: #000000;
`;
const Help = styled.div`
    height: 40px;
    width: 100%;
    gap: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Link = styled.a`
    text-underline-offset: 8px;
    text-decoration: underline;
`;
const CustomTotal = styled(Total)`
    border-radius: 40px;
    background-color: #ededed;
    padding: 8px 16px;
`;

const Checkout = ({
    passLoadingStatus,
    playerChoiceArray,
    passPurchasedTicket
}) => {

    const history = useHistory(); 

    // states
    const [isFirstRendering, setFirstRendering] = useState(true);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [tokensSent, setTokensSent] = useState(false);
    const [isStage1, setState1] = useState(true);
    const [helpSectionModal, helpSectionHolder] = Modal.useModal();

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // variables in DOM
    const offer_name = "Raffle Ticket";
    const merchant_name = "MRC";
    const purchaseTokenAmount = 3.33;
    const displayTicker = "CLUX";
    const feeAmount = 0.3;
    const totalAmount = purchaseTokenAmount + feeAmount;

    const helpText = "After payment, your ticket will be broadcasted to the blockchain. When the next block finalizes, it can be redeemed in this app.";
    const helpSectionConfig = {
        content: <p>{helpText}</p>
    };

    // handlers
    const handleToBackup = () => {
        history.push('/backup');
    }
    const handleAgree = async () => {
        setHasAgreed(true);
        await sleep(500);
        setFirstRendering(false);
    }
    const handleCheckoutHelp = () => {
        helpSectionModal.info(helpSectionConfig)
    }
    const handlePayNow = async () => {
        const purchasedTicket = {
            block: "0000000000000000137234656324a4539f1f986bc0ac72c74e4080d0f150abf5",
            hash: "361198ada49c1928e107dd93ab7bac53acbef208b0c0e8e65b4e33c3a02a32b6",
            maxPayout: "0000000000027100",
            // playerChoiceBytesString: "34204n67",
            playerChoiceBytesString: Buffer.from(playerChoiceArray, 'hex').toString('hex'),
            playerChoiceBytes: Buffer.from(playerChoiceArray, 'hex')
        }
        passPurchasedTicket(purchasedTicket)
        passLoadingStatus("AWAITING PAYMENT");
        await sleep(2000);
        passLoadingStatus("PROCESSING PAYMENT");
        await sleep(2000);
        passLoadingStatus("BROADCASTING TICKET");
        await sleep(2000);
        passLoadingStatus(false);
        history.push('/waitingroom')
    }

    const getPlayerChoiceBytes = (playerChoiceArray) => {
        const buffer = Buffer.allocUnsafe(4);
        try {
            playerChoiceArray.forEach((number, offset) => buffer.writeUInt8(number, offset));
        } catch(err) {
            errorNotification(err, "Missing Random Numbers", "Selected Numbers have not been passed.");
            history.push('/select');
        }

        return buffer;
    }

    console.log("playerChoiceBytes()", getPlayerChoiceBytes(playerChoiceArray).toString('hex'));

    return (
        <>  
            {helpSectionHolder}
            {/*pay && ( 
                <PaymentOverlay>
                    <RollupContent animate={true}>
                        <PaymentFormWidget 
                            amount={totalAmount}
                            sandbox={isSandbox}
                            onResult={handlePaymentResult}
                        />
                    </RollupContent>
                </PaymentOverlay>
            )} */}

            {/*<Modal
                title="Confirm Send"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>
                    Are you sure you want to send {formData.value}{' '}
                    {displayTicker} to settle this payment request?
                </p>
            </Modal>*/}                
                <Header />
                {!hasAgreed ? (
                    <>
                        <Agree 
                            // offer_name={prInfoFromUrl.paymentDetails?.merchantDataJson?.ipn_body?.offer_name}
                            offer_name={offer_name}
                            merchant_name={merchant_name}
                            handleAgree={handleAgree}
                        />
                        <ReturnCtn>
                            <ReturnButton 
                                returnToPath={"/select"}
                            />
                        </ReturnCtn>
                    </>      
                ) : (
                    <>
                        {!tokensSent && isStage1 && ( 
                            <>
                                <Enfold animate={isFirstRendering}>
                                    <Offer>
                                        <OfferHeader>
                                            {offer_name &&                    
                                                <OfferName>{offer_name}</OfferName>
                                            }
                                            <Merchant>
                                                <MerchantIcon src={MerchantSvg} />
                                                <MerchantName>MRC</MerchantName>
                                            </Merchant>                            
                                        </OfferHeader>
                                        {/* <Divider /> */}
                                        <OfferDescription>
                                            {`Purchase a ticket for this CLUX raffle with numbers ${playerChoiceArray || "missing"}. Its finalized block will contain all required data to self-mint your payout. This app supports the payout.`}
                                        </OfferDescription>
                                    </Offer>
                                    <Divider />
                                    <Fee>
                                        <FeeLabel>Ticket</FeeLabel>
                                        <FeeAmount>$10</FeeAmount>
                                    </Fee>
                                    <Fee>
                                        <FeeLabel>Processing Fee</FeeLabel>
                                        <FeeAmount>$0.5</FeeAmount>
                                    </Fee>
                                    <CustomTotal>
                                        <TotalLabel>Total</TotalLabel>
                                        <TotalAmount>${totalAmount}</TotalAmount>
                                    </CustomTotal>
                                 
                                    <PrimaryButton onClick={() => handlePayNow()}>Pay now</PrimaryButton>
                                    {/* {isStage1 ? (
                                        <>
                                            {hasAgreed && (
                                                <>
                                                    {uuid && formToken ? (
                                                        <PrimaryButton onClick={() => setPay(true)}>{payButtonText}</PrimaryButton>
                                                    ) : (
                                                        <>
                                                            {isSending && !tokensSent ? (
                                                                <Spin spinning={true} indicator={CashLoadingIcon}></Spin>
                                                            ) : (
                                                                <PrimaryButton onClick={() => handleOk()}>Send</PrimaryButton>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {isSending && !tokensSent ? <Spin spinning={true} indicator={CashLoadingIcon}></Spin> :
                                            <PrimaryButton onClick={() => handleOk()}>Send</PrimaryButton>}
                                        </>
                                    )} */}
                                    <Help>
                                        <Link onClick={() => handleCheckoutHelp()}>How does this work?</Link>
                                    </Help>                                   
                                </Enfold>

                            </>              
                        )}               
                        <ReturnCtn>
                            <ReturnButton 
                                onClick={() => setHasAgreed(false)}
                                displayOnly={true}
                            />
                        </ReturnCtn>  
                    </>         
                )}

                {/* {apiError && <ApiError />} */}
        </>
    );
}

export default Checkout;