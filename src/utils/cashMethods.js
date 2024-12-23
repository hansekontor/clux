import { currency } from '@components/Common/Ticker';
import BigNumber from 'bignumber.js';
import cashaddr from 'ecashaddrjs';
import { script, Script, TX } from '@hansekontor/checkout-components';
const { SLP } = script; 
import bio from 'bufio';

import { sandboxTokenInfo } from '@utils/token';
import { calculatePayout, readTicketAuthCode } from './ticket';

export const fromLegacyDecimals = (
    amount,
    cashDecimals = currency.cashDecimals,
) => {
    // Input 0.00000546 BCH
    // Output 5.46 XEC or 0.00000546 BCH, depending on currency.cashDecimals
    const amountBig = new BigNumber(amount);
    const conversionFactor = new BigNumber(10 ** (8 - cashDecimals));
    const amountSmallestDenomination = amountBig
        .times(conversionFactor)
        .toNumber();
    return amountSmallestDenomination;
};

export const fromSmallestDenomination = (
    amount,
    cashDecimals = currency.cashDecimals,
) => {
    const amountBig = new BigNumber(amount);
    const multiplier = new BigNumber(10 ** (-1 * cashDecimals));
    const amountInBaseUnits = amountBig.times(multiplier);
    return amountInBaseUnits.toNumber();
};

export const toSmallestDenomination = (
    sendAmount,
    cashDecimals = currency.cashDecimals,
) => {
    // Replace the BCH.toSatoshi method with an equivalent function that works for arbitrary decimal places
    // Example, for an 8 decimal place currency like Bitcoin
    // Input: a BigNumber of the amount of Bitcoin to be sent
    // Output: a BigNumber of the amount of satoshis to be sent, or false if input is invalid

    // Validate
    // Input should be a BigNumber with no more decimal places than cashDecimals
    const isValidSendAmount =
        BigNumber.isBigNumber(sendAmount) && sendAmount.dp() <= cashDecimals;
    if (!isValidSendAmount) {
        return false;
    }
    const conversionFactor = new BigNumber(10 ** cashDecimals);
    const sendAmountSmallestDenomination = sendAmount.times(conversionFactor);
    return sendAmountSmallestDenomination;
};

export const formatBalance = (unformattedBalance, optionalLocale) => {
    try {
        if (optionalLocale === undefined) {
            return new Number(unformattedBalance).toLocaleString({
                maximumFractionDigits: currency.cashDecimals,
            });
        }
        return new Number(unformattedBalance).toLocaleString(optionalLocale, {
            maximumFractionDigits: currency.cashDecimals,
        });
    } catch (err) {
        console.log(`Error in formatBalance for ${unformattedBalance}`);
        console.log(err);
        return unformattedBalance;
    }
};

export const batchArray = (inputArray, batchSize) => {
    // take an array of n elements, return an array of arrays each of length batchSize

    const batchedArray = [];
    for (let i = 0; i < inputArray.length; i += batchSize) {
        const tempArray = inputArray.slice(i, i + batchSize);
        batchedArray.push(tempArray);
    }
    return batchedArray;
};

export const flattenBatchedHydratedUtxos = batchedHydratedUtxoDetails => {
    // Return same result as if only the bulk API call were made
    // to do this, just need to move all utxos under one slpUtxos
    /*
    given 
    [
      {
        slpUtxos: [
            {
                utxos: [],
                address: '',
            }
          ],
      },
      {
        slpUtxos: [
            {
                utxos: [],
                address: '',
            }
          ],
      }
    ]
  return [
    {
        slpUtxos: [
            {
            utxos: [],
            address: ''
            },
            {
            utxos: [],
            address: ''
            },
          ]
        }
  */
    const flattenedBatchedHydratedUtxos = { slpUtxos: [] };
    for (let i = 0; i < batchedHydratedUtxoDetails.length; i += 1) {
        const theseSlpUtxos = batchedHydratedUtxoDetails[i].slpUtxos[0];
        flattenedBatchedHydratedUtxos.slpUtxos.push(theseSlpUtxos);
    }
    return flattenedBatchedHydratedUtxos;
};

export const loadStoredWallet = walletStateFromStorage => {
    // Accept cached tokens array that does not save BigNumber type of BigNumbers
    // Return array with BigNumbers converted
    // See BigNumber.js api for how to create a BigNumber object from an object
    // https://mikemcl.github.io/bignumber.js/
    const liveWalletState = walletStateFromStorage;
    const { slpBalancesAndUtxos, tokens } = liveWalletState;
    for (let i = 0; i < tokens.length; i += 1) {
        const thisTokenBalance = tokens[i].balance;
        thisTokenBalance._isBigNumber = true;
        tokens[i].balance = new BigNumber(thisTokenBalance);
    }

    // Also confirm balance is correct
    // Necessary step in case currency.decimals changed since last startup
    const balancesRebased = 0//;normalizeBalance(slpBalancesAndUtxos);
    liveWalletState.balances = balancesRebased;
    return liveWalletState;
};

export const normalizeBalance = slpBalancesAndUtxos => {
    const totalBalanceInSatoshis = slpBalancesAndUtxos.nonSlpUtxos.reduce(
        (previousBalance, utxo) => previousBalance + utxo.value,
        0,
    );
    return {
        totalBalanceInSatoshis,
        totalBalance: fromSmallestDenomination(totalBalanceInSatoshis),
    };
};

export const isValidStoredWallet = walletStateFromStorage => {
	// console.log("ISVALIDSTOREDWALLET", walletStateFromStorage);
	// console.log(typeof walletStateFromStorage === 'object');
	// console.log('state' in walletStateFromStorage);
	// console.log(typeof walletStateFromStorage.state === 'object');
	// console.log('balances' in walletStateFromStorage.state);
	// console.log('utxos' in walletStateFromStorage.state);
	// console.log('slpBalancesAndUtxos' in walletStateFromStorage.state);
	// console.log('tokens' in walletStateFromStorage.state);
	// console.log('tickets' in walletStateFromStorage.state);

	const valid =(
		typeof walletStateFromStorage === 'object' &&
        'state' in walletStateFromStorage &&
        typeof walletStateFromStorage.state === 'object' &&
        'balances' in walletStateFromStorage.state &&
        'utxos' in walletStateFromStorage.state &&
        'slpBalancesAndUtxos' in walletStateFromStorage.state &&
        'tokens' in walletStateFromStorage.state &&
        'tickets' in walletStateFromStorage.state
    );
	// console.log("valid", valid);

	return valid;
};

export const getWalletState = wallet => {
    if (!wallet || !wallet.state) {
        return {
            balances: { totalBalance: 0, totalBalanceInSatoshis: 0 },
            hydratedUtxoDetails: {},
            tokens: [],
            slpBalancesAndUtxos: {},
            parsedTxHistory: [],
            utxos: [],
            tickets: [],
        };
    }
	
    return wallet.state;
};

export function convertToEcashPrefix(bitcoincashPrefixedAddress) {
    // Prefix-less addresses may be valid, but the cashaddr.decode function used below
    // will throw an error without a prefix. Hence, must ensure prefix to use that function.
    const hasPrefix = bitcoincashPrefixedAddress.includes(':');
    if (hasPrefix) {
        // Is it bitcoincash: or simpleledger:
        const { type, hash, prefix } = cashaddr.decode(
            bitcoincashPrefixedAddress,
        );

        let newPrefix;
        if (prefix === 'bitcoincash') {
            newPrefix = 'ecash';
        } else if (prefix === 'simpleledger') {
            newPrefix = 'etoken';
        } else {
            return bitcoincashPrefixedAddress;
        }

        const convertedAddress = cashaddr.encode(newPrefix, type, hash);

        return convertedAddress;
    } else {
        return bitcoincashPrefixedAddress;
    }
}

export function convertEtokenToSimpleledger(etokenPrefixedAddress) {
    // Prefix-less addresses may be valid, but the cashaddr.decode function used below
    // will throw an error without a prefix. Hence, must ensure prefix to use that function.
    const hasPrefix = etokenPrefixedAddress.includes(':');
    if (hasPrefix) {
        // Is it bitcoincash: or simpleledger:
        const { type, hash, prefix } = cashaddr.decode(etokenPrefixedAddress);

        let newPrefix;
        if (prefix === 'etoken') {
            newPrefix = 'simpleledger';
        } else {
            // return address with no change

            return etokenPrefixedAddress;
        }

        const convertedAddress = cashaddr.encode(newPrefix, type, hash);

        return convertedAddress;
    } else {
        // return address with no change
        return etokenPrefixedAddress;
    }
}

export const confirmNonEtokenUtxos = (hydratedUtxos, nonEtokenUtxos) => {
    // scan through hydratedUtxoDetails
    for (let i = 0; i < hydratedUtxos.length; i += 1) {
        // Find utxos with txids matching nonEtokenUtxos
        if (nonEtokenUtxos.includes(hydratedUtxos[i].txid)) {
            // Confirm that such utxos are not eToken utxos
            hydratedUtxos[i].isValid = false;
        }
    }
    return hydratedUtxos;
};

export const checkNullUtxosForTokenStatus = txDataResults => {
    const nonEtokenUtxos = [];
    for (let j = 0; j < txDataResults.length; j += 1) {
        const thisUtxoTxid = txDataResults[j].txid;
        const thisUtxoVout = txDataResults[j].details.vout;
        // Iterate over outputs
        for (let k = 0; k < thisUtxoVout.length; k += 1) {
            const thisOutput = thisUtxoVout[k];
            if (thisOutput.scriptPubKey.type === 'nulldata') {
                const asmOutput = thisOutput.scriptPubKey.asm;
                if (asmOutput.includes('OP_RETURN 5262419')) {
                    // then it's an eToken tx that has not been properly validated
                    // Do not include it in nonEtokenUtxos
                    // App will ignore it until SLPDB is able to validate it
                    console.log(
                        `utxo ${thisUtxoTxid} requires further eToken validation, ignoring`,
                    );
                } else {
                    // Otherwise it's just an OP_RETURN tx that SLPDB has some issue with
                    // It should still be in the user's utxo set
                    // Include it in nonEtokenUtxos
                    console.log(
                        `utxo ${thisUtxoTxid} is not an eToken tx, adding to nonSlpUtxos`,
                    );
                    nonEtokenUtxos.push(thisUtxoTxid);
                }
            }
        }
    }
    return nonEtokenUtxos;
};

export const isLegacyMigrationRequired = wallet => {
    // If the wallet does not have Path1899,
    // Or each Path1899, Path145, Path245 does not have a public key
    // Or it is using bitcoincash prefix
    // Then it requires migration
    if (
        !wallet.Path1899 ||
        !wallet.Path1899.publicKey ||
        !wallet.Path145.publicKey ||
        !wallet.Path245.publicKey ||
        wallet.Path1899.cashAddress.split(':')[0] === 'bitcoincash'
    ) {
        return true;
    }

    return false;
};

export const getSlpBalancesAndUtxos = (utxos) => {
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
				token.balance = new BigNumber({...token.balance, _isBigNumber:true}).plus(
					new BigNumber(slpUtxo.slp.value)
				);
			}

		} else {
			token = {};
			token.info = sandboxTokenInfo;
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

export const addredeemData = (tickets, hash, redeemData) => {
	console.log("addredeemData", tickets, hash, redeemData);
	const index = tickets.findIndex(ticket => ticket.redeemTx?.hash === hash);

	console.log("addredeemData index", index);
	tickets[index].details = Object.assign(tickets[index].details, { game: redeemData });

	return tickets;
}

export const addSlpToRedeemTx = (tx) => {
	// input is a TX
	const opReturn = tx.outputs[0].script;
	const slp = new SLP(opReturn);
	const mintRecords = slp.getMintRecords(tx.hash());
	const mintRecordsJson = mintRecords.map(record => record.getJSON());
	const tokenId = slp.getTokenId().toString('hex');
	
	let slpTx = tx.toJSON();
	slpTx.slpToken = { tokenId };

	for (let i = 1; i < tx.outputs.length; i++) {
		const matchedSlpRecord = mintRecordsJson.find(record => record.vout === i);
		if (matchedSlpRecord) 
			slpTx.outputs[i].slp = matchedSlpRecord;
	}

	return slpTx;
}
export const addRedeemUtxos = (slpBalancesAndUtxos, address, tx) => {
	const newSlpBalancesAndUtxos = slpBalancesAndUtxos;
	console.log("tx.outputs", tx.outputs);
	const utxos = tx.outputs.filter(outputs => outputs.address === address);
	console.log("utxos", utxos);
	
	const nonSlpUtxos = utxos.filter(utxo => 
		!utxo.slp || (utxo.slp && utxo.slp.value == '0')
	);
	console.log("nonSlpUtxos", nonSlpUtxos);
	const slpUtxos = utxos.filter(utxo => 
		utxo.slp && ( utxo.slp.value != '0' || utxo.slp.type == 'MINT')
	);
	console.log("slpUtxos", slpUtxos);

	newSlpBalancesAndUtxos.nonSlpUtxos.push(nonSlpUtxos);
	newSlpBalancesAndUtxos.slpUtxos.push(slpUtxos);

	const hasToken = slpBalancesAndUtxos.tokens.length > 0 ? true : false;
	const token = hasToken ? slpBalancesAndUtxos.tokens[0] : {info: sandboxTokenInfo};
	const previousBalance = token.balance ? new BigNumber({...token.balance, _isBigNumber:true }) : BigNumber(0);
	console.log("previousBalance", previousBalance);
	let updatedBalance = previousBalance;

	for (const utxo of slpUtxos) {
		updatedBalance = new BigNumber(updatedBalance).plus(new BigNumber(utxo.slp.value));
		// console.log("altertanative calc 1", (new BigNumber(updatedBalance)).plus(new BigNumber(utxo.slp.value)) )
		// console.log("altertanative calc 2", updatedBalance.plus(new BigNumber(utxo.slp.value)) )
	}
	console.log("updatedBalance", updatedBalance);

	newSlpBalancesAndUtxos.tokens[0].balance = updatedBalance;
	
	return newSlpBalancesAndUtxos;
}