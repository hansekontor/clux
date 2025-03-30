import BigNumber from 'bignumber.js';
import {
    currency,
    isCashtabOutput,
    extractCashtabMessage,
    extractExternalMessage,
} from '@utils/ticker';
import {
    toSmallestDenomination,
    fromSmallestDenomination,
    isValidStoredWallet,
    convertToEcashPrefix,
} from '@utils/cashMethods';
import { postPayment } from '@utils/bip70';
import TXUtil from '@utils/txutil';
import cashaddr from 'ecashaddrjs';
import { U64 } from 'n64';
import { 
    Address,
    Input,
    Output,
    Outpoint,
    Coin, 
    MTX,
    TX,
    KeyRing,
    Script,
    Opcode,
    utils,
    script, 
    bcrypto,
	b70,
} from '@hansekontor/checkout-components';
const { Hash160 } = bcrypto;
import { read } from 'bufio';
import bcurl from 'bcurl';

const { 
    SLP,
    common: { opcodes }
} = script;

export default function useBCH() {
    const SEND_BCH_ERRORS = {
        INSUFFICIENT_FUNDS: 0,
        NETWORK_ERROR: 1,
        INSUFFICIENT_PRIORITY: 66, // ~insufficient fee
        DOUBLE_SPENDING: 18,
        MAX_UNCONFIRMED_TXS: 64,
    };

    const POSTAGE_URL = `${currency.postageUrl}?currency=${currency.tokenPrefixes[0]}`;

    const getPostage = async (tokenId) => {
        try {
            const res = await fetch(POSTAGE_URL);
            const postageObj = await res.json();
            const stamp = postageObj.stamps.find(
                s => s.tokenId === tokenId
            );
            if (stamp) {
                return {
                    address: postageObj.address,
                    weight: postageObj.weight,
                    stamp
                };
            }
        } catch (err) {
            console.error(err);
        }
        return null;
    };

    const calculatePostage = (
        inputCount, 
        tokenRecipientCount, 
        postageObj
    ) => {
        const sendAmountArray = ['1', '1']; // Begin with stamp output and change
        for (let i = 0; i < tokenRecipientCount; i++) {
            sendAmountArray.push('1');
        }

        const sendOpReturn = buildSendOpReturn(
            Buffer.alloc(32).toString('hex'),
            sendAmountArray
        )
        let byteCount = getByteCount(
            { P2PKH: inputCount },
            { P2PKH: sendAmountArray.length }
        );

        byteCount += 8 + 1 + sendOpReturn.length;
        // Account for difference in inputs and outputs
        byteCount += 546 * (sendAmountArray.length - inputCount);
  
        let stampsNeeded = Math.ceil(byteCount / postageObj.weight);
        // console.log('byteCount', byteCount);
        // console.log('stampsNeeded', stampsNeeded);
        if (stampsNeeded < 1) stampsNeeded = 1;
        return postageObj.stamp.rate * stampsNeeded;
    }

    const getBcashRestUrl = () => {
        return process.env.REACT_APP_BCASH_API;
    }

    const parseTxData = (wallet, txData) => {
        /*
        Desired output
        [
        {
        txid: '',
        type: send, receive
        receivingAddress: '',
        quantity: amount bcha
        token: true/false
        tokenInfo: {
            tokenId:
            tokenQty:
            txType: mint, send, other
        }
        opReturnMessage: 'message extracted from asm' or ''
        }
        ]
        */
        const ownAddressArray = [
            wallet.Path245.cashAddress,
            wallet.Path145.cashAddress,
            wallet.Path1899.cashAddress
        ];

        const parsedTxHistory = [];
        for (let i = 0; i < txData.length; i += 1) {
            const tx = txData[i];

            const parsedTx = {};

            // Move over info that does not need to be calculated
            parsedTx.txid = tx.hash;
            parsedTx.height = tx.height;
            const destinationOutput = tx.outputs.find(output => output.address)
            const destinationAddress = destinationOutput?.address;

            // If this tx had too many inputs to be parsed skip it
            // When this occurs, the tx will only have txid and height
            // So, it will not have 'vin'
            if (!Object.keys(tx).includes('inputs')) {
                // Populate as a limited-info tx that can be expanded in a block explorer
                parsedTxHistory.push(parsedTx);
                continue;
            }

            parsedTx.confirmations = tx.confirmations;
            parsedTx.blocktime = tx.time;
            let amountSent = 0;
            let amountReceived = 0;
            let opReturnMessage = '';
            let isCashtabMessage = false;
            // Assume an incoming transaction
            let outgoingTx = false;
            let tokenTx = false;
            let substring = '';

            // get the address of the sender for this tx and encode into eCash address
            let senderAddress = tx.inputs[0].coin.address;

            // If input includes tx address, this is an outgoing tx
            // Note that with bch-input data, we do not have input amounts
            for (let j = 0; j < tx.inputs.length; j += 1) {
                const thisInput = tx.inputs[j];
                if (ownAddressArray.includes(thisInput.coin.address)) {
                    // This is an outgoing transaction
                    outgoingTx = true;
                }
            }
            // Iterate over vout to find how much was sent or received
            for (let j = 0; j < tx.outputs.length; j += 1) {
                const thisOutput = tx.outputs[j];

                // If there is no addresses object in the output, it's either an OP_RETURN msg or token tx
                if (!thisOutput.address) {
                    let hex = thisOutput.script;

                    if (tx.slpToken) {
                        // this is an eToken transaction
                        tokenTx = true;
                        parsedTx.tokenInfo = parseTokenInfoForTxHistory(tx, ownAddressArray);
                    } else if (isCashtabOutput(hex)) {
                        // this is a cashtab.com generated message
                        try {
                            substring = extractCashtabMessage(hex);
                            opReturnMessage = Buffer.from(substring, 'hex');
                            isCashtabMessage = true;
                        } catch (err) {
                            // soft error if an unexpected or invalid cashtab hex is encountered
                            opReturnMessage = '';
                            console.log(
                                'useBCH.parsedTxHistory() error: invalid cashtab msg hex: ' +
                                    substring,
                            );
                        }
                    } else {
                        // this is an externally generated message
                        try {
                            substring = extractExternalMessage(hex);
                            opReturnMessage = Buffer.from(substring, 'hex');
                        } catch (err) {
                            // soft error if an unexpected or invalid cashtab hex is encountered
                            opReturnMessage = '';
                            console.log(
                                'useBCH.parsedTxHistory() error: invalid external msg hex: ' +
                                    substring,
                            );
                        }
                    }
                    continue; // skipping the remainder of tx data parsing logic in both token and OP_RETURN tx cases
                }
                if (thisOutput.address && 
                    ownAddressArray.includes(thisOutput.address)
                ) {
                    if (outgoingTx) {
                        // This amount is change
                        continue;
                    }
                    amountReceived += fromSmallestDenomination(thisOutput.value);
                } else if (outgoingTx) {
                    amountSent += fromSmallestDenomination(thisOutput.value);
                }
            }
            // Construct parsedTx
            parsedTx.amountSent = amountSent;
            parsedTx.amountReceived = amountReceived;
            parsedTx.tokenTx = tokenTx;
            parsedTx.outgoingTx = outgoingTx;
            parsedTx.replyAddress = senderAddress;
            parsedTx.destinationAddress = destinationAddress;
            parsedTx.opReturnMessage = opReturnMessage;
            parsedTx.isCashtabMessage = isCashtabMessage;

            // Add token info
            parsedTxHistory.push(parsedTx);
        }
        return parsedTxHistory;
    };
    const getTxBcash = async (txid) => {
        return fetch(`${getBcashRestUrl()}/tx/${txid}?slp=true`)
            .then(res => res.json())
            .catch(err => null);
    };

    const getTxHistoryBcash = async (
        addresses,
        limit = 30,
        reverse = true
    ) => {
        const result = []
        const utxoPromises = addresses.map(address => {
            const addr = convertToEcashPrefix(address);
            result.push({
                address: addr
            });
            return fetch(`${getBcashRestUrl()}/tx/address/${addr}?slp=true&limit=${limit}&reverse=${reverse}`)
                .then(res => res.json());
        });
        const txs = await Promise.all(utxoPromises);
        let allTxs = [];
        for (let i = 0; i < txs.length; i++) {
            allTxs = [
                ...allTxs,
                ...txs[i]
            ]
        }
        return allTxs;
    };

    const parseTokenInfoForTxHistory = (unparsedTx, ownAddressArray) => {
        // Get transaction type by finding first
        const transactionType = unparsedTx.outputs.find(
            output => output.slp
        ).slp.type;

        let qtyReceived = new BigNumber(0);
        let qtySent = new BigNumber(0);
        // Scan over tx to find out how much was sent and received
        const totalSent = unparsedTx.inputs.filter(input => 
                input.coin.slp && 
                ownAddressArray.includes(input.coin.address) &&
                transactionType != 'MINT'
            )
            .reduce((prev, curr) => prev.plus(curr.coin.slp.value), 
                new BigNumber(0));

        const totalReceived = unparsedTx.outputs.filter(output => 
                output.slp && 
                ownAddressArray.includes(output.address) &&
                output.slp.type != 'BATON'
            )
            .reduce((prev, curr) => prev.plus(curr.slp.value), 
                new BigNumber(0));
        // Check to see if this is either a sent or received transaction
        const divisor = 10 ** parseInt(unparsedTx.slpToken.decimals);

        if (totalSent.gte(totalReceived)) {
            qtySent = totalSent.minus(totalReceived)
                .div(divisor);
        } else {
            qtyReceived = totalReceived.minus(totalSent)
                .div(divisor);
        }

        const cashtabTokenInfo = {};
        cashtabTokenInfo.qtySent = qtySent.toString();
        cashtabTokenInfo.qtyReceived = qtyReceived.toString();
        cashtabTokenInfo.tokenId = unparsedTx.slpToken.tokenId;
        cashtabTokenInfo.tokenName = unparsedTx.slpToken.name;
        cashtabTokenInfo.tokenTicker = unparsedTx.slpToken.ticker;
        cashtabTokenInfo.transactionType = transactionType;

        return cashtabTokenInfo;
    };

    const getUtxoBcash = async (hash, index) => {
        return fetch(`${getBcashRestUrl()}/coin/${hash}/${index}?slp=true`)
            .then(res => res.json())
            .catch(err => null);
    };

    const getUtxosBcash = async (addresses) => {
        const result = []
        const utxoPromises = addresses.map(address => {
            const addr = convertToEcashPrefix(address);
            result.push({
                address: addr
            });
            return fetch(`${getBcashRestUrl()}/coin/address/${addr}?slp=true`)
                .then(res => res.json());
        });
        const utxos = await Promise.all(utxoPromises);
        let allUtxos = [];
        for (let i = 0; i < utxos.length; i++) {
            allUtxos = [
                ...allUtxos,
                ...utxos[i]
            ]
        }
        return allUtxos;
    };

    const getSlpBalancesAndUtxosBcash = async (utxos) => {
        // Prevent app from treating slpUtxos as nonSlpUtxos
        // Do not classify any utxos that include token information as nonSlpUtxos
        const nonSlpUtxos = utxos.filter(utxo => 
            !utxo.slp || (utxo.slp && utxo.slp.value == '0')
        );

        // To be included in slpUtxos, the utxo must
        // have utxo.isValid = true
        // If utxo has a utxo.tokenQty field, i.e. not a minting baton, then utxo.value !== '0'
        const slpUtxos = utxos.filter(utxo => 
            utxo.slp && ( utxo.slp.value != '0' || utxo.slp.type == 'MINT')
        );

        let tokensById = {};

        for (let i = 0; i < slpUtxos.length; i++) {
            const slpUtxo = slpUtxos[i];
            let token = tokensById[slpUtxo.slp.tokenId];

            if (token) {
                // Minting baton does nto have a slpUtxo.tokenQty type
                token.hasBaton = slpUtxo.slp.type === 'BATON';

                if (!token.hasBaton) {
                    token.balance = new BigNumber(token.balance).plus(
                        new BigNumber(slpUtxo.slp.value)
                    );
                }

            } else {
                token = {};
                token.info = await fetch(`${getBcashRestUrl()}/token/${slpUtxo.slp.tokenId}`)
                    .then(res => res.json());
                token.tokenId = slpUtxo.slp.tokenId;
                token.hasBaton = slpUtxo.slp.type === 'BATON';
                if (!token.hasBaton) {
                    token.balance = new BigNumber(slpUtxo.slp.value);
                } else {
                    token.balance = new BigNumber(0);
                }

                tokensById[slpUtxo.slp.tokenId] = token;
            }
        }

        const tokens = Object.values(tokensById);
        // console.log(`tokens`, tokens);
        return {
            tokens,
            nonSlpUtxos,
            slpUtxos,
        };
    };

    const getTicketData = async (address, limit = 30) => {
		// test address for development
		// address = "ecash:qqxlh6q47tmlyg439fxmjsx9gzjkwkp4wgxzd72uda";
		const response = await fetch(`https://blocklotto.cert.cash/ticket/address/${address}`);
		const data = await response.json();
		console.log("ticket data response", data);

		return data;
    };

    const broadcastTx = async (hex) => {
        return fetch(`${getBcashRestUrl()}/broadcast`, {
            method: 'POST',
            body: JSON.stringify({tx: hex})
        }).then(res => res.json());
    }

    const getByteCount = (inputs, outputs) => {
        // from https://github.com/bitcoinjs/bitcoinjs-lib/issues/921#issuecomment-354394004
        let totalWeight = 0
        let hasWitness = false
        // assumes compressed pubkeys in all cases.
        const types = {
          inputs: {
            "MULTISIG-P2SH": 49 * 4,
            "MULTISIG-P2WSH": 6 + 41 * 4,
            "MULTISIG-P2SH-P2WSH": 6 + 76 * 4,
            P2PKH: 148 * 4,
            P2WPKH: 108 + 41 * 4,
            "P2SH-P2WPKH": 108 + 64 * 4
          },
          outputs: {
            P2SH: 32 * 4,
            P2PKH: 34 * 4,
            P2WPKH: 31 * 4,
            P2WSH: 43 * 4
          }
        }
    
        Object.keys(inputs).forEach(function(key) {
          if (key.slice(0, 8) === "MULTISIG") {
            // ex. "MULTISIG-P2SH:2-3" would mean 2 of 3 P2SH MULTISIG
            const keyParts = key.split(":")
            if (keyParts.length !== 2) throw new Error(`invalid input: ${key}`)
            const newKey = keyParts[0]
            const mAndN = keyParts[1].split("-").map(function(item) {
              return parseInt(item)
            })
    
            totalWeight += types.inputs[newKey] * inputs[key]
            const multiplyer = newKey === "MULTISIG-P2SH" ? 4 : 1
            totalWeight += (73 * mAndN[0] + 34 * mAndN[1]) * multiplyer
          } else {
            totalWeight += types.inputs[key] * inputs[key]
          }
          if (key.indexOf("W") >= 0) hasWitness = true
        })
    
        Object.keys(outputs).forEach(function(key) {
          totalWeight += types.outputs[key] * outputs[key]
        })
    
        if (hasWitness) totalWeight += 2
    
        totalWeight += 10 * 4
    
        return Math.ceil(totalWeight / 4)
    }

    const calcFee = (
        utxos,
        p2pkhOutputNumber = 2,
        satoshisPerByte = currency.defaultFee,
    ) => {
        const byteCount = getByteCount(
            { P2PKH: utxos.length },
            { P2PKH: p2pkhOutputNumber },
        );
        const txFee = Math.ceil(satoshisPerByte * byteCount);
        return txFee;
    };

    const buildMintOpReturn = (tokenId, mintQuantityBufBE) => {
        const mintOpReturn = new Script()
                .pushSym('return')
                .pushData(Buffer.concat([
                    Buffer.from('SLP', 'ascii'),
                    Buffer.alloc(1)
                ]))
                .pushPush(Buffer.alloc(1, 1))
                .pushData(Buffer.from('MINT', 'ascii'))
                .pushData(tokenId)
                .pushPush(Buffer.alloc(1, 2))
                .pushData(mintQuantityBufBE)
                .compile();
        return mintOpReturn
    };

    const buildBurnOpReturn = (tokenId, burnQuantity, version = 1) => {
        const burnOpReturn = new Script()
                .pushSym('return')
                .pushData(Buffer.concat([
                    Buffer.from('SLP', 'ascii'),
                    Buffer.alloc(1)
                ]))
                .pushPush(Buffer.alloc(1, version))
                .pushData(Buffer.from('BURN', 'ascii'))
                .pushData(Buffer.from(tokenId, 'hex'))
                .pushData(U64.fromString(burnQuantity).toBE(Buffer));

        return burnOpReturn.compile();
    };

    const sendBip70 = async (
        wallet,
        paymentDetails, // b70.PaymentDetails
        feeInSatsPerByte,
        testOnly = false,
        isPreburn = false,
        rawChainTxs = [] // All outputs for this wallet address in last TX will be used
    ) => {
        // Get change address from sending utxos
        // fall back to what is stored in wallet
        const REMAINDER_ADDR = wallet.Path1899.cashAddress;
        const refundOutput = new Output({
            address: REMAINDER_ADDR
        });

        const slpBalancesAndUtxos = wallet.state.slpBalancesAndUtxos;
        let nonSlpCoins = slpBalancesAndUtxos.nonSlpUtxos.map( utxo => 
            Coin.fromJSON(utxo)
        );

        // Check to see if this is an SLP/eToken transaction
        const firstOutput = paymentDetails.outputs[0]
        // console.log('paymentDetails', paymentDetails);
        // console.log('paymentDetails.outputs', paymentDetails.outputs);
        const slpScript = SLP.fromRaw(Buffer.from(firstOutput.script));
        const isSlp = slpScript.isValidSlp();

        // Check to see if rawChainTxs satisfies the payment request
        let paymentObj;
        let txidStr;
        if (rawChainTxs.length >= 1) {
            const tx = TX.fromRaw(rawChainTxs[rawChainTxs.length - 1]);
            const txOutputs = tx.outputs.map(output => output.toJSON());
            const prOutputs = paymentDetails.outputs.map(output => {
                return {
                    script: output.script.toString('hex'),
                    value: output.value
                };
            });
            // console.log('txOutputs', txOutputs)
            // console.log('prOutputs', prOutputs)
            let requestFulfilled = false;
            for (let i = 0; i < prOutputs.length; i++) {
                requestFulfilled = prOutputs[i].script === txOutputs[i].script
                    && prOutputs[i].value === txOutputs[i].value
                // Handle MINT being able to fulfill SEND payment request
                if (i === 0) {
                    requestFulfilled = prOutputs[i].script.replace('53454e44', '4d494e54') === txOutputs[i].script
                    && prOutputs[i].value === txOutputs[i].value
                }
                // console.log('Request fulfilled?', i, requestFulfilled)
                // If any output doesn't match, break
                if (!requestFulfilled)
                    break;
            }

            if (requestFulfilled) {
                // Build payment object to send in BIP 70 response
                txidStr=  tx.txid().toString('hex');
                paymentObj = {
                    merchantData: Buffer.alloc(0),
                    transactions: rawChainTxs,
                    refundTo:[{
                        script: refundOutput.script.toRaw(),
                        value: 0
                    }],
                    memo: paymentDetails.memo
                }
            }
        }

        // Build the payment object
        if (!paymentObj) {
            let postagePaid = false;
            const tokenCoins = [];
            // If is SLP
            if (isSlp) {

                const tokenIdBuf = slpScript.getData(4);
                const tokenId = tokenIdBuf.toString('hex');

                // Is Postage Paid by Merchant?
                const merchantData = paymentDetails.getData('json');
                // console.log('merchantData', merchantData)
                // console.log('typeof merchantData', typeof merchantData)
                if (typeof merchantData === "object" && merchantData.postage) {
                    const stamps = merchantData.postage.stamps;
                    const listing = stamps.find(stamp => stamp.tokenId == tokenId);
                    // If postage is paid don't use native token funding
                    if (listing && listing.rate == 0) {
                        postagePaid = true;
                    }
                }
                console.log('postagePaid', postagePaid);

                // Throw error if transaction type is not SEND
                const slpType = slpScript.getType();
                if (slpType !== 'SEND' && slpType !== 'BURN')
                    throw new Error(`Token ${slpType} transactions not supported`);

                // Get required UTXOs
                const sendRecords = slpScript.getRecords(tokenIdBuf);
                const totalBase = sendRecords.reduce((total, record) => {
                    return total.add(U64.fromBE(Buffer.from(record.value)));
                }, U64.fromInt(0));
                let totalTokenBalance = U64.fromInt(0);
                const token = wallet.state.tokens.find(token => 
                    token.tokenId === tokenId
                );
                if (token) {
                    totalTokenBalance = U64.fromString(
                        token.balance.toString()
                    );
                }
                if (totalTokenBalance.lt(totalBase) && rawChainTxs.length === 0)
                    throw new Error ('Insufficient token balance to complete transaction');

                const tokenUtxos = [];
                
                // Add utxos from chained parent if present
                if (rawChainTxs.length > 0) {
                    // If a chain TX is provided, use it for the input coins
                    const parentTx = TX.fromRaw(rawChainTxs[rawChainTxs.length -1]);
                    // Parse SLP script
                    const slpScript = script.SLP.fromRaw(parentTx.outputs[0].script.toRaw())
                    const records = slpScript.getRecords(Buffer.alloc(32))
                    // Iterate through parentTx outputs
                    for (let i = 0; i < parentTx.outputs.length; i++) {
                        const address = parentTx.outputs[i].getAddress()?.toString()
                        if (address === REMAINDER_ADDR) {
                            const record = records.find(r => r.type !== 'BATON' && r.vout === i)
                            if (record) {
                                // convert to coin first for compatibility
                                const coin = Coin.fromTX(parentTx, i, -1);
                                coin.slp = record;
                                const utxo = coin.toJSON();
                                // Add UTXO
                                tokenUtxos.push(utxo)
                            }
                        }
                    }
                
                }

                if (slpType === 'BURN' && !isPreburn) {
                    // Send up preburn split transaction
                    // Postage will be added and it will be cached on server
                    // Use UTXO from response as input UTXO for burn

                    // Clear utxo array in case rawChainTxs is present
                    tokenUtxos.length = 0;

                    // First clone payment details to use with split tx
                    const splitDetails = PaymentDetails.fromOptions(
                        paymentDetails
                    );
                    // Replace with split tx outputs
                    const sendTotalString = totalBase.toString();
                    const sendOpReturn = buildSendOpReturn(
                        tokenId,
                        [sendTotalString]
                    );
                    const opReturnOut = {
                        script: sendOpReturn.toRaw(),
                        value: 0
                    };
                    const preburnOut = new Output({
                        address: REMAINDER_ADDR,
                        value: 546
                    });
                    splitDetails.outputs = [
                        opReturnOut, 
                        {
                            script: preburnOut.script.toRaw(),
                            value: preburnOut.value
                        }
                    ]
                    // Send split tx and get Payment object back if successful
                    const splitPayment = await sendBip70(
                        wallet,
                        splitDetails,
                        feeInSatsPerByte,
                        false,
                        true
                    );
                    const merchantData = splitPayment.getData('json');
                    if (!merchantData.preburn)
                        throw new Error('Burn failed: Preburn tx hash not returned from payment server');

                    // Use split UTXO as sole input UTXO
                    tokenUtxos.push({
                        version: 1,
                        height: -1,
                        coinbase: false,
                        script: preburnOut.script.toJSON(),
                        value: preburnOut.value,
                        hash: merchantData.preburn,
                        index: 1,
                        slp: {
                            vout: 1,
                            tokenId,
                            value: sendTotalString,
                            type: "SEND"
                        }
                    });

                } else {
                    // Use available UTXOS in wallet
                    const availableTokenUtxos = slpBalancesAndUtxos.slpUtxos.filter(
                        utxo => {
                            if (
                                utxo && // UTXO is associated with a token.
                                utxo.slp.tokenId === tokenId && // UTXO matches the token ID.
                                utxo.slp.type !== 'BATON' // UTXO is not a minting baton.
                            ) {
                                return true;
                            }
                            return false;
                        },
                    );

                    tokenUtxos.push(...availableTokenUtxos);
                }

                if (tokenUtxos.length === 0) {
                    throw new Error(
                        'No token UTXOs for the specified token could be found.',
                    );
                }

                let finalTokenAmountSent = U64.fromInt(0);
                for (let i = 0; i < tokenUtxos.length; i++) {
                    console.log('tokenUtxos', tokenUtxos);
                    const tokenCoin = Coin.fromJSON(tokenUtxos[i]);
                    tokenCoins.push(tokenCoin);

                    finalTokenAmountSent = finalTokenAmountSent.add(
                        U64.fromString(tokenUtxos[i].slp.value),
                    );

                    if (totalBase.lte(finalTokenAmountSent)) {
                        // Add token change amount to SLP OP_RETURN
                        const tokenChangeAmount = finalTokenAmountSent.sub(totalBase);
                        // Skip if change amount is zero
                        if (tokenChangeAmount.toInt() != 0) {
                            slpScript.pushData(tokenChangeAmount.toBE(Buffer)).compile();
                            // add additional output for change
                            paymentDetails.outputs[0].script = slpScript.toRaw()
                            paymentDetails.outputs.splice(
                                sendRecords.length + 1, // Must skip OP_RETURN
                                0,
                                {
                                    script: refundOutput.script.toRaw(),
                                    value: 546
                                }
                            );
                        }
                        break;
                    }
                }

                // Handle error of user having no BCH and postage not paid
                if (!postagePaid && slpBalancesAndUtxos.nonSlpUtxos.length === 0) {
                    throw new Error(
                        `You need some ${currency.ticker} to send ${currency.tokenTicker}`,
                    );
                }
            }

            // Build Transaction
            const tx = new MTX();
            // Set SigHashType
            let sigHashType = Script.hashType.ALL | Script.hashType.SIGHASH_FORKID;

            // Add required outputs
            for (let i = 0; i < paymentDetails.outputs.length; i++) {
                tx.addOutput(paymentDetails.outputs[i]);
            }

            if (postagePaid) {
                // Postage Protocol requires ANYONECANPAY
                sigHashType = Script.hashType.ANYONECANPAY | sigHashType;

                for (let i = 0; i < tokenCoins.length; i++) {
                    tx.addCoin(tokenCoins[i]);
                }
            } else {
                await tx.fund([
                        ...tokenCoins,
                        ...nonSlpCoins
                    ], {
                    inputs: tokenCoins.map(coin => Input.fromCoin(coin).prevout),
                    changeAddress: REMAINDER_ADDR,
                    rate: feeInSatsPerByte * 1000 // 1000 sats per kb = 1 sat/b
                });
            }

            const keyRingArray = [
                KeyRing.fromSecret(wallet.Path245.fundingWif),
                KeyRing.fromSecret(wallet.Path145.fundingWif),
                KeyRing.fromSecret(wallet.Path1899.fundingWif)
            ];

            tx.sign(keyRingArray, sigHashType);

            // output rawhex
            const rawTx = tx.toRaw()
            const hex = rawTx.toString('hex');
            console.log('hex', hex);

            // Add on any 
            const rawTxs = [
                ...rawChainTxs,
                rawTx
            ]

            paymentObj = {
                merchantData: Buffer.alloc(0),
                transactions: rawTxs,
                refundTo:[{
                    script: refundOutput.script.toRaw(),
                    value: 0
                }],
                memo: paymentDetails.memo
            }

            txidStr = tx.txid().toString('hex');

        }

        // Broadcast transaction to the network
        let paymentAck;
        if (!testOnly) {
            paymentAck = await postPayment(
                paymentDetails.paymentUrl,
                paymentObj,
                isSlp ? currency.tokenPrefixes[0] : currency.prefixes[0]
            );
        }

        if (paymentAck.payment) {
            // Return the payment object from the ACK if is preburn
            if (isPreburn)
                return paymentAck.payment

            const transactionIds = paymentAck.payment.transactions.map(t =>
                TX.fromRaw(t).txid()
            );
            txidStr = transactionIds[0];

            console.log(`${currency.tokenTicker} txid`, txidStr);
            
            // if (isSlp) {
            //     const possibleExternalMint = TX.fromRaw(paymentAck.payment.transactions[0]);
            //     const slpScript = script.SLP.fromRaw(possibleExternalMint.outputs[0].script.toRaw())
            //     const isMint = slpScript.getType() === 'MINT';
            //     const isVersion2 = slpScript.getString(2, 'hex') == '02';
            //     if (isMint && isVersion2) {
            //         const slpOutputs = slpScript.code.slice(5);
            //         let mintQuantity = U64.fromNumber(0);
            //         for (let i = 0; i < slpOutputs.length; i++) {
            //             const valueU64 = U64.fromBE(slpOutputs[i].toData());
            //             mintQuantity.iadd(valueU64);
            //         }
            //         await writeMempoolMint({
            //             txid: txidStr, 
            //             token_id: slpScript.getData(4).toString('hex'),
            //             block: -1,
            //             minter_pubkey: wallet.Path1899.publicKey,
            //             mint_total_amount: mintQuantity.toInt(),
            //         });                    
            //     }
            // }
        }

        let link;
        if (process.env.REACT_APP_NETWORK === `mainnet`) {
            link = `${currency.tokenExplorerUrl}/tx/${txidStr}`;
        } else {
            link = `${currency.blockExplorerUrlTestnet}/tx/${txidStr}`;
        }

        // console.log(`link`, link);

        return { txidStr, link };
    };

    const readAuthCode = (authCode) => {
        const authCodeBuf = Buffer.from(authCode, 'base64');
        if (authCodeBuf.length > 300)
            return readAuthCodeV2(authCode);
        const authReader = read(authCodeBuf);
        const mintQuantity = authReader.readBytes(8);
        const stampRawOutpoint = authReader.readBytes(36);
        const stampOutpoint = Outpoint.fromRaw(stampRawOutpoint);
        // Auth signature is remaining bytes
        const txAuthSig = authReader.readBytes(authReader.getSize() - authReader.offset);

        return {
            version: 1,
            mintQuantity,
            stampOutpoint,
            txAuthSig
        }
    }

    const readAuthCodeV2 = (authCode) => {
        const authCodeBuf = Buffer.from(authCode, 'base64');
        const authReader = read(authCodeBuf);
        const authPubKey = authReader.readBytes(33);
        const serializedMerkleProof = authReader.readBytes(33 * 7);
        const txAuthSig = authReader.readVarBytes();
        const mintId = authReader.readBytes(6);
        const minterPubKeyHash = authReader.readBytes(20);
        const batonBuf = authReader.readBytes(36);
        const batonUtxo = Outpoint.fromRaw(batonBuf);
        const txSerializedOutputs = authReader.readBytes(authReader.getSize() - authReader.offset);
        const outputsReader = read(txSerializedOutputs);
        const txOutputs = [];
        while (outputsReader.getSize() > outputsReader.offset) {
            txOutputs.push(Output.fromReader(outputsReader))
        }
        // Get token ID and mint quantity
    const tokenId = txOutputs[0].script.getData(4);
    const mintQuantity = U64.fromNumber(0);
    const slpOutputs = txOutputs[0].script.code.slice(5);
    for (let i = 0; i < slpOutputs.length; i++) {
        const valueU64 = U64.fromBE(slpOutputs[i].toData());
        mintQuantity.iadd(valueU64);
    }

    return {
        version: 2,
        tokenId,
        mintQuantity: mintQuantity.toBE(Buffer),
            authCodeBuf,
            authPubKey,
            serializedMerkleProof,
            mintId,
            minterPubKeyHash,
            batonUtxo,
            txSerializedOutputs,
            txOutputs,
            txAuthSig
        }
    }

    const outscriptHexV2 = '01217f78aa7c517f01207f6b7c81637c687eaa6c5' +
    '17f01207f6b7c81637c687eaa6c517f01207f6b7c81637c687eaa6c517f01207' +
    'f6b7c81637c687eaa6c517f01207f6b7c81637c687eaa6c517f01207f6b7c816' +
    '37c687eaa6c517f7c81637c687eaa2062443f1f0f45468a0e69c6eb1f3f4aabd' +
    'cc541ac64eae813365d47dbf6dab176887c517f7c817f766b7bbb6c011a7f7c5' +
    '67f5479a9887501247faa5279820128947f01207f757b8801447f7701247f758' +
    '8a86f7b828c7f757c7bbb75ac';

    const getOutscriptHexV2 = (isSandbox = false) => {
        if (isSandbox)
            return outscriptHexV2.replace(
                '62443f1f0f45468a0e69c6eb1f3f4aabdcc541ac64eae813365d47dbf6dab176',
                '2378b2a25b26ab248cd09a11b41f54452c4c8860fd1f7a835d13e784b1ac80be'
            );
        return outscriptHexV2;
    }

    const getMintVaultAddress = (isSandbox = false) => {
        const outscriptHex = getOutscriptHexV2(isSandbox);
        // console.log('outscriptHex', outscriptHex);
        const outScriptHash = Hash160.digest(Buffer.from(outscriptHex, 'hex'));
        const p2shPubKeyScript = Script.fromScripthash(outScriptHash);
        return p2shPubKeyScript.getAddress();
    }

    const sendSelfMintV2 = async (
        wallet,
        authCode, // Base64
        testOnly = false,
        returnRawTx = false,
        rawBurnTx,
        isSandbox = false
    ) => {
        console.log("sendSelfMintV2() called")
        try {
            // Process entered Auth Code string
            const {
                batonUtxo,
                txOutputs,
                authCodeBuf
            } = readAuthCode(authCode);

            // Find Baton
            let batonCoin;
            if (rawBurnTx) {
                const burnTx = TXUtil.fromRaw(rawBurnTx);
                batonCoin = Coin.fromTX(burnTx, 1, -1)
            } else {
                const batonFullUtxo = await getUtxoBcash(
                    batonUtxo.rhash(),
                    batonUtxo.index
                );
                // Baton coin
                batonCoin = Coin.fromJSON(batonFullUtxo);
            }
            

            const keyring = KeyRing.fromSecret(wallet.Path1899.fundingWif);
            // Construct transaction
            const tx = new TXUtil();
            // Add outputs
            tx.outputs = txOutputs;
            // Add inputs (must be in this order)
            tx.addCoin(batonCoin); // Input index 0: existing mint baton

            const outScript = Script.fromRaw(Buffer.from(getOutscriptHexV2(isSandbox), 'hex'));

            // Validation steps
            const p2shAddr = Address.fromScripthash(outScript.hash160());
            if (p2shAddr.toString() !== batonCoin.getAddress().toString())
                throw new Error('Unsupported token. Invalid ScriptHash for baton')

            const sigHashType = Script.hashType.ALL | Script.hashType.SIGHASH_FORKID;
            const flags = Script.flags.STANDARD_VERIFY_FLAGS;

            // Sign TX
            tx.template(keyring); // prepares the template
            const sig = tx.signature(0, outScript, batonCoin.value, keyring.privateKey, sigHashType, flags);
            const preimage = tx.getPreimage(0, outScript, batonCoin.value, sigHashType, false);
            const items = [
                sig,
                keyring.getPublicKey(),
                Buffer.from(preimage.toString('hex'), 'hex'),
                authCodeBuf.slice(264),
                authCodeBuf.slice(0, 264),
                outScript.toRaw()
            ];
            tx.inputs[0].script.fromItems(items);

            const rawTx = tx.toRaw()
            const hex = rawTx.toString('hex')

            // Verify
            // console.log('checking index 0');
            // const checkBaton = tx.checkInput(0, stampCoin);
            // console.log('checking index 1');
            // const checkStamp = tx.checkInput(1, batonCoin);
            const verified = tx.verify(tx.view);
            
            console.log('verified', verified);
            console.log('tx size', tx.getSize());
            console.log('fee', tx.getFee());
            console.log('tx hex', hex);

            if (!verified)
                throw new Error('Transaction verification failed');

            if (returnRawTx)
                return rawTx;
        
            // Broadcast transaction to the network
            let broadcast = {success: true};
            if (!testOnly) {
                broadcast = await broadcastTx(hex);
                if (broadcast.error)
                    throw broadcast.error
            }

            const txidStr = tx.txid().toString('hex')

            if (broadcast.success) {
                console.log(`${currency.tokenTicker} txid`, txidStr);
            }
            let link;
            if (process.env.REACT_APP_NETWORK === `mainnet`) {
                link = `${currency.tokenExplorerUrl}/tx/${txidStr}`;
            } else {
                link = `${currency.blockExplorerUrlTestnet}/tx/${txidStr}`;
            }
            //console.log(`link`, link);

            return link;
        } catch (err) {
            if (err.error === 'insufficient priority (code 66)') {
                err.code = SEND_BCH_ERRORS.INSUFFICIENT_PRIORITY;
            } else if (err.error === 'txn-mempool-conflict (code 18)') {
                err.code = SEND_BCH_ERRORS.DOUBLE_SPENDING;
            } else if (err.error === 'Network Error') {
                err.code = SEND_BCH_ERRORS.NETWORK_ERROR;
            } else if (
                err.error ===
                'too-long-mempool-chain, too many unconfirmed ancestors [limit: 25] (code 64)'
            ) {
                err.code = SEND_BCH_ERRORS.MAX_UNCONFIRMED_TXS;
            }
            console.log(`error: `, err);
            throw err;
        }
    }

    const generateBurnTx = async (
        wallet,
        tokenId,
        utxosToBurn = [],
        batonOutput
    ) => {

        // If utxosToBurn are not provided, burn entire balance
        if (utxosToBurn.length === 0) {
            const slpBalancesAndUtxos = wallet.state.slpBalancesAndUtxos
            const tokenUtxos = slpBalancesAndUtxos.slpUtxos.filter(
                utxo => {
                    if (
                        utxo && // UTXO is associated with a token.
                        utxo.slp.tokenId === tokenId && // UTXO matches the token ID.
                        utxo.slp.type !== 'BATON' // UTXO is not a minting baton.
                    ) {
                        return true;
                    }
                    return false;
                },
            );

            if (tokenUtxos.length === 0) {
                throw new Error(
                    'No token UTXOs for the specified token could be found.',
                );
            }

            utxosToBurn.push(...tokenUtxos);
        } else {
            // Basic validity check on UTXOs supplied
            const containsInvalidUtxos = utxosToBurn.some(
                utxo => {
                    if (
                        !utxo?.slp || // UTXO isn't associated with a token.
                        utxo.slp.tokenId != tokenId || // UTXO doesn't match the token ID.
                        utxo.slp.type === 'BATON' // UTXO is a minting baton.
                    ) { return true; }
                    
                    return false;
                },
            )

            if (containsInvalidUtxos) {
                throw new Error(
                    'Invalid UTXOS provided for generateBurnTx.',
                );
            }
        }

        let burnQuantity = 0;
        const coins = utxosToBurn.map(utxo => {
            burnQuantity += parseInt(utxo.slp.value);
            return Coin.fromJSON(utxo);
        });

        const tokenVersion = coins[0].slp.version
        let tx = new TXUtil()// Build MINT OP_RETURN
        const burnOpReturn = buildBurnOpReturn(
            tokenId, 
            `${burnQuantity}`, 
            tokenVersion
        );
        // Add outputs
        tx.addOutput(burnOpReturn, 0); // SLP burn OP_RETURN
        // Add baton outpoint if included
        if (batonOutput)
            tx.addOutput(batonOutput);
        for (let i = 0; i < coins.length; i++) {
            tx.addCoin(coins[i]);
        }
        // Calculate if postage is needed
        const estimatedTxSize = await tx.estimateSize();
        const postageNeeded = estimatedTxSize > tx.getFee();

        // Sign Tx
        const keyRingArray = [
            KeyRing.fromSecret(wallet.Path245.fundingWif),
            KeyRing.fromSecret(wallet.Path145.fundingWif),
            KeyRing.fromSecret(wallet.Path1899.fundingWif)
        ];

        // Set Sighash type
        const hashTypes = Script.hashType;
        const sighashType = postageNeeded
            ? hashTypes.ALL | hashTypes.ANYONECANPAY | hashTypes.SIGHASH_FORKID
            : hashTypes.ALL | hashTypes.SIGHASH_FORKID;

        // Sign transaction
        tx.sign(keyRingArray, sighashType);
        const rawTx = tx.toRaw();
        console.log('rawTx', rawTx.toString('hex'))

        // Get postage if needed
        if (postageNeeded) {
            if (tokenVersion != 2) {
                throw new Error(
                    'Postage needed, but is only available for token type (version) 2.',
                );
            }

            const refundScript = Script.fromPubkeyhash(keyRingArray[2].getKeyHash());

            const paymentObj = {
                merchantData: { returnRawTx: true },
                transactions: [rawTx],
                refundTo:[{
                    script: refundScript.toRaw(),
                    value: 0
                }],
                memo: ''
            }

            // Post transaction to the postage server. Response is unbroadcast tx
            const paymentAck = await postPayment(
                POSTAGE_URL,
                paymentObj,
                currency.tokenPrefixes[0]
            );

            if (paymentAck.payment) {
                return paymentAck.payment.transactions[0];
            } else {
                throw new Error(
                    'Error retreiving postage paid transaction.',
                );
            }

        }

        return rawTx;
    }

    return {
        calcFee,
        getPostage,
        calculatePostage,
        getUtxoBcash,
        getUtxosBcash,
        getSlpBalancesAndUtxosBcash,
        getTxBcash,
        getTxHistoryBcash,
        parseTxData,
        parseTokenInfoForTxHistory,
        getTicketData,
        getBcashRestUrl,
        sendBip70,
        readAuthCode,
        readAuthCodeV2,
        sendSelfMintV2,
        getMintVaultAddress,
        generateBurnTx,
		broadcastTx
    };
}
