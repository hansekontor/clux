// @ts-check
import { useHistory } from 'react-router-dom';
import { Payment, PaymentRequest, PaymentACK } from 'b70-checkout';
import bio from 'bufio';
import { stringify as uuidStringify } from 'uuid';
import { KeyRing, TX, MTX, bcrypto, Script, Coin } from '@hansekontor/checkout-components';
import { U64 } from 'n64';
import signMessage from '../utils/signMessage';
import { useApp } from '../../App';
import sleep from '../../../utils/sleep';
import { useNotifications } from '../../Notifications';
import { useCashTab } from '../../CashTab';
import { useEffect } from 'react';

export default function usePayment({
    authPayment,
    ticketQuantity,
    paymentProcessor,
    paymentMetadata,
    paymentRequest,
    slpBalancesAndUtxos,
    setPaymentRequest,
    setTicketIssued,
    setAuthPayment,
    ticketIssued,
    isKYCed,
    setKycAccessToken,
    setShowKyc,
    setPaymentMetadata,
    maxEtokenTicketQuantity,
    setTicketQtyError,
    setShowPaymentForm,
    setTicketsToRedeem
}) {
    const { wallet, addIssueTxs } = useCashTab();
    const { playerNumbers, setLoadingStatus } = useApp();
    const notify = useNotifications();
    const history = useHistory();

    // finalize payment with paymentMetadata (payment token)
    useEffect(() => {
        (async () => {
            try {
                if (paymentMetadata && paymentRequest && !ticketIssued) {
                    setLoadingStatus("PROCESSING");
                    const type = paymentProcessor === "etoken" ? paymentProcessor : "fiat";
                    const authonly = type === "fiat" && !isKYCed;
                    console.log("authonly", authonly);
                    const { payment, kycToken, coinsUsed } = await buildPayment(
                        type,
                        authonly
                    );
                    console.log("init payment", payment.toRaw().toString("hex"))
                    setKycAccessToken(kycToken);
                    // setLoadingStatus(false);
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
                        setLoadingStatus(false);
                    } else {
                        const paymentResArrayBuf = await rawPaymentRes.arrayBuffer();
                        const response = Buffer.from(paymentResArrayBuf);

                        const ack = PaymentACK.fromRaw(response, null);
                        console.log(ack.memo);
                        const rawTransactions = ack.payment.transactions;
                        const ticketTxs = rawTransactions.map(r => TX.fromRaw(r, null));
                        console.log(ticketTxs.map(tx => tx.toJSON()));

                        setTicketIssued(true);

                        // put txs in storage
                        const paymentTxs = payment.transactions.map(raw => TX.fromRaw(raw, null));
                        const parsedTickets = await addIssueTxs(ticketTxs, coinsUsed, paymentTxs);
                        console.log("parsedTickets", parsedTickets);
                        setTicketsToRedeem(parsedTickets);

                        // wait until ticket has been added to storage
                        await sleep(5000);

                        // pass hash for waiting room to find parsed ticket in storage
                        history.push("/waitingroom");
                    }
                }
            } catch (err) {
                console.error(err);
                setLoadingStatus("AN ERROR OCCURED");
                await sleep(3000);
                history.push("/select");
            }
        })();
    }, [paymentMetadata, paymentRequest])

    // initialize payment request
    const getPaymentRequest = async () => {
        console.log("get invoice for qnt", ticketQuantity);
        const res = await fetch("https://lsbx.nmrai.com/v1/invoice", {
            method: "POST",
            headers: new Headers({
                'Accept': "application/etoken-paymentrequest",
                'Content-Type': "application/json"
            }),
            mode: "cors",
            signal: AbortSignal.timeout(20000),
            body: JSON.stringify({
                quantity: ticketQuantity
            }),
        });
        // console.log("res", res);
        const invoiceRes = await res.arrayBuffer();
        const invoiceBuf = Buffer.from(invoiceRes);

        const pr = PaymentRequest.fromRaw(invoiceBuf, null);

        console.log("pr", pr);
        setPaymentRequest(pr);
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
        console.log({ id, amount });

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
            bw.writeVarString(paymentMetadata, null);
        } else {
            // get token coins
            const sortedTokenUtxos = slpBalancesAndUtxos.slpUtxos.filter(u => u.slp?.tokenId && ['MINT', 'SEND'].includes(u.slp.type))
                .sort((a, b) => parseInt(a.slp.value) - parseInt(b.slp.value));
            console.log("sortedTokenUtxos", sortedTokenUtxos);

            // construct tx
            // @ts-ignore
            const tx = new MTX();
            const prOutputs = paymentRequest.paymentDetails.outputs;
            for (let i = 0; i < prOutputs.length; i++) {
                tx.addOutput(Script.fromRaw(prOutputs[i].script, null), prOutputs[i].value);
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

            const baseChange = parseInt((baseAmount * -1).toString());
            console.log("baseChange", baseChange);
            if (baseChange > 0) {
                // @ts-ignore
                tx.outputs[0].script.pushData(U64.fromInt(baseChange).toBE(Buffer)).compile();
                tx.addOutput(wallet.Path1899.cashAddress, 546);
                console.log("added change to outputs", tx.outputs);
            }

            // sign tx
            const hashTypes = Script.hashType;
            const sighashType = hashTypes.ALL | hashTypes.ANYONECANPAY | hashTypes.SIGHASH_FORKID;

            const buyerKeyring = KeyRing.fromSecret(wallet.Path1899.fundingWif, null);
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
        }, null);

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
                    const msg = await rawPaymentRes.text();
                    throw new Error(msg);
                }
            }

            console.log("response", response);

            if (!response) {
                throw new Error('Response is undefined');
            }
            const ack = PaymentACK.fromRaw(response, null);
            console.log(ack.memo);
            const rawTransactions = ack.payment.transactions;
            const ticketTxs = rawTransactions.map(r => TX.fromRaw(r, null));
            console.log(ticketTxs.map(tx => tx.toJSON()));

            setTicketIssued(true);
            notify({ type: 'success', message: 'Successful Purchase' });

            // put txs in storage
            const capturedPayment = Payment.fromRaw(authPayment.rawPayment, null);
            const paymentTxs = capturedPayment.transactions.map(raw => TX.fromRaw(raw, null));
            const parsedTicketTxs = await addIssueTxs(ticketTxs, authPayment.coinsUsed, paymentTxs);
            setTicketsToRedeem(parsedTicketTxs);

            await sleep(5000);

            history.push('/waitingroom');

        } catch (err) {
            console.error(err);
            notify({ message: "AN ERROR OCCURED", type: "error" });
            await sleep(2000);
            // return repeatOnboarding();
            history.push('/select');
        }
    }

    const initiatePayment = (e) => {
        console.log("handleSubmit()")
        e.preventDefault();

        // @ts-ignore
        if (window.CollectJS) {
            // @ts-ignore
            window.CollectJS.startPaymentRequest();
        } else
            console.error("CollectJS unavailable")
    }

    const handleEtokenPayment = async (e) => {
        if (e)
            e.preventDefault();
        setLoadingStatus("BUILDING TRANSACTION");
        await sleep(1000);
        setPaymentMetadata(true);
    }

    const handleNmiResult = async (result) => {
        console.log("payment token", result.token);
        const paymentMetadata = result.token;
        setPaymentMetadata(paymentMetadata);
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
            setLoadingStatus("LOADING KYC");
            setShowKyc(true);
            // return handleEtokenPayment();
        } else if (isEtoken)
            return handleEtokenPayment();
    }

    return {
        getPaymentRequest,
        buildPayment,
        sendPayment,
        capturePayment,
        initiatePayment,
        handleEtokenPayment,
        handleNmiResult,
        handleConfirmation
    }
}