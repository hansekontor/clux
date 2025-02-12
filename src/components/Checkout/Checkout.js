// node modules
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Modal, Radio } from 'antd';
import bio from 'bufio';
import {
	KeyRing, 
	TX, 
    MTX,
    bcrypto,
    Script,
    Coin
} from '@hansekontor/checkout-components';
const { SHA256 } = bcrypto;
import { U64 } from 'n64';
import { stringify as uuidStringify } from 'uuid';

import {
	Payment, 
	PaymentRequest, 
	PaymentACK
} from 'b70-checkout';
import CreatableSelect from 'react-select/creatable';
import BigNumber from 'bignumber.js';

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
    font-size: 13px;
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
const CustomCreatableSelect = styled(CreatableSelect)`
	border-color: ${props => props.error ? "#e74c3c" : "#000000"};
	width: 100%;
`;
const Form = styled.form`
	width: 80%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 30px;
	margin-bottom: 30px;
`;
const PaymentForm = styled(Form)`
	gap: 12px;
`;
const ErrorMessage = styled.div`
	color: red;
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

	const [inputError, setInputError] = useState(false);
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
        <PaymentForm onSubmit={handleSubmit} id="NMIC-form">
            <CardIconBox />
			{/* {inputError && <ErrorMessage>{inputError}</ErrorMessage>} */}
			<PaymentInput 
				type="text"
				name="firstname"
				placeholder="First Name	"
				required
			/>
			<PaymentInput 
				type="text"
				name="lastname"
				placeholder="Last Name"
				required
			/>
			<PaymentInput 
				type="text"
				name="zip"
				placeholder="ZIP"
				required
			/>
        </PaymentForm>
    )
}

const Checkout = ({
    passLoadingStatus,
    playerNumbers,
	user
}) => {
    const history = useHistory(); 
	// const { addTxsToHistory } = useWallet();

    // find ticket indicator
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const { tickets, slpBalancesAndUtxos } = getWalletState(wallet);
	const { forceWalletUpdate, addIssueTxs } = useWallet();
	const token = slpBalancesAndUtxos.tokens ? slpBalancesAndUtxos.tokens[0] : false;
	let maxEtokenTicketQuantity = 0; 
	if (token) {
		const balance = (new BigNumber({...token.balance, _isBigNumber: true}).toNumber()) / 100;
		maxEtokenTicketQuantity = Math.floor(balance / 10);
	}
	console.log("max etoken qtty", maxEtokenTicketQuantity);

    // states
    const [isFirstRendering, setFirstRendering] = useState(true);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [ticketIssued, setTicketIssued] = useState(false);
    const [isStage1, setState1] = useState(true);
    const [paymentProcessor, setPaymentProcessor] = useState("NMIC");
    const [isKYCed, setIsKYCed] = useState(false);
    const [kycConfig, setKycConfig] = useState(false);
	const [paymentRequest, setPaymentRequest] = useState(false);
	const [paymentMetadata, setPaymentMetadata] = useState(false);
	const [purchaseOptions, setPurchaseOptions] = useState(false);
	const [ticketQtyError, setTicketQtyError] = useState(false);
	const [kycAccessToken, setKycAccessToken] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [hasEmail, setHasEmail] = useState(false);


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

	useEffect(async () => {
		console.log("CHECKOUT user", user);
		if (user && !user.ipGeo.ticketPurchase) {
			passLoadingStatus("ACCESS DENIED");
			await sleep(2000);
			history.push("/select");
		}
	}, [user])


	// skip email prompt if email already available
	useEffect(() => {
		if (user.email) 
			setHasEmail(true);

	}, [user])

	// initialize payment request
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
				body: JSON.stringify({
					quantity: purchaseOptions.ticketQuantity
				}),
			});
			// console.log("res", res);
			const invoiceRes = await res.arrayBuffer();
			const invoiceBuf = Buffer.from(invoiceRes);
	
			const pr = PaymentRequest.fromRaw(invoiceBuf);

			console.log("pr", pr);
			setPaymentRequest(pr);
		}
	}, [purchaseOptions])

	// finalize payment with paymentMetadata (payment token)
	useEffect(async () => {
		try {
			if (paymentMetadata && paymentRequest && !ticketIssued) {
				console.log("finalize payment");			


				// get message to sign
				const merchantData = paymentRequest.paymentDetails.getData('json');
				console.log("merchant data", merchantData);
				const paymentDataBuf = Buffer.from(merchantData.paymentdata, 'hex');
                const br = bio.read(paymentDataBuf);
                const id = uuidStringify(br.readBytes(16));
                const amount = br.readU32() / 100;
                console.log({id, amount});

				setKycAccessToken(merchantData.kyctoken);

				const bw = bio.write();
				bw.writeBytes(paymentDataBuf)
				const playerNumbersBuf = Buffer.from(playerNumbers, 'hex');
				bw.writeBytes(playerNumbersBuf);

				const payment = new Payment({
                    memo: paymentRequest.paymentDetails.memo
                });
                console.log("payment", payment);   

                const coinsUsed = [];

                if (purchaseOptions.type === "fiat") {
                    bw.writeBytes(Buffer.from(paymentProcessor, 'utf-8'));
                    bw.writeVarString(paymentMetadata);                    
                } else {
                    // get token coins
                    const sortedTokenUtxos = slpBalancesAndUtxos.slpUtxos.filter(u => u.slp?.tokenId && ['MINT', 'SEND'].includes(u.slp.type))
                        .sort((a, b) => parseInt(a.slp.value) - parseInt(b.slp.value));
                    console.log("sortedTokenUtxos", sortedTokenUtxos);

                    // construct tx
                    const tx = new MTX();
                    const prOutputs = paymentRequest.paymentDetails.outputs;
                    for (let i = 0; i < prOutputs.length; i++) {
                        tx.addOutput(Script.fromRaw(prOutputs[i].script), prOutputs[i].value);
                    }
                    console.log("tx.outputs", tx.outputs);

                    let baseAmount = amount * 100;
                    console.log("baseAmount", baseAmount);
                    for (let i = 0; i < sortedTokenUtxos.length; i++) {
                        const utxo = sortedTokenUtxos[i];
                        tx.addCoin(Coin.fromJSON(utxo));
                        coinsUsed.push(utxo);
                        baseAmount -= parseInt(utxo.slp.value);
                        if (baseAmount <= 0)
                            break;
                    }

					// error will lead to general loading screen
                    if (baseAmount > 0)
                        throw new Error('Insufficient token funds in address');

                    const baseChange = parseInt(baseAmount * -1);
                    console.log("baseChange", baseChange);
                    if (baseChange > 0) {
                        tx.outputs[0].script.pushData(U64.fromInt(baseChange).toBE(Buffer)).compile();
                        tx.addOutput(wallet.Path1899.cashAddress, 546);
                        console.log("added change to outputs", tx.outputs);
                    }

                    // sign tx
                    const hashTypes = Script.hashType;
                    const sighashType = hashTypes.ALL | hashTypes.ANYONECANPAY | hashTypes.SIGHASH_FORKID;
                    
                    const buyerKeyring = KeyRing.fromSecret(wallet.Path1899.fundingWif);
					const hex = tx.toRaw().toString('hex')
					console.log("hex", hex);
                    
                    tx.sign(buyerKeyring, sighashType);
                    const additionalSatsNeeded = tx.getMinFee() - tx.getFee();
                    console.log("addtionalSatsNeeded", additionalSatsNeeded);
                    console.log(tx);
                    payment.transactions.push(tx.toRaw());
                    payment.refundTo.push({
                        value: 546,
                        script: Script.fromAddress(wallet.Path1899.cashAddress).toRaw()
                    });
                }

				const msgBuf = bw.render();
				console.log("msgBuf", msgBuf);

				// get signature
				const sigBuf = signMessage(wallet.Path1899.fundingWif, msgBuf);

				payment.setData({
					buyerpubkey: wallet.Path1899.publicKey,
					signature: sigBuf.toString('hex'),
					paymentdata: msgBuf.toString('hex')
				});
				console.log("payment", payment);

				const rawPaymentRes = await fetch("https://lsbx.nmrai.com/v1/pay", {
					method: "POST",
					headers: new Headers({
						'Content-Type': `application/${purchaseOptions.type}-payment`
					}),
					signal: AbortSignal.timeout(20000),
					body: payment.toRaw()
				})

				if (rawPaymentRes.status !== 200) {
					throw new Error(response.text());
				}

				const paymentResArrayBuf = await rawPaymentRes.arrayBuffer();
				const response = Buffer.from(paymentResArrayBuf);

				console.log("response", response);	

				const ack = PaymentACK.fromRaw(response);
				console.log(ack.memo);
				const rawTransactions = ack.payment.transactions;
				const ticketTxs = rawTransactions.map(r => TX.fromRaw(r));
				console.log(ticketTxs.map(tx => tx.toJSON()));

				setTicketIssued(true);

				// put txs in storage
				const paymentTxs = payment.transactions.map(raw => TX.fromRaw(raw));
				await addIssueTxs(ticketTxs, coinsUsed, paymentTxs);

			} 
		} catch (err) {
			console.error(err);
            passLoadingStatus("AN ERROR OCCURED");
            await sleep(3000);
            history.push("/select");
		}
	}, [paymentMetadata, paymentRequest])


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
				history.push('/backup');
            case "auto_declined":
				passLoadingStatus("Your KYC has been declined.");
				await sleep(5000);
				history.push({
					pathname: "/",
					state: {
						kycDeclined: true
					}
				})
                break;
            case "needs_review":
                break;
            }
    }
    const handleKYC = async (e) => {
        e.preventDefault();

        const workflowId = "workflow_a93TCBh";
        const transactionId = wallet.Path1899.publicKey;
        const config = new window.HyperKycConfig(kycAccessToken, workflowId, transactionId); 

        setKycConfig(config);   
        

    }
    const handleEtokenPayment = (e) => {
        e.preventDefault();
        setPaymentMetadata(true);
    }

    useEffect(()=> {
        if (kycConfig) {
            window.HyperKYCModule.launch(kycConfig, handleKYCResult);
        }
    }, [kycConfig])

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
		const type = e.target.type.value;
		const isEtoken = type === "etoken";
		const quantity = e.target.ticketQuantity.value;
		const isNumberInput = /[0-9]/.test(quantity);	
		if (!isNumberInput) {
			setTicketQtyError("Quantity must be a number");
			return;
		} 				

		const sufficientBalance = Number(quantity) <= maxEtokenTicketQuantity;
		if (isEtoken && !sufficientBalance) {
			if (maxEtokenTicketQuantity === 1)
				setTicketQtyError(`You can only afford ${maxEtokenTicketQuantity} Ticket with eToken`);
			else 
				setTicketQtyError(`You can only afford ${maxEtokenTicketQuantity} Tickets with eToken`);
			return;
		} 

		setTicketQtyError(false);
		const newPurchaseOptions = {
			ticketQuantity: quantity,
			type: type
		};
		setPurchaseOptions(newPurchaseOptions);
	}
	const handleSubmitEmail = async (e) => {
		e.preventDefault();

		const emailInput = e.target.email.value;
		const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput);
		if (!isValid) {
			setEmailError(true);
			return;
		}
		const buyerKeyring = KeyRing.fromSecret(wallet.Path1899.fundingWif);

		console.log("email", emailInput);
		console.log("user.access", user.access);
		const msg = Buffer.from(emailInput, 'utf-8');
		const sig = buyerKeyring.sign(SHA256.digest(msg));

		console.log("msg", msg);
		console.log("sig", sig);
		const json = {
			email: emailInput, 
			pubkey: wallet.Path1899.publicKey,
			signature: sig.toString('hex'),			
		};
		console.log("json", json);
		const userRes = await fetch("https://lsbx.nmrai.com/v1/user", {
			method: "POST", 
			mode: "cors",
			headers: new Headers({
				"Content-Type": "application/json"
			}),
			signal: AbortSignal.timeout(20000),
			body: JSON.stringify(json)
		});
		console.log("userRes", userRes);
		// forward based on response
		const userResJson = await userRes.json();
		console.log("userResJson", userResJson);
		if (userRes.status === 200)
			setHasEmail(true);
	}

    const tosTitle = "Purchase Terms";
    const checkoutTitle = "Checkout";
	const quantityOptions = ["1", "2", "5", "10"].map(option => {
		return {
			label: option,
			value: option
		};
	});
	const emailButtonText = "Confirm Email";
	const emailTitle = "Email";

    return (
        <>  							
			<Header background="#FEFFFE" />
            {(!hasAgreed || !hasEmail) ? (
                <> 
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
									onClick={handleAgree}
								>
									{agreeButtonText}
								</PrimaryButton>
							</FooterCtn>
						</>						
					) : (
						<>
							<NavigationBar
								handleOnClick={handleReturn}
								title={emailTitle}
							/>
							<FlexGrow>
								<EmailForm id='email-form' onSubmit={(e) => handleSubmitEmail(e)}>
									{emailError && <ErrorMessage>{emailError}</ErrorMessage>}
									<Input 
										placeholder="Enter your Email"
										name="email"
										type="text"
									/>
									<p>
										<b>Your email is required</b> and is only used to announce results and maintenance updates. <b>We do not send marketing emails.</b>
									</p>                                
								</EmailForm>
							</FlexGrow>
							<FooterCtn>
								<LightFooterBackground />

								<RandomNumbers 
									fixedRandomNumbers={playerNumbers}
								/>
								<PrimaryButton 
									form={"email-form"}
								>
									{emailButtonText}
								</PrimaryButton>
							</FooterCtn>
						</>
					)}
				</>
            ) : (
                <>
                    {!ticketIssued ? (
                        <>
                            {!purchaseOptions ? (
                                <>
                                    <NavigationBar 
                                        handleOnClick={handleReturn}
                                        title={checkoutTitle}
                                        merchantTag={true}
                                    />    

                                    <Scrollable>
                                        <Form id="purchase-options-form" onSubmit={handlePurchaseOptionsSubmit}>
											<PaymentHeader>How  many tickets?</PaymentHeader>
											{ticketQtyError && <ErrorMessage>{ticketQtyError}</ErrorMessage>}
												<CustomCreatableSelect 
													isClearable
													name="ticketQuantity" 
													label="Quantity"
													required
													options={quantityOptions}
													defaultValue={"5"}
													formatCreateLabel={(input) => {
														const isNumberInput = /[0-9]/.test(input);
														if (isNumberInput) 
															return `Purchase ${input} Tickets`
													}}
												/>											
											<InfoText>
												Each ticket result is random and unique, including entry in each of the Jackpots.											
												<a>Learn More</a>
											</InfoText>

											<PaymentHeader>Choose your Payment Option</PaymentHeader>
                                            <select type="select" name="type">
                                                <option value="fiat">Fiat</option>
												{maxEtokenTicketQuantity > 0 && 
	                                                <option value="etoken">eToken</option>
												}
                                            </select>						
                                        </Form>
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
                                    {isStage1 && ( 
                                        <>
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
                                                        quantity={purchaseOptions.ticketQuantity}
                                                    />
                                                    <InfoText>
                                                        To purchase this lottery ticket your numbers and wallet address will be encrypted in the finalized block with all required data to self-mint our potential payout. This game supports the payout.
                                                    </InfoText>
                                                    <PaymentHeader>Payment</PaymentHeader>
                                                    {purchaseOptions.type === "fiat" ? 
                                                        <CustomRadioGroup onChange={handlePaymentChange} value={paymentProcessor}>
                                                            <Radio value={"NMIC"} >Credit Card</Radio>
                                                            {/* <Radio value={"other"} >Other</Radio> */}
                                                        </CustomRadioGroup>        
                                                    : 
                                                        <p>You are paying with eToken.</p>
                                                    }


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
                                                {purchaseOptions.type === "fiat" ? 
                                                    <PrimaryButton 
                                                        type="submit"
                                                        form={`${paymentProcessor}-form`}
                                                    >
                                                        {purchaseButtonText}
                                                    </PrimaryButton>         
                                                : 
                                                    <PrimaryButton onClick={handleEtokenPayment}>
                                                        Pay with eToken
                                                    </PrimaryButton>                               
                                                }
                                            </FooterCtn>
                                        </>              
                                    )}    
                                </>
                            )}      
                        </>  
                    ) : (
                        <FlexGrow>
                            <KycInfo />                       
                            <PrimaryButton onClick={handleKYC}>Continue</PrimaryButton>
                        </FlexGrow>
                    )}
                </>  
            )}
        </>
    );
}

export default Checkout;
