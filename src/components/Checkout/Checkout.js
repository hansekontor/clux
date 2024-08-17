// node modules
import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
    useHistory
} from 'react-router-dom';
import { errorNotification } from '@components/Common/Notifications';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import styled, { css } from 'styled-components';
import {
    Modal,
    Radio
} from 'antd';

// custom react components
import Header from '@components/Common/Header';
import { Enfold } from '@components/Common/CssAnimations';
import PrimaryButton from '../Common/PrimaryButton';
import NavigationBar from '@components/Common/Navigation';
import Tos from '@components/Checkout/Tos'
import { FooterCtn, LightFooterBackground } from '@components/Common/Footer';
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'
import RandomNumbers from '@components/Common/RandomNumbers';
import Ticket from '@components/Checkout/Ticket';
import KycInfo from '@components/Checkout/KycInfo';
import getStripe from '../../utils/stripe';

// assets
import CardIconSvg from '@assets/card_icon.svg'
import LockIconSvg from '@assets/lock_icon.svg'
import MastercardIconSvg from '@assets/mastercard_icon.svg'
import VisaIconSvg from '@assets/visa_icon.svg'

// styled css components
const CustomForm = styled.form`
    width: 85%;
    margin-top: 30px;
    margin-bottom: 30px;
`;
const CustomEnfold = styled(Enfold)`
    flex-grow: 1;
`;
const Scrollable = styled.div`
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex;
    height: 80%;
    width: 100%;
    background-color: #EAEAEA;
`;
const CustomRadioGroup = styled(Radio.Group)`
    margin-top: 8px;
`;
const CardIcons = styled.div`
    margin: auto;
    gap: 12px;
    border-radius: 12px;
    background-color: #ffffff;
    padding: 7px;
    width: fit-content;
    display: flex;
`;
const EvenLighterFooterBackground = styled(LightFooterBackground)`
    background-color: #EAEAEA;
`;
const InfoText = styled.p`
    width: 90%;
    font-size: 11px;
    line-height: 150%;
    color: #1A1826;
    text-align: justify;
    hyphens: auto;
    text-align-last: none;
`;
const PaymentHeader = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin: 12px 0;
    width: 90%;
    text-align: left;
`;
const FlexGrow = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FEFFFE;
    flex-direction: column;
    width: 100%;
`;
const EmailForm = styled.form`
    width: 90%;
    padding-bottom: 12px;
`;
const Input = styled.input`
    border-radius: 12px;
    background-color: #F6F6F6;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 100%;
    border-style: none;
    text-color: #ABCDEF;
`;


const NmiCheckoutForm = ({
    passLoadingStatus,
    passPurchasedTicket,
    playerChoiceArray
}) => {
    const history = useHistory();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        window.CollectJS.configure({
            variant: 'lightbox',
            styleSniffer: false,
            callback: (token) => {
                console.log("token", token);
                handleResult(token);
            },
            fields: {
                ccnumber: {
                    placeholder: "1234 1234 1234 1234",
                    selector: "#ccnumber"
                },
                ccexp: {
                    placeholder: "MM / YY",
                    selector: "#ccexp"
                },
                cvv: {
                    placeholder: "CVV",
                    selector: "#cvv"
                }
            },
            customCss: {
                "border-radius": "12px",
                "height": "44px",
                "border-style": "none"
            }
        })
    }, []);

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // handlers
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (window.CollectJS) {
            window.CollectJS.startPaymentRequest();
        } else 
            console.log("CollectJS unavailable")
    }
    const handleFormDataChange = (e) => {
        let newFormData = formData;
        newFormData[e.target.name] = e.target.value;
        setFormData(newFormData);
    }
    // dev rename
    const handleResult = async (result) => {
        console.log("payment token", result.token);
        setIsSubmitting(false);
        passLoadingStatus("CONFIRMING PAYMENT");
        await sleep(2000);
        passLoadingStatus("PAYMENT CONFIRMED")
        await sleep(2000);
        passLoadingStatus("BROADCASTING TICKET");
        await sleep(2000);
        const purchasedTicket = {
            block: "0000000000000000137234656324a4539f1f986bc0ac72c74e4080d0f150abf5",
            hash: "361198ada49c1928e107dd93ab7bac53acbef208b0c0e8e65b4e33c3a02a32b6",
            maxPayout: "0000000000027100",
            // playerChoiceBytesString: "34204n67",
            playerChoiceBytesString: Buffer.from(playerChoiceArray, 'hex').toString('hex'),
            playerChoiceBytes: Buffer.from(playerChoiceArray, 'hex')
        }
        passPurchasedTicket({
            id: purchasedTicket.hash,
            playerChoice: playerChoiceArray
        });
        passLoadingStatus("TICKET BROADCASTED");
        await sleep(2000);
        history.push('/backup')
    }

    return (
        <CustomForm onSubmit={handleSubmit} id="nmi-form">
            <CardIcons>
                <img src={CardIconSvg} />
                <img src={LockIconSvg} />
                <img src={MastercardIconSvg} />
                <img src={VisaIconSvg} />
            </CardIcons>
        </CustomForm>
    )
}

const StripeCheckoutForm = ({
    passLoadingStatus, 
    passPurchasedTicket,
    playerChoiceArray // demo placeholder
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
            passPurchasedTicket({
                id: purchasedTicket.hash,
                playerChoice: playerChoiceArray
            })
            await sleep(2000);
            passLoadingStatus("TRANSACTION COMPLETE");
            await sleep(3000);
            history.push("/backup");      
        }
    };


    return (
        <CustomForm onSubmit={handleSubmit} id="stripe-form">
            <PaymentElement />
        </CustomForm>
    )
}

const Checkout = ({
    passLoadingStatus,
    playerChoiceArray,
    passPurchasedTicket,
}) => {
    const history = useHistory(); 

    // find ticket indicator
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const { tickets } = getWalletState(wallet);
    const unredeemedTickets = tickets.filter((ticket) => !ticket.payout);

    // states
    const [isFirstRendering, setFirstRendering] = useState(true);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [tokensSent, setTokensSent] = useState(false);
    const [isStage1, setState1] = useState(true);
    const [helpSectionModal, helpSectionHolder] = Modal.useModal();
    const [clientSecret, setClientSecret] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("stripe");
    const [isKYCed, setIsKYCed] = useState(false);
    const [email, setEmail] = useState(false);
    const [kycConfig, setKycConfig] = useState(false);



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
    const agreeButtonText = "Agree and Continue";
    const purchaseButtonText = "Pay - $10"; 



    const helpText = "After payment, your ticket will be broadcasted to the blockchain. When the next block finalizes, it can be redeemed in this app.";
    const helpSectionConfig = {
        content: <p>{helpText}</p>
    };

    // handlers
    const handleToBackup = () => {
        history.push('/backup');
    }
    const handleAgree = async (e) => {
        e.preventDefault();
        setHasAgreed(true);
        await sleep(500);
        setFirstRendering(false);
    }
    const handleCheckoutHelp = () => {
        helpSectionModal.info(helpSectionConfig)
    }

    const handleKYCResult = async (result) => {
        console.log("KYC", result);

        switch (result.status) {
            // ----Incomplete workflow-----
            case "user_cancelled":
                break;
            case "error":
                break;
        
            // ----Complete workflow-----
            case "auto_approved":
                break;
            case "auto_declined":
                break;
            case "needs_review":
                break;
            }
    }
    const handleEmailAndKYC = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        // check if KYC necessary
        // if yes: create kyc config            
        // const accessToken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6InhjYjlmbiIsImhhc2giOiJiZDZkMDM2OWQwYWI1MjE3YzJjNzE0ZTVhN2U4ZjIxOGM5YTliNzMyY2QwZjY4Y2RlNWZmYTYwNTRkNjA3NDNjIiwiaWF0IjoxNzIzNTM3MTcwLCJleHAiOjE3MjM2MjM1NzAsImp0aSI6ImYxYjczYjg4LTA3NTQtNGQ4OC05NGZkLTMzNGVhOTI1OThlYiJ9.P2QYdyjmxe1MpaxAD8AUk_21ZrVJWKUeWeoWf1Ia_tC8XN5l2k38o7-fLnxI-pxIyRatjS7BmYsh2g15v39qJQw4uHOMq5W3m5VyB1rmmYLCoPftfKjtpvdRhGExgsaKRk9t5hT-YiCiBBkxYIFuBA6XEzb33GUGQNvkAWhV8c4";
        // // AML workflow id
        // // const workflowId = "workflow_UCfjDcF";
        // const workflowId = "workflow_a93TCBh";
        // const transactionId = "ecash:1234567";
        // const config = new window.HyperKycConfig(accessToken, workflowId, transactionId); 
        // config.setInputs({
        //     email: email
        // })
        // setKycConfig(config);   
        setIsKYCed(true);
        console.log("setIsKYced to true")
    }
    // useEffect(()=> {
    //     if (kycConfig) {
    //         window.HyperKYCModule.launch(kycConfig, handleKYCResult);
    //     }
    // }, [kycConfig])

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
        return paymentIntent;
    }

    const handlePaymentChange = (e) => {
        const newPaymentMethod = e.target.value;
        setPaymentMethod(newPaymentMethod)
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
        passPurchasedTicket({
            id: purchasedTicket.hash,
            playerChoice: playerChoiceArray
        });
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
            setStripeOptions(stripeOptions);            
        }
    }, [])

    const previousPath = "/select";
    const tosTitle = "Purchase Terms";
    const checkoutTitle = "Checkout";


    return (
        <>  
            {helpSectionHolder}            
            {!(hasAgreed && isKYCed) ? (
                <>
                    <Header background="#FEFFFE" />
                    {!hasAgreed ? (
                        <>
                            <NavigationBar 
                                returnTo={previousPath}
                                title={tosTitle}
                            />
                            <Tos />
                            <FooterCtn>
                                <LightFooterBackground />

                                <RandomNumbers 
                                    fixedRandomNumbers={playerChoiceArray}
                                />
                                <PrimaryButton 
                                    form={"email-form"}
                                    onClick={handleAgree}
                                >
                                    {agreeButtonText}
                                </PrimaryButton>
                            </FooterCtn>
                        </>
                    ) : (
                        <>
                            <FlexGrow>
                                <KycInfo />                       
                                <EmailForm id='email-form' onSubmit={handleEmailAndKYC}>
                                    <Input 
                                        placeholder="Enter your Email"
                                        name="email"
                                    />
                                </EmailForm>
                                <PrimaryButton form="email-form">Continue</PrimaryButton>
                            </FlexGrow>
                        </>  
                    )}
                </>      
            ) : (
                <>
                    {!tokensSent && isStage1 && ( 
                        <>
                            <Header background="#FEFFFE"/>
                            <NavigationBar 
                                returnTo={"/select"}
                                title={checkoutTitle}
                                merchantTag={true}
                            />                                      
                            <Scrollable>
                                <CustomEnfold animate={isFirstRendering}>     
                                    <Ticket 
                                        numbers={playerChoiceArray}
                                        background={'#EAEAEA'}
                                    />
                                    <InfoText>
                                        To purchase this lottery ticket your numbers and wallet address will be encrypted in the finalized block with all required data to self-mint our potential payout. This game supports the payout.
                                    </InfoText>
                                    <PaymentHeader>Payment</PaymentHeader>
                                    <CustomRadioGroup onChange={handlePaymentChange} value={paymentMethod}>
                                        <Radio value={"stripe"} >Stripe</Radio>
                                        <Radio value={"nmi"} >Credit Card</Radio>
                                        <Radio value={"other"} >Other</Radio>
                                    </CustomRadioGroup>
                                    {paymentMethod === "stripe" && (
                                        <>
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
                                        </>
                                    )}
                                    {paymentMethod === "nmi" && (
                                        <NmiCheckoutForm 
                                            passLoadingStatus={passLoadingStatus}
                                            passPurchasedTicket={passPurchasedTicket}
                                            playerChoiceArray={playerChoiceArray}
                                        />
                                    )}
                                </CustomEnfold>
                            </Scrollable>
                            <FooterCtn>
                                <EvenLighterFooterBackground />
                                <PrimaryButton 
                                    type="submit"
                                    form={`${paymentMethod}-form`}
                                >
                                    {purchaseButtonText}
                                </PrimaryButton>
                            </FooterCtn>
                        </>              
                    )}          
                </>         
            )}
        </>
    );
}

export default Checkout;
