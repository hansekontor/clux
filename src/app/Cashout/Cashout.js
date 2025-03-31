// node modules
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import Select from 'react-select';
import 'react-range-slider-input/dist/style.css';
import { PaymentRequest, Payment, PaymentACK } from  'b70-checkout';
import bio from 'bufio';
import { stringify as uuidStringify } from 'uuid';
import { U64 } from 'n64';
import { TX, MTX, Coin, Script, KeyRing } from '@hansekontor/checkout-components';
import { Modal } from 'antd';

// react components
import { FooterCtn } from '@components/Footer';
import PrimaryButton from '@components/PrimaryButton';
import NavigationBar from '@components/Navigation';
import Header from '@components/Header';
import { QuantityInput } from '@components/Common/Inputs';
import { LargeHeading } from '@components/Common/Text';
import * as S from './components/Styled';

import useWallet from '@hooks/useWallet';

// util
import { WalletContext } from '@utils/context';
import { getWalletState } from '@utils/cashMethods'
import sleep from '@utils/sleep';

const countryOptions = [{value: "US", label: "United States"}];
const currencyOptions = [{value: "USD", label:"USD"}];

const Cashout = ({
    passLoadingStatus
}) => {
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
    const { slpBalancesAndUtxos } = getWalletState(wallet);
    // console.log("slpBalancesAndUtxos", slpBalancesAndUtxos);
    const token = slpBalancesAndUtxos.tokens?.length > 0 ? slpBalancesAndUtxos.tokens[0] : false;
    // console.log("token", token);
    const balance = token ? new BigNumber({...token.balance, _isBigNumber: true}).toNumber() / 100 : 0;
    // console.log("balance", balance);
    const { forceWalletUpdate, addCashout } = useWallet();


    const [stage, setStage] = useState("filter");
    const [tilloOptions, setTilloOptions] = useState(false);
    const [tilloSelection, setTilloSelection] = useState(false);
    const [link, setLink] = useState(false);
    const [brandData, setBrandData] = useState(false);
    const [cardAmount, setCardAmount] = useState(10);
    const [modal, modalHolder] = Modal.useModal();
    

    const history = useHistory();

    // DOM variables
    const title = "Cashout";
    const previousPath = location.state?.returnTo || "/select";    

    // force wallet update on cashout
    useEffect(async () => {
        passLoadingStatus("LOADING WALLET");
        await forceWalletUpdate();
        await sleep(3000);
        passLoadingStatus(false);
    }, []);

    // redirect if insufficent token amount
    useEffect(async () => {
        if (balance < 10) {
            passLoadingStatus("INSUFFICIENT TOKENS IN WALLET");
            await sleep(3000);
            history.push("/select");
        } else {
			passLoadingStatus(false);
		}
    }, [balance]);

    // fetch tillo options
    useEffect(async () => {
        if (!tilloOptions) {
            const response = await fetch("https://lsbx.nmrai.com/v1/cards", {
                method: "GET",
                headers: new Headers({
                    'Content-Type': "application/etoken-paymentrequest"
                }),
                mode: "cors",
                signal: AbortSignal.timeout(20000)
            });

            const availableBrands = await response.json();
            // console.log("availableBrands", availableBrands);

            const possibleBrands = availableBrands.filter(function(brand) {
                const lowerLimit = brand.limits?.lower;
                if (!lowerLimit)
                    return true;
                if (lowerLimit < balance)
                    return true;
            });

            const formattedBrands = possibleBrands.map(brand => {
                brand.label = brand.name;
                brand.value = brand.brand;

                return brand;
            });

            const formattedBrandsWithoutCreditCards = formattedBrands.filter(brand => {
                if (brand.label === "Reward Pass USD")
                    return false;
                else 
                    return true;
            });

            setTilloOptions(formattedBrandsWithoutCreditCards);
            setTilloSelection(formattedBrandsWithoutCreditCards );
        }
    }, [tilloOptions]);

    // handlers
    const handleReturn = () => {
        if (link)
            return handleGiftcardConfirmation()
        else
            history.push(previousPath);
    }    
    // const handleAmountSubmit = (e) => {
    //     e.preventDefault();
    //     const inputAmount = e.target.amount.value;
    //     // todo: later add cashout provider conditional here

    //     setAmount(inputAmount);
    //     setStage("currency");
    // }

    const handleBrandChange = (e) => {
        const selectedBrand = e.value;
        const selectedBrandData = tilloSelection.find(item => item.slug === selectedBrand);

        setBrandData(selectedBrandData);
    }
    const handleSubmitFilters = (e) => {
        e.preventDefault();
        const country = e.target.country.value;
        const currency = e.target.currency.value;
        // console.log("cardAmount", cardAmount, "country", country, "currency", currency);

        // console.log("tillooptions", tilloOptions);
        const newTilloSelection = tilloOptions.filter(brand => brand.countries.includes(country))
            .filter(brand => brand.currency === currency)
            .filter(function(brand) {
                if (!brand.limits) {
                    return true;
                } else {
                    const lowerLimit = brand.limits.lower;
                    const upperLimit = brand.limits.upper;
                    const isInRange = cardAmount >= lowerLimit && cardAmount <= upperLimit;
                    if (isInRange) 
                        return true;
                    else 
                        return false;
                }
            });

            setTilloSelection(newTilloSelection);
        setStage("brand");
    }

    const handleBrandSubmit = async (e) => {
        try {
            e.preventDefault();
            
			passLoadingStatus("REQUESTING GIFTCARD");

            const brand = e.target.brand.value;
            const json = {
                value: String(cardAmount),
                brand, 
            };
            // console.log("cardOptions", json);

            const invoiceRes = await fetch("https://lsbx.nmrai.com/v1/cardreq", {
                method: "POST", 
                mode: "cors",
                body: JSON.stringify(json),
                headers: new Headers({
                    'Content-Type': "application/etoken-paymentrequest"
                }),
                signal: AbortSignal.timeout(20000),
            });
            // console.log("invoiceRes", invoiceRes);

			// add api error handling

            const invoiceArrayBuffer = await invoiceRes.arrayBuffer();
            const invoiceBuf = Buffer.from(invoiceArrayBuffer);
            
            const pr = PaymentRequest.fromRaw(invoiceBuf);
            const prOutputs = pr.paymentDetails.outputs;
            console.log("pr", pr);

			passLoadingStatus("BUILDING TRANSACTION");

            const merchantData = pr.paymentDetails.getData('json');
            // console.log("merchantData", merchantData);
            const paymentDataBuf = Buffer.from(merchantData.paymentdata, 'hex')
            const br = bio.read(paymentDataBuf)
            const id = uuidStringify(br.readBytes(16))
            const amount = br.readU32() / 100
            // console.log({id, amount})
        
            const payment = new Payment({
                memo: pr.paymentDetails.memo
            })
        
            // Get token coins
            const sortedTokenUtxos = slpBalancesAndUtxos.slpUtxos.filter(u => u.slp?.tokenId && ['MINT', 'SEND'].includes(u.slp.type))
            .sort((a, b) => parseInt(a.slp.value) - parseInt(b.slp.value));
        
            const tx = new MTX()
            // Add outputs
            for (let i = 0; i < prOutputs.length; i++) {
                tx.addOutput(Script.fromRaw(prOutputs[i].script), prOutputs[i].value)
            }   

            // Calculate needed coins
            const coinsBurned = []
            let baseAmount = amount * 100
            for (let i = 0; i < sortedTokenUtxos.length; i++) {
                const utxo = sortedTokenUtxos[i]
                tx.addCoin(Coin.fromJSON(utxo))
                coinsBurned.push(utxo);
                baseAmount -= parseInt(utxo.slp.value)
                if (baseAmount <= 0)
                        break
            }

            console.log("baseAmount", baseAmount);
        
            if (baseAmount > 0)
                throw new Error('Insufficient token funds in address')

            const buyerKeyring = KeyRing.fromSecret(wallet.Path1899.fundingWif);
        
            // Add a change output to script if necessary
            const baseChange = parseInt(baseAmount * -1);
            if (baseChange > 0) {
                tx.outputs[0].script.pushData(U64.fromInt(baseChange).toBE(Buffer)).compile();
                tx.addOutput(buyerKeyring.getAddress(), 546)
            }

            // Sign tx
            const hashTypes = Script.hashType;
            const sighashType = hashTypes.ALL | hashTypes.ANYONECANPAY | hashTypes.SIGHASH_FORKID;
            tx.sign(buyerKeyring, sighashType)
            
            payment.transactions.push(tx.toRaw())
            payment.refundTo.push({
                value: 546,
                script: Script.fromAddress(buyerKeyring.getAddress('string')).toRaw()
            })
        
            const sig = buyerKeyring.sign(paymentDataBuf)
        
            payment.setData({
                ...merchantData,
                buyerpubkey: buyerKeyring.getPublicKey('hex'),
                signature: sig.toString('hex')
            })
        
			const rawPaymentRes = await fetch("https://lsbx.nmrai.com/v1/cardpay", {
				method: "POST",
				signal: AbortSignal.timeout(20000),
				headers: new Headers({
					'Content-Type': `application/etoken-payment`
				}),
				body: payment.toRaw()
			})
			console.log("rawPaymentRes", rawPaymentRes);
            if (rawPaymentRes.status !== 200)
                throw new Error(rawPaymentRes.statusText)

			const paymentResArrayBuf = await rawPaymentRes.arrayBuffer();
            const response = Buffer.from(paymentResArrayBuf);
                    
            const ack = PaymentACK.fromRaw(response);
        
            // console.log("ack.payment", ack.payment.getData('json'))
            // console.log("ack.memo", ack.memo)
        
            const rawTransactions = ack.payment.transactions;
            const txs = rawTransactions.map(r => TX.fromRaw(r));
            // console.log(txs)

            // remove utxos locally
            await addCashout(txs, coinsBurned);

            setLink(ack.payment.getData('json').payout.result.url);
            setStage("giftcard");
			passLoadingStatus(false);
        } catch(err) {
            console.error(err);
        }
    }

    const minAmount = 10;
    const maxAmount = balance - (balance % 10);

    console.log("min", minAmount, "max", maxAmount);

    const handleCardAmountChange = (range) => {
        const newCardAmount = range[1];
        setCardAmount(newCardAmount);
    } 
    const handleGiftcardConfirmation = (e) => {
        if (e)
            e.preventDefault();
        // add modal asking for confirmation
        const modalConfig = {
            title: "Confirm",
            content: "Have you claimed your giftcard?",
            okText: "Yes",
            cancelText: "No",
            onOk: () => handleBackToHome(),
        };
        modal.confirm(modalConfig);
    }
    const handleBackToHome = () => {
        history.push("/select");
    }

    return (            
        <>
            {modalHolder}
            <S.FlexGrow>
                <Header />
                <NavigationBar 
                    handleOnClick={handleReturn}
                    title={title}                              
                />
                    {stage === "filter" && 
                        <S.Form id={`${stage}-form`} onSubmit={handleSubmitFilters}>
                            <LargeHeading>How many Tokens?</LargeHeading>
                            <QuantityInput 
                                quantity={cardAmount}
                                passQuantity={setCardAmount}
                                step={10}
                                max={maxAmount}
                            />                   
                            <Select 
                                options={currencyOptions} 
                                label="Currency"
                                name="currency"
                                required
                            />                            
                            <Select 
                                options={countryOptions} 
                                label="Country"
                                name="country"
                                required
                            />
                        </S.Form>
                    }         

                    {stage === "brand" && 
                        <S.Form id={`${stage}-form`}
                            onSubmit={handleBrandSubmit}
                        >
                            <Select 
                                options={tilloSelection}
                                onChange={handleBrandChange}
                                name="brand"
                            />                        
                        
                            {brandData && (
                                <p>
                                    {brandData.description}
                                </p>
                            )}


                        </S.Form>
                    }

                    {stage === "giftcard" &&
                        <S.Form id={`${stage}-form`} onSubmit={handleGiftcardConfirmation}>
                            <S.Link href={link} target="_blank">
                                "Claim your Giftcard"
                            </S.Link>
                        </S.Form>
                    }

                    <FooterCtn>
                        <PrimaryButton type="submit" form={`${stage}-form`}>
                            {stage === "filter" && 
                                <>Go to Brands</>
                            }
                            {stage === "brand" && 
                                <>Get Giftcard</>
                            }
                            {stage === "giftcard" &&
                                <>Back to Home</>
                            }
                        </PrimaryButton>
                    </FooterCtn>    
            </S.FlexGrow>           
        </>
    )
}

export default Cashout;
