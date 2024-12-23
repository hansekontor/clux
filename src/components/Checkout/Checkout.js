// node modules
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Modal, Radio } from 'antd';
import bcurl from 'bcurl';
import brq from 'brq';
import bio from 'bufio';
import {
	KeyRing, 
	TX, 
} from '@hansekontor/checkout-components';

import {
	Payment, 
	PaymentRequest, 
	PaymentACK
} from 'b70-checkout';

// custom react components
import Header from '@components/Common/Header';
import Tos from '@components/Checkout/Tos'
import KycInfo from '@components/Checkout/KycInfo';
import Ticket from '@components/Checkout/Ticket';
import { Enfold } from '@components/Common/CssAnimations';
import PrimaryButton from '@components/Common/PrimaryButton';
import NavigationBar from '@components/Common/Navigation';
import { FooterCtn, LightFooterBackground } from '@components/Common/Footer';
import RandomNumbers from '@components/Common/RandomNumbers';
import { CardIconBox } from '@components/Common/CustomIcons';

// utils & hooks
import useWallet from '@hooks/useWallet';
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'

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
	text-indent: 12px;
`;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const signMessage = (secret, msg) => {
	const keyring = KeyRing.fromSecret(secret);
	const sig = keyring.sign(msg);
	
	return sig;
}

/**
 * Component structure explanation placeholder
 * 
 */

const NmiCheckoutForm = ({
	passMetadata
}) => {
    const history = useHistory();

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


    const handleSubmit = (e) => {
		console.log("handleSubmit()")
        e.preventDefault();
        if (window.CollectJS) {
            window.CollectJS.startPaymentRequest();
        } else 
            console.log("CollectJS unavailable")
    }
    const handleResult = async (result) => {
        console.log("payment token", result.token);
		const paymentMetadata = result.token; 

		passMetadata(paymentMetadata);
	}
	
    return (
        <CustomForm onSubmit={handleSubmit} id="NMIC-form">
            <CardIconBox />
        </CustomForm>
    )
}

const lottoApiClient = bcurl.client({
    url: "https://lsbx.nmrai.com",
    timeout: 20000,
    headers: { 'Content-Type': 'application/etoken-paymentrequest' },
});

const Checkout = ({
    passLoadingStatus,
    playerNumbers,
}) => {
    const history = useHistory(); 
	// const { addTxsToHistory } = useWallet();

    // find ticket indicator
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const { tickets } = getWalletState(wallet);
	const { forceWalletUpdate, addIssueTxs } = useWallet();

    // states
    const [isFirstRendering, setFirstRendering] = useState(true);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [ticketIssued, setTicketIssued] = useState(false);
    const [isStage1, setState1] = useState(true);
    const [paymentProcessor, setPaymentProcessor] = useState("NMIC");
    const [isKYCed, setIsKYCed] = useState(false);
    const [email, setEmail] = useState(false);
    const [kycConfig, setKycConfig] = useState(false);
	const [paymentRequest, setPaymentRequest] = useState(false);
	const [paymentMetadata, setPaymentMetadata] = useState(false);
	const [paymentFromPr, setPaymentFromPr] = useState(false);
	const [payment, setPayment] = useState(false);
	const [purchaseOptions, setPurchaseOptions] = useState(false);


    if (!playerNumbers) {
        passLoadingStatus("PLAYER NUMBERS ARE MISSING");
        history.push("/select");
    }
    
    // variables DOM
    const offer_name = "Lottery Ticket";
    const merchant_name = "MRC";
    const purchaseTokenAmount = 3.33;
    const displayTicker = "CLUX";
    const feeAmount = 0.3;
    const totalAmount = purchaseTokenAmount + feeAmount;
    const agreeButtonText = "Agree and Continue";
    const purchaseButtonText = `Pay - $${10*purchaseOptions.ticketQuantity} - DEMO`; 

	// get payment request
	useEffect(async () => {
		if (purchaseOptions.ticketQuantity) {
			console.log("get invoice for qnt", purchaseOptions.ticketQuantity);
			const res = await fetch("https://lsbx.nmrai.com/v1/invoice", {
				method: "POST", 
				headers: new Headers({
					'Accept': "application/etoken-paymentrequest",
					'Content-Type': "application/json"}),
				mode: "cors",
				signal: AbortSignal.timeout(20000),
				body: JSON.stringify({quantity: purchaseOptions.ticketQuantity}),
			});
			// console.log("res", res);
			const invoiceRes = await res.arrayBuffer();
			const invoiceBuf = Buffer.from(invoiceRes);
			// const invoiceRes = await brq({
			// 	...lottoApiClient,
			// 	path: '/v1/invoice',
			// 	method: 'POST',
			// 	json: { quantity: purchaseOptions.tokenQantity },
			// });
			
			const pr = PaymentRequest.fromRaw(invoiceBuf);
			const payment = new Payment({
				memo: pr.paymentDetails.memo
			});
			console.log("pr", pr);
			setPaymentRequest(pr);
			setPaymentFromPr(payment);
		}
	}, [purchaseOptions])

	// finalize payment with paymentMetadata (payment token)
	useEffect(async () => {
		try {
			if (paymentMetadata && paymentRequest && !ticketIssued) {
				console.log("finalize payment");
				// get message to sign
				const bw = bio.write();
				const merchantData = paymentRequest.paymentDetails.getData('json');
				console.log("merchant data", merchantData);
				const paymentDataBuf = Buffer.from(merchantData.paymentdata, 'hex')
				bw.writeBytes(paymentDataBuf)
				const playerNumbersBuf = Buffer.from(playerNumbers, 'hex');
				bw.writeBytes(playerNumbersBuf);
				bw.writeBytes(Buffer.from(paymentProcessor, 'utf-8'));
				bw.writeVarString(paymentMetadata);
				const msgBuf = bw.render();
				console.log("msgBuf", msgBuf);

				// get signature
				const sigBuf = signMessage(wallet.Path1899.fundingWif, msgBuf);

				const newPayment = paymentFromPr;
				newPayment.setData({
					buyerpubkey: wallet.Path1899.publicKey,
					signature: sigBuf.toString('hex'),
					paymentdata: msgBuf.toString('hex')
				});
				console.log("newPayment", newPayment);
				lottoApiClient.headers = {
					'Content-Type': `application/${purchaseOptions.type}-payment`
				};
				const brqOptions = {
					...lottoApiClient, 
					path: '/v1/pay',
					method: 'POST',
					body: newPayment.toRaw(),
				};

				const response = await brq(brqOptions);
				if (response.statusCode !== 200) {
					throw new Error(response.text());
				}
				console.log("response", response);

				const ack = PaymentACK.fromRaw(response.buffer());
				console.log(ack.memo);
				const rawTransactions = ack.payment.transactions;
				const txs = rawTransactions.map(r => TX.fromRaw(r).toJSON());
				console.log(txs);

				setTicketIssued(true);

				// put txs in storage
				await addIssueTxs(txs);

				// advance to backup
				history.push('/backup');
			} 
		} catch (err) {
			console.error(err);
		}
	}, [paymentMetadata, payment])


    // handlers
    const handleAgree = async (e) => {
        e.preventDefault();
        setHasAgreed(true);
        await sleep(500);
        setFirstRendering(false);
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

	useEffect(async() => {
		if (hasAgreed) {
			await forceWalletUpdate();
		}
	}, [hasAgreed])

    const handlePaymentChange = (e) => {
        const newPaymentProcessor = e.target.value;
        setPaymentProcessor(newPaymentProcessor)
    }

    const handleReturn = () => {
        const previousPath = "/select";
        history.push(previousPath);
    }

	const handlePurchaseOptionsSubmit = (e) => {
		e.preventDefault();
		const newPurchaseOptions = {
			ticketQuantity: e.target.ticketQuantity.value,
			type: e.target.type.value
		};
		setPurchaseOptions(newPurchaseOptions);
	}

    const tosTitle = "Purchase Terms";
    const checkoutTitle = "Checkout";


    return (
        <>  
            {!(hasAgreed && isKYCed) ? (
                <>
                    <Header background="#FEFFFE" />
                    {!hasAgreed ? (
                        <>
                            <NavigationBar 
                                handleOnClick={handleReturn}
                                title={tosTitle}
                            />
                            <Tos />
                            <FooterCtn>
                                <LightFooterBackground />

                                <RandomNumbers 
                                    fixedRandomNumbers={playerNumbers}
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
					{!purchaseOptions ? (
						<>
		                    <Header background="#FEFFFE" />
							<NavigationBar 
								handleOnClick={handleReturn}
								title={checkoutTitle}
								merchantTag={true}
							/>    

							<Scrollable>
								<div>Purchase Ticket Amount</div>
								<form id="purchase-options-form" onSubmit={handlePurchaseOptionsSubmit}>
									<input type="number" name="ticketQuantity" defaultValue={1}/>
									<select type="select" name="type">
										<option value="fiat">Fiat</option>
										{/* <option value="etoken">eToken</option> */}
									</select>						
								</form>
							</Scrollable>

							<FooterCtn>
								<EvenLighterFooterBackground />

                                <RandomNumbers 
                                    fixedRandomNumbers={playerNumbers}
                                />
                                <PrimaryButton 
                                    form={"purchase-options-form"}
                                >
                                    {"Confirm"}
                                </PrimaryButton>
                            </FooterCtn>



						</>
					) : (
						<>
							{!ticketIssued && isStage1 && ( 
								<>
									<Header background="#FEFFFE"/>
									<NavigationBar 
										handleOnClick={handleReturn}
										title={checkoutTitle}
										merchantTag={true}
									/>                                      
									<Scrollable>
										<CustomEnfold animate={isFirstRendering}>     
											<Ticket 
												numbers={playerNumbers}
												background={'#EAEAEA'}
											/>
											<InfoText>
												To purchase this lottery ticket your numbers and wallet address will be encrypted in the finalized block with all required data to self-mint our potential payout. This game supports the payout.
											</InfoText>
											<PaymentHeader>Payment</PaymentHeader>
											<CustomRadioGroup onChange={handlePaymentChange} value={paymentProcessor}>
												<Radio value={"NMIC"} >Credit Card</Radio>
												{/* <Radio value={"other"} >Other</Radio> */}
											</CustomRadioGroup>

											{paymentProcessor === "NMIC" && (
												<NmiCheckoutForm 
													passMetadata={setPaymentMetadata}	
												/>
											)}

											{/* add new payment methods here */}

										</CustomEnfold>
									</Scrollable>
									<FooterCtn>
										<EvenLighterFooterBackground />
										<PrimaryButton 
											type="submit"
											form={`${paymentProcessor}-form`}
										>
											{purchaseButtonText}
										</PrimaryButton>
									</FooterCtn>
								</>              
							)}    
						</>
					)}      
                </>         
            )}
        </>
    );
}

export default Checkout;
