// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import bio from 'bufio';
import { U64 } from 'n64';
import { stringify as uuidStringify } from 'uuid';
import {
	Payment, 
	PaymentRequest, 
	PaymentACK
} from 'b70-checkout';
import {
	KeyRing, 
	TX, 
    MTX,
    bcrypto,
    Script,
    Coin
} from '@hansekontor/checkout-components';
const { SHA256 } = bcrypto;
import BigNumber from 'bignumber.js';

// custom react components

import Header from '@components/Common/Header';
import NavigationBar from '@components/Common/Navigation';
import Tos from '@components/Checkout/Tos'
import KycInfo from '@components/Checkout/KycInfo';
import Ticket from '@components/Checkout/Ticket';
import RandomNumbers from '@components/Common/RandomNumbers';
import { FooterCtn } from '@components/Common/Footer';
import PrimaryButton from '@components/Common/PrimaryButton';
import { CardIconBox } from '@components/Common/Icons';
import { successNotification, errorNotification } from '@components/Common/Notifications';
import { NmiCheckoutForm, WidgetBody } from './Processors';
import { Input, QuantityInput, QuantitySuggestions } from '@components/Common/Inputs';
import { Paragraph, LargeHeading } from '@components/Common/Text';
import { Column, Overlay } from '@components/Common/Container';
import { RollUp } from '@components/Common/CssAnimations';
import * as S from './Styled';

// utils & hooks
import useWallet from '@hooks/useWallet';
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'

const allowedCountries = ["AllowedCountry"];
const ticketPrice = 10;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const signMessage = (secret, msg) => {
	const keyring = KeyRing.fromSecret(secret);
	const sig = keyring.sign(msg);
	
	return sig;
}


const Checkout = ({
    passLoadingStatus,
    playerNumbers,
	user
}) => {
    const history = useHistory(); 

    // find ticket indicator
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const { tickets, slpBalancesAndUtxos } = getWalletState(wallet);
	const { forceWalletUpdate, addIssueTxs } = useWallet();
	const token = slpBalancesAndUtxos.tokens ? slpBalancesAndUtxos.tokens[0] : false;
	let maxEtokenTicketQuantity = 0; 
	if (token) {
		const balance = (new BigNumber({...token.balance, _isBigNumber: true}).toNumber()) / 100;
		maxEtokenTicketQuantity = Math.floor(balance / ticketPrice);
	}

    // states
    const [isFirstRendering, setFirstRendering] = useState(true);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [ticketIssued, setTicketIssued] = useState(false);
    const [paymentProcessor, setPaymentProcessor] = useState("NMIC");
    const [isKYCed, setIsKYCed] = useState(false);
    const [kycConfig, setKycConfig] = useState(false);
	const [paymentRequest, setPaymentRequest] = useState(false);
	const [paymentMetadata, setPaymentMetadata] = useState(false);
	const [ticketQuantity, setTicketQuantity] = useState(1);
	const [showPaymentForm, setShowPaymentForm] = useState(false);
	const [ticketQtyError, setTicketQtyError] = useState(false);
	const [kycAccessToken, setKycAccessToken] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [countryError, setCountryError] = useState(false);
	const [hasEmail, setHasEmail] = useState(false);
	const [showKyc, setShowKyc] = useState(false);
	const [authPayment, setAuthPayment] = useState(false);
	const [kycCancelCount, setKycCancelCount] = useState(0);

    if (!playerNumbers) {
        passLoadingStatus("PLAYER NUMBERS ARE MISSING");
        history.push("/select");
    }

	useEffect(async () => {
		console.log("CHECKOUT user", user);
		if (user && !user.ipGeo.ticketPurchase) {
			passLoadingStatus("ACCESS DENIED");
			await sleep(2000);
			history.push("/select");
		}
	}, [user])

	// skip email/kyc prompt if email already available
	useEffect(async () => {
		if (user.email) 
			setHasEmail(true);

		if (user.kyc_status?.includes("approved") || tickets.length > 0) {
			setIsKYCed(true);
		} else if (user.kyc_status === "needs_review") {
			passLoadingStatus("KYC NEEDS REVIEW")
			return repeatOnboarding();
		} else if (user.kyc_status?.includes("declined")) {
			// user usually should not get here in this case
			passLoadingStatus("ACCESS DENIED")
			return repeatOnboarding();
		}

	}, [user])

	// finalize payment with paymentMetadata (payment token)
	useEffect(async () => {	
		try {
			if (paymentMetadata && paymentRequest && !ticketIssued) {
				passLoadingStatus("PROCESSING");
				const type = paymentProcessor === "etoken" ? paymentProcessor : "fiat";
				const authonly = type === "fiat" && !isKYCed;
				console.log("authonly", authonly);
				const { payment, kycToken, coinsUsed } = await buildPayment(
					type, 
					authonly
				);
				console.log("init payment", payment.toRaw().toString("hex"))
				setKycAccessToken(kycToken);
				// passLoadingStatus(false);
				const rawPaymentRes = await fetch("https://lsbx.nmrai.com/v1/pay", {
					method: "POST",
					headers: new Headers({
						'Content-Type': `application/${type}-payment`
					}),
					signal: AbortSignal.timeout(20000),
					body: payment.toRaw()
				});

				if (rawPaymentRes.status !== 200) {
					const message = await rawPaymentRes.text();
					throw new Error(message);
				}

				if (type === "fiat" && authonly) {
					const response = await rawPaymentRes.json();
					console.log("auth res", response);
					setAuthPayment({
						rawPayment: payment.toRaw(),
						coinsUsed
					});
					setShowKyc(true);		
					passLoadingStatus(false);
				} else {
					const paymentResArrayBuf = await rawPaymentRes.arrayBuffer();
					const response = Buffer.from(paymentResArrayBuf);
					
					const ack = PaymentACK.fromRaw(response);
					console.log(ack.memo);
					const rawTransactions = ack.payment.transactions;
					const ticketTxs = rawTransactions.map(r => TX.fromRaw(r));
					console.log(ticketTxs.map(tx => tx.toJSON()));
	
					setTicketIssued(true);
	
					// put txs in storage
					const paymentTxs = payment.transactions.map(raw => TX.fromRaw(raw));
					await addIssueTxs(ticketTxs, coinsUsed, paymentTxs);

					history.push("/waitingroom");
				}		
			} 
		} catch (err) {
			console.error(err);
            passLoadingStatus("AN ERROR OCCURED");
            await sleep(3000);
            history.push("/select");
		}
	}, [paymentMetadata, paymentRequest])

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
	// initialize payment request
	const getPaymentRequest = async () => {
		console.log("get invoice for qnt", ticketQuantity);
		const res = await fetch("https://lsbx.nmrai.com/v1/invoice", {
			method: "POST", 
			headers: new Headers({
				'Accept': "application/etoken-paymentrequest",
				'Content-Type': "application/json"}),
			mode: "cors",
			signal: AbortSignal.timeout(20000),
			body: JSON.stringify({
				quantity: ticketQuantity
			}),
		});
		// console.log("res", res);
		const invoiceRes = await res.arrayBuffer();
		const invoiceBuf = Buffer.from(invoiceRes);

		const pr = PaymentRequest.fromRaw(invoiceBuf);

		console.log("pr", pr);
		setPaymentRequest(pr);		
	};

	const repeatOnboarding = () => {
		return history.push({
			pathname: "/",
			state: {
				repeatOnboarding: true
			}
		})
	};

	const buildPayment = async (
		type,
		authonly,
	) => {
		// get message to sign
		const merchantData = paymentRequest.paymentDetails.getData('json');
		console.log("merchant data", merchantData);
		const paymentDataBuf = Buffer.from(merchantData.paymentdata, 'hex');
		const br = bio.read(paymentDataBuf);
		const id = uuidStringify(br.readBytes(16));
		const amount = br.readU32() / 100;
		console.log({id, amount});

		const kycToken = merchantData.kyctoken;

		const bw = bio.write();
		bw.writeBytes(paymentDataBuf)
		const playerNumbersBuf = Buffer.from(playerNumbers, 'hex');
		bw.writeBytes(playerNumbersBuf);
		const payment = new Payment({
			memo: paymentRequest.paymentDetails.memo,
		});

		const coinsUsed = [];
		if (type === "fiat") {
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
			authonly: authonly,
			buyerpubkey: wallet.Path1899.publicKey,
			signature: sigBuf.toString('hex'),
			paymentdata: msgBuf.toString('hex')
		});

		return { payment, kycToken, coinsUsed };
	}
	const sendPayment = async (rawPayment) => {
		const rawResponse = await fetch("https://lsbx.nmrai.com/v1/pay", {
			method: "POST",
			headers: new Headers({
				'Content-Type': `application/fiat-payment`
			}),
			signal: AbortSignal.timeout(20000),
			body: rawPayment
		});

		return rawResponse;
	}
	const capturePayment = async () => {
		try {		
			await sleep(8000);

			let response;
			for (let retries = 0; retries < 3; retries++) {
				console.log("capture payment attempt", retries);
				const rawPaymentRes = await sendPayment(authPayment.rawPayment);

				if (rawPaymentRes.status == 200) {
					const paymentResArrayBuf = await rawPaymentRes.arrayBuffer();
					response = Buffer.from(paymentResArrayBuf);			
					break;			
				} else if (rawPaymentRes.status == 400) {
					const msg = await rawPaymentRes.text();
					console.log("msg", msg);			
					console.log("rawPaymentRes", rawPaymentRes);

					if (retries < 2) {
						// retry 3 times in total
						await sleep(3000)
						continue;
					} else {
						// too many retries
						throw new Error(msg);
					}
				} else {
					throw new Error(msg);
				}
			}		
			
			console.log("response", response);	

			const ack = PaymentACK.fromRaw(response);
			console.log(ack.memo);
			const rawTransactions = ack.payment.transactions;
			const ticketTxs = rawTransactions.map(r => TX.fromRaw(r));
			console.log(ticketTxs.map(tx => tx.toJSON()));

			setTicketIssued(true);
			successNotification("Successful Purchase");

			// put txs in storage
			const capturedPayment = Payment.fromRaw(authPayment.rawPayment);
			const paymentTxs = capturedPayment.transactions.map(raw => TX.fromRaw(raw));
			await addIssueTxs(ticketTxs, authPayment.coinsUsed, paymentTxs);

			history.push('/backup');

		} catch(err) {
			console.error(err);
			passLoadingStatus("AN ERROR OCCURED");
			await sleep(2000);
			return repeatOnboarding();	
		}
	}
	const setKycResult = async () => {
		try {
			await sleep(8000);
			for (let retries = 0; retries < 2; retries++) {
				console.log("set kyc result, attempt", retries)
				const rawPaymentRes = await sendPayment(authPayment.rawPayment);

				if (rawPaymentRes.status == 400) {
					const msg = await rawPaymentRes.text();
					console.log("msg", msg);			

					// status 400 and db confirmation: repeat onboarding
					if (msg?.includes("Invalid") || msg?.includes("review") || msg?.includes("error"));
						return repeatOnboarding();		

					if (msg?.includes("cancelled")) {
						passLoadingStatus(false);
						return;
					}

					if (retries < 1) {
						await sleep(3000)
						continue;
					} else {
						// too many retries
						throw new Error(msg);
					}
				}
			}
		} catch(err) {
			console.error(err);
			passLoadingStatus("AN ERROR OCCURED");
			await sleep(2000);
			return repeatOnboarding();	
		}
	}
    // handle user agreement with terms of service
    const handleAgree = async (e) => {
        e.preventDefault();
        setHasAgreed(true);
        await sleep(500);
        setFirstRendering(false);
    }
    const handleKYCResult = async (result) => {
        console.log("KYC", result.status);
		const isFiat = paymentProcessor !== "etoken";
		console.log("isFiat", isFiat);
        switch (result.status) {

            // ----Incomplete workflow-----
            case "user_cancelled":
				if (kycCancelCount == 0 && !user.kyc_status?.includes("cancelled")) {
					console.log("increase counter")
					errorNotification("KYC was cancelled, try again");					
					setKycCancelCount(1);
					break;
				} else {
					passLoadingStatus("KYC WAS CANCELLED AGAIN");
					await sleep(2000);
					history.push("/select");
				}
            case "error":
				passLoadingStatus("A KYC ERROR OCCURED");
				return setKycResult();

            // ----Complete workflow-----
            case "auto_approved":
				if (isFiat) {
					passLoadingStatus("CAPTURE PAYMENT")
					return capturePayment();
				} else {
					setShowKyc(false);
					break;
				}
            case "auto_declined":
				passLoadingStatus("INVALID KYC");
				if (isFiat) 
					return setKycResult();
				else 
					return repeatOnboarding();
            case "needs_review":
				passLoadingStatus("KYC NEEDS REVIEW")
				return setKycResult();
        }
    }
    const handleKYC = async (e) => {
        e.preventDefault();

        const workflowId = "workflow_a93TCBh";
        const transactionId = wallet.Path1899.publicKey;
        const config = new window.HyperKycConfig(kycAccessToken, workflowId, transactionId); 

        setKycConfig(config);
    }
    const handleEtokenPayment = async (e) => {
		if (e)
	        e.preventDefault();
		passLoadingStatus("BUILDING TRANSACTION");
		await sleep(1000);
        setPaymentMetadata(true);
    }
    const handleReturn = () => {
        const previousPath = "/select";
        history.push(previousPath);
    }

	const handleConfirmation = async () => {
		// verify quantity input
		const isNumberInput = /[0-9]/.test(ticketQuantity);	
		if (!isNumberInput) {
			setTicketQtyError("Quantity must be a number");
			return;
		} 		

		// verify sufficient balance
		const isEtoken = paymentProcessor === "etoken";
		const sufficientBalance = Number(ticketQuantity) <= maxEtokenTicketQuantity;		
		if (isEtoken && !sufficientBalance) {
			if (maxEtokenTicketQuantity === 1)
				setTicketQtyError(`You can only afford ${maxEtokenTicketQuantity} Ticket with eToken`);
			else 
				setTicketQtyError(`You can only afford ${maxEtokenTicketQuantity} Tickets with eToken`);
			return;
		} 
		setTicketQtyError(false);

		await getPaymentRequest();

		if (!isEtoken)
			setShowPaymentForm(true);

		// kyc the user if first payment is with etoken
		if (isEtoken && !isKYCed) {
			passLoadingStatus("LOADING KYC");
			setShowKyc(true);
			// return handleEtokenPayment();
		} else if (isEtoken)
			return handleEtokenPayment();	
	}

	const handleSubmitEmail = async (e) => {
		console.log("handleSubmitEmail called");
		e.preventDefault();

		const emailInput = e.target.email.value;
		const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput);
		if (!isValidEmail) {
			setEmailError("Invalid Email");
		}		
		
		const countryInput = e.target.country.value;
		const isValidCountry = allowedCountries.includes(countryInput);
		if (!isValidCountry) {
			setCountryError(`Clux is unavailable in ${countryInput}`);
		}

		if (!isValidEmail || !isValidCountry)
			return; 

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

	const handlePaymentMethod = (method) => {
		setPaymentProcessor(method);
	}

	// dom variables
    const tosTitle = "Purchase Terms";
    const checkoutTitle = "Checkout";
	const emailButtonText = "Continue";
	const accountTitle = "Create Account";
	const isStage1 = !(hasAgreed && hasEmail);
	const fiatPurchaseButtonText = "Pay";
	const countryOptions = ["AllowedCountry", "ForbiddenCountry"].map(option => {
		return {
			label: option,
			value: option
		};
	});
    const agreeButtonText = "Agree and Continue";


    return (
        <>  							
            {isStage1 ? (
                <> 
					{!hasAgreed ? (
						<>            
							<Header />
							<NavigationBar 
								handleOnClick={handleReturn}
								title={tosTitle}
							/>
							<Tos />
							<FooterCtn>
								<S.PrimaryFooterBackground />

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
							<Header />
							<NavigationBar
								handleOnClick={handleReturn}
								title={accountTitle}
							/>
							<S.PrimaryFlexGrow>
								<S.AccountForm id='email-form' onSubmit={(e) => handleSubmitEmail(e)}>
									
									<S.FormSection>
										<S.Item>
											<LargeHeading>Create Your Account</LargeHeading>
										</S.Item>
										<S.Item>
											<Paragraph>
												Please enter your details to create an account.
											</Paragraph>
										</S.Item>
									</S.FormSection>
									
									<S.FormSection>
										<S.Label>Email</S.Label>
										<Input 
											placeholder="your@email.com"
											name="email"
											type="text"
											required
										/>
										{emailError && <S.ErrorMessage>{emailError}</S.ErrorMessage>}
										<S.Item>
											<Paragraph>Your email is required and is only used to announce results. No marketing emails.</Paragraph>
										</S.Item>										
									</S.FormSection>
									<S.FormSection>
										<S.Label>Country</S.Label>
										<S.Item>
											<Paragraph>Select the country of your government-issued ID.</Paragraph>
										</S.Item>
										<S.WideCreatableSelect 
											isClearable
											name="country" 
											required
											options={countryOptions}
											placeholder={"Select your country"}
											styles={S.selectStyle}
										/>	
										{countryError && <S.ErrorMessage>{countryError}</S.ErrorMessage>}
									</S.FormSection>

									<S.Divider />
									
									<S.CheckboxItem>
										<S.CustomCheckbox required />
										<S.CheckboxText>I confirm that I am at least 18 years old</S.CheckboxText>
									</S.CheckboxItem>
									<S.CheckboxItem>
										<S.CustomCheckbox required />
										<S.CheckboxText>I understand a government ID will be required for purchase and I will be verified during KYC</S.CheckboxText>
									</S.CheckboxItem>
									<S.CheckboxItem>
										<S.CustomCheckbox required />
										<S.CheckboxText>I agree to the Purchase Terms, Privacy Policy and Terms of Service</S.CheckboxText>
									</S.CheckboxItem>										

								</S.AccountForm>
							</S.PrimaryFlexGrow>
							<FooterCtn>
								<S.PrimaryFooterBackground />
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
					{showKyc ? (
						<>
							<Header />
							<S.SecondaryFlexGrow>
								<KycInfo />                       
								<PrimaryButton onClick={handleKYC}>Continue</PrimaryButton>
							</S.SecondaryFlexGrow>		
						</>
					) : (
						<>
							<NavigationBar 
								handleOnClick={handleReturn}
								title={checkoutTitle}
								merchantTag={true}
							/>    

							<S.PrimaryFlexGrow>
								<Ticket 
									numbers={playerNumbers}
									background={'#EAEAEA'}
									quantity={ticketQuantity}
								/>								
									
								<S.AccountForm id="purchase-options-form">
									<S.Item>
										<LargeHeading>How  many tickets?</LargeHeading>
									</S.Item>
									<S.Item>
										<Paragraph>
											Each ticket result is random and unique, including entry in each of the Jackpots.											
										</Paragraph>											
									</S.Item>

									<QuantityInput
										quantity={ticketQuantity}
										passQuantity={setTicketQuantity}
									/>
									<QuantitySuggestions
										passQuantity={setTicketQuantity}
									/>
									{ticketQtyError && <S.ErrorMessage>{ticketQtyError}</S.ErrorMessage>}

									<Column>
										<S.Item>
											<LargeHeading>Payment Method</LargeHeading>
											<CardIconBox />
										</S.Item>
										<S.PaymentMethod 
											onClick={() => handlePaymentMethod("NMIC")}
											$active={paymentProcessor === "NMIC"}	
										>Credit Card</S.PaymentMethod>
										{maxEtokenTicketQuantity >= ticketQuantity &&
											<S.PaymentMethod 
												onClick={() => handlePaymentMethod("etoken")}
												$active={paymentProcessor === "etoken"}
											>eToken</S.PaymentMethod>
										}	
										<S.Item>
											<LargeHeading>Total</LargeHeading>
											<S.Price>${ticketQuantity * ticketPrice}</S.Price>
										</S.Item>									
									</Column>
								</S.AccountForm>
							</S.PrimaryFlexGrow>

							<FooterCtn>
								<S.SecondaryFooterBackground />
								<PrimaryButton onClick={handleConfirmation}>
									Pay
								</PrimaryButton>
							</FooterCtn>								
							
							{showPaymentForm && (
								<Overlay onClick={() => setShowPaymentForm(false)}>
									<RollUp onClick={(e) => e.stopPropagation()} $animate={showPaymentForm}>
										<WidgetBody>
											<NmiCheckoutForm 
												passMetadata={setPaymentMetadata}	
												amount={ticketPrice * ticketQuantity}
											/>				
											<PrimaryButton 
												type="submit"
												form={`${paymentProcessor}-form`}
											>
												{fiatPurchaseButtonText}
											</PrimaryButton>						
										</WidgetBody>										
									</RollUp>
								</Overlay>
							)}	
						</>
					)}

				</>              
			)}    
        </>
    );
}

export default Checkout;
