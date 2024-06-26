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
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import geStripe from '@utils/stripe';
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
import Header, { SmallHeader } from '@components/Common/Header';
import Agree from '@components/Send/Agree';
import { Enfold } from '@components/Common/CssAnimations';
import PrimaryButton, { SupportButtons } from '../Common/PrimaryButton';
import { 
    Merchant, MerchantName, MerchantTag, MerchantIcon
} from '@components/Common/ContentHeader';

// assets
import CheckOutIcon from "@assets/checkout_icon.svg";
import MerchantSvg from '@assets/merchant_icon.svg';
import InfoPng from '@assets/info_icon.png';
import { getOutputScriptFromAddress } from 'ecashaddrjs';
import getStripe from '../../utils/stripe';

// styled css components
// const ReturnCtn = styled(Support)`
//     justify-content: left;
// `;
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
const CustomForm = styled.form`
    width: 85%;
    margin-top: 30px;
    margin-bottom: 30px;
`;
const Scrollable = styled.div`
    width: 480px;
    height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 0px;
    overflow-y: scroll;

    @media (max-width: 480px) {
        width: 100%;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }
`;
const CustomEnfold = styled(Enfold)`
    position: absolute;
    top: 30px;
`;
const CheckoutButton = styled(PrimaryButton)`
    margin-top: 20px;
    margin-bottom: 30px;
`;



export const StripeCheckoutForm = ({
    passLoadingStatus, 
    passPurchasedTicket,
    playerChoiceArray
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
    
        if (!stripe || !elements) {
          // Stripe.js hasn't yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }
    
        passLoadingStatus("CONFIRMING PAYMENT");
        const result = await stripe.confirmPayment({
          //`Elements` instance that was used to create the Payment Element
          elements,
          confirmParams: {
            // return_url: "https",
          },
          redirect: 'if_required'        
        });            

        if (result.error) {
          // Show error to your customer (for example, payment details incomplete)
          console.log(result.error.message);
          passLoadingStatus("PAYMENT FAILED");
          await sleep(3000);
          history.push("/checkout");
        } else {
          // Your customer will be redirected to your `return_url`. For some payment
          // methods like iDEAL, your customer will be redirected to an intermediate
          // site first to authorize the payment, then redirected to the `return_url`.
          console.log("result", result);
          passLoadingStatus("PAYMENT CONFIRMED");
          await sleep(2000);
          passLoadingStatus("BROADCASTING TICKET");
          const purchasedTicket = {
                block: "0000000000000000137234656324a4539f1f986bc0ac72c74e4080d0f150abf5",
                hash: "361198ada49c1928e107dd93ab7bac53acbef208b0c0e8e65b4e33c3a02a32b6",
                maxPayout: "0000000000027100",
                // playerChoiceBytesString: "34204n67",
                playerChoiceBytesString: Buffer.from(playerChoiceArray, 'hex').toString('hex'),
                playerChoiceBytes: Buffer.from(playerChoiceArray, 'hex')
            }
            passPurchasedTicket(purchasedTicket)
          await sleep(2000);
          passLoadingStatus("TRANSACTION COMPLETE");
          await sleep(3000);
          history.push("/backup");      
        }
    };


    return (
        <CustomForm onSubmit={handleSubmit}>
            <PaymentElement />
            <CheckoutButton disabled={!stripe}>Pay</CheckoutButton>
        </CustomForm>
    )
}

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
    const [clientSecret, setClientSecret] = useState("");



    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (!playerChoiceArray) {
        passLoadingStatus("PLAYER NUMBERS ARE MISSING");
        history.push("/select");
    }
    
    // variables in DOM
    const offer_name = "Lottery Ticket";
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

    // stripe code
    const [stripeSession, setStripeSession] = useState(false);
    const [stripeOptions, setStripeOptions] = useState(false);
    
    const initPayment = async () => {
        console.log("initPayment called")
        const url = "https://dev.cert.cash:4001/stripe";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const { paymentIntent } = await response.json();
        console.log("paymentIntent collected", paymentIntent);
        return paymentIntent;
    }

    const handleCheckout = async () => {

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
        passLoadingStatus("TRANSACTION COMPLETE");
        await sleep(3000);
        history.push('/backup')
    }

    useEffect(async () => {
        passLoadingStatus(false);
        
        if(!stripeSession) {
            const stripeSession = await getStripe();
            setStripeSession(stripeSession);    
            console.log("stripe session set")
        }

        if (!stripeOptions) {
            const stripeOptions = {
                clientSecret: await initPayment(),
                appearance: {
                    theme: 'flat',
                    variables: {
                        fontFamily: ' "Gill Sans", sans-serif',
                        fontLineHeight: '1.5',
                        borderRadius: '10px',
                        colorBackground: '#F6F8FA',
                        accessibleColorOnColorPrimary: '#262626'
                    },
                    rules: {
                        '.Block': {
                            backgroundColor: 'var(--colorBackground)',
                            boxShadow: 'none',
                            padding: '12px'
                        },
                        '.Input': {
                            padding: '12px'
                        },
                        '.Input:disabled, .Input--invalid:disabled': {
                            color: 'lightgray'
                        },
                        '.Tab': {
                            padding: '10px 12px 8px 12px',
                            border: 'none'
                        },
                        '.Tab:hover': {
                            border: 'none',
                            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
                        },
                        '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                            border: 'none',
                            backgroundColor: '#fff',
                            boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
                        },
                        '.Label': {
                            fontWeight: '500'
                        }
                    }
                }
            };
            console.log("stripeOptions", stripeOptions);
            setStripeOptions(stripeOptions);            
        }
    }, [])


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
                {!hasAgreed ? (
                    <>
                        <Header />
                        <Agree 
                            // offer_name={prInfoFromUrl.paymentDetails?.merchantDataJson?.ipn_body?.offer_name}
                            offer_name={offer_name}
                            merchant_name={merchant_name}
                            handleAgree={handleAgree}
                        />
                        <SupportButtons prev="/select" types={["return", "help"]}/>
                    </>      
                ) : (
                    <>
                        {!tokensSent && isStage1 && ( 
                            <>
                                {/* <Scrollable> */}
                                    <CustomEnfold animate={isFirstRendering}>        
                                            <Offer>
                                                <OfferHeader>
                                                    {offer_name &&                    
                                                        <OfferName>{offer_name}</OfferName>
                                                    }
                                                    <Merchant>
                                                        <MerchantIcon src={MerchantSvg} />
                                                        <MerchantName>MRC</MerchantName>
                                                    </Merchant>                                           
                                                    <SmallHeader />
                                                </OfferHeader>
                                                {/* <Divider /> */}
                                                <OfferDescription>
                                                    {`Purchase a lottery ticket with numbers ${playerChoiceArray.join(', ') || "missing"}. Your numbers and wallet address will be encrypted in the finalized block with all required data to self-mint your potential payout. This game supports the payout.`}
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
                                                {/* <TotalAmount>${totalAmount}</TotalAmount> */}
                                                <TotalAmount>$10.5</TotalAmount>
                                            </CustomTotal>

                                            {/* <PrimaryButton onClick={() => handleCheckout()}>Pay now</PrimaryButton> */}

                                            {stripeSession && stripeOptions &&
                                                <Elements 
                                                    stripe={stripeSession}
                                                    options={stripeOptions}
                                                >                  
                                                    <StripeCheckoutForm 
                                                        passLoadingStatus={passLoadingStatus}
                                                        passPurchasedTicket={passPurchasedTicket}
                                                        playerChoiceArray={playerChoiceArray}
                                                    />            
                                                </Elements>                                        
                                            }

                                            {/* {stripePromise && (
                                                <Elements stripe={stripePromise} options={stripeOptions}>
                                                    <PaymentElement />
                                                </Elements>
                                            )} */}
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
                                    </CustomEnfold>
                                {/* </Scrollable> */}
                            </>              
                        )}          

                        <SupportButtons 
                            prev="/select" 
                            types={["return", "help"]}
                            sticky={hasAgreed}    
                        />

     
                        {/* <ReturnCtn>
                            <ReturnButton 
                                onClick={() => setHasAgreed(false)}
                                displayOnly={true}
                            />
                        </ReturnCtn>   */}
                    </>         
                )}

                {/* {apiError && <ApiError />} */}
        </>
    );
}

export default Checkout;
