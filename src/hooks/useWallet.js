/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import useAsyncTimeout from '@hooks/useAsyncTimeout';
import usePrevious from '@hooks/usePrevious';
import useBCH from '@hooks/useBCH';
import BigNumber from 'bignumber.js';
import {
    fromSmallestDenomination,
    loadStoredWallet,
    isValidStoredWallet,
    isLegacyMigrationRequired,
	getSlpBalancesAndUtxos,
	addSlpToRedeemTx,
	addRedeemUtxos,
    removeUsedCoins
} from '@utils/cashMethods';
import { isValidCashtabSettings } from '@utils/validation';
import localforage from 'localforage';
import { currency } from '@components/Common/Ticker';
import isEqual from 'lodash.isequal';
import { infoNotification } from '@components/Common/Notifications';
import cashaddr from 'ecashaddrjs';
import { 
    Mnemonic,
    HDPrivateKey,
    KeyRing,
	TX, 
} from '@hansekontor/checkout-components';
import TicketHistory from '@utils/ticket';


const useWallet = () => {
    const [wallet, setWallet] = useState(false);
    const [cashtabSettings, setCashtabSettings] = useState(false);
    const [apiError, setApiError] = useState(false);
    const {
        getTicketData,
    } = useBCH();
    const [loading, setLoading] = useState(true);
    const { balances, tokens, utxos } = isValidStoredWallet(wallet)
        ? wallet.state
        : {
              balances: {},
              tokens: [],
              utxos: null,
			//   slpBalancesAndUtxos: {},
			//   tokenUtxos: [],
			//   tokenBalance: 0,
			//   tickets: [],
          };
    const previousBalances = usePrevious(balances);
    const previousTokens = usePrevious(tokens);

	// console.log("useWallet tickets", wallet?.state?.tickets.length);


	const sleep = (ms) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

    const normalizeBalance = slpBalancesAndUtxos => {
        const totalBalanceInSatoshis = slpBalancesAndUtxos.nonSlpUtxos.reduce(
            (previousBalance, utxo) => previousBalance + utxo.value,
            0,
        );
        return {
            totalBalanceInSatoshis,
            totalBalance: fromSmallestDenomination(totalBalanceInSatoshis),
        };
    };

    const deriveAccount = async ({ masterHDNode, path }) => {
        const node = masterHDNode.derivePath(path);
        const publicKey = node.toPublic().publicKey.toString('hex');
        const keyring = KeyRing.fromPrivate(node.privateKey);
        const cashAddress = keyring.getAddress('string');
        const decodedAddress = cashaddr.decode(cashAddress);
        const slpAddress = cashaddr.encode(
            'etoken', 
            decodedAddress.type, 
            decodedAddress.hash
        );

        return {
            publicKey,
            cashAddress,
            slpAddress,
            fundingWif: keyring.toSecret(),
            fundingAddress: slpAddress,
            legacyAddress: keyring.getAddress('base58'),
        };
    };

	const loadWalletFromStorageOnStartup = async () => {
		console.log("loadWalletFromStorageOnStartup");
        // get wallet object from localforage
        const wallet = await getWallet();
		console.log(wallet);
        // If wallet object in storage is valid, it is set as wallet
		const isValid = isValidStoredWallet(wallet);
		console.log("LWFSOS isValid", isValid);
		if (isValid) {
			// console.log("isValidStoredWallet", true);
            // Convert all the token balance figures to big numbers
            const liveWalletState = loadStoredWallet(wallet.state);
			console.log("livewalletState", liveWalletState)
			wallet.state = liveWalletState;

            // setWallet(wallet);
			// console.log("VALID WALLET FROM STORAGE ON STARTUP")
            return wallet;
        } else {
			// console.log("NO/INVALID WALLET FROM STORAGE ON STARTUP")
			return false;
		}

	};

    const update = async ({ wallet }) => {
        // const ms = new Date().getTime();
        // console.log(`update.${ms}`);
        // console.time(`update.${ms}`);
		console.log("update()");
        try {
            if (!wallet) {
                return;
            }

			const ticketData = await getTicketData(wallet.Path1899.cashAddress);
			
			const utxosHaveChanged = !isEqual(ticketData.tokenUtxos, wallet?.state?.utxos)
			const slpBalancesAndUtxos = getSlpBalancesAndUtxos(ticketData.utxos);
            const ticketHistory = new TicketHistory(wallet.state.tickets);
            await ticketHistory.addTicketsFromNode(ticketData.txs);

            if (typeof slpBalancesAndUtxos === 'undefined') {
                console.log(`slpBalancesAndUtxos is undefined`);
                throw new Error('slpBalancesAndUtxos is undefined');
            }
			
			const { tokens } = slpBalancesAndUtxos;

			const newState = {
                balances: {},
				utxos: [],
                tokens: [],
                slpBalancesAndUtxos: [],
				tickets: []
            };

			newState.slpBalancesAndUtxos = slpBalancesAndUtxos;

            newState.balances = normalizeBalance(slpBalancesAndUtxos);

            newState.tokens = tokens;

            newState.tickets = ticketHistory.tickets;

            newState.utxos = ticketData.utxos;

            // Set wallet with new state field
            wallet.state = newState;
            // console.log('wallet.state', wallet.state);
            setWallet(wallet);

            // Write this state to indexedDb using localForage
            await writeWalletState(wallet, newState);
            // If everything executed correctly, remove apiError
            setApiError(false);
        } catch (error) {
            console.log(`Error in update({wallet})`);
            console.log(error);
            // Set this in state so that transactions are disabled until the issue is resolved
            setApiError(true);
            // console.timeEnd(`update.${ms}`);
        }
        // console.log("wallet state updated")
        // console.timeEnd(`update.${ms}`);
    };

	const addIssueTxs = async (txs, coinsUsed) => {
		try {
            console.log("adding unredeemed", txs)
            const ticketHistory = new TicketHistory(wallet.state.tickets);
            await ticketHistory.addTicketsFromIssuance(txs);
            console.log("added to history:", ticketHistory.tickets);

            let newState;
            if (coinsUsed.length > 0) {
                const newSlpBalancesAndUtxos = removeUsedCoins(wallet.state.slpBalancesAndUtxos, coinsUsed);
                newState = Object.assign(wallet.state, { tickets: ticketHistory.tickets, slpBalancesAndUtxos: newSlpBalancesAndUtxos });
            } else {
                newState = Object.assign(wallet.state, { tickets: ticketHistory.tickets });
            }

            console.log("newState", newState);

			wallet.state = newState;
			setWallet(wallet);		

			await writeWalletState(wallet, newState);
			setApiError(false);	
		} catch (error) {
			console.log(`Error in addIssueTx(txs)`);
            console.log(error);
            // Set this in state so that transactions are disabled until the issue is resolved
            setApiError(true);
            // console.timeEnd(`update.${ms}`);		
		}
	}
	const addMinedTicketToStorage = async (issueHash, minedTicket) => {
		try {
			const newTickets = wallet?.state?.tickets;
			const index = newTickets.findIndex(ticket => ticket.issueTx.hash === issueHash);

			newTickets[index].details.minedTicket = minedTicket;
			const issueTx = TX.fromRaw(Buffer.from(minedTicket.hex, 'hex'));
			newTickets[index].issueTx = issueTx.toJSON();

			const newState = Object.assign(wallet.state, { tickets: newTickets})
			wallet.state = newState;

			setWallet(wallet);
			await writeWalletState(wallet, newState);		
			setApiError(false);	
		} catch(error) {
			console.log("Error in addMinedTicketToStorage");
			console.log(error);
			setApiError(true);
		}
	}
	// todo: integrate with addIssueTxsToStorage 
	const addRedeemTxToStorage = async (tx, redeemData) => {
		try {
			// tx comes from self-built redeem hex in WaitingRoom.js and has no slp data, therefore it has to be added
			const slpTx = addSlpToRedeemTx(tx);
			console.log("addRedeem slpTx", slpTx);
            const ticketHistory = new TicketHistory(wallet.state.tickets);
            await ticketHistory.addTicketFromRedemption(slpTx, redeemData);
			const newSlpBalancesAndUtxos = addRedeemUtxos(wallet.state.slpBalancesAndUtxos, wallet.Path1899.cashAddress, slpTx);
			const newState = Object.assign(wallet.state, { tickets: ticketHistory.tickets, slpBalancesAndUtxos: newSlpBalancesAndUtxos });
			wallet.state = newState;
			setWallet(wallet);		
			writeWalletState(wallet, newState);
			setApiError(false);	
		} catch (error) {
			console.log(`Error in addRedeemTx(txs)`);
            console.log(error);
            // Set this in state so that transactions are disabled until the issue is resolved
            setApiError(true);
            // console.timeEnd(`update.${ms}`);		
		}
	}

    const getActiveWalletFromLocalForage = async () => {
        let wallet;
        try {
            wallet = await localforage.getItem('wallet');
            // console.log("getActiveWalletFromLocalForage localforage wallet", wallet);
        } catch (err) {
            console.log(`Error in getActiveWalletFromLocalForage`, err);
            wallet = null;
        }
        return wallet;
    };

    const getWallet = async () => {
        let wallet;
        let existingWallet;
        try {
            existingWallet = await getActiveWalletFromLocalForage();
            // existing wallet will be
            // 1 - the 'wallet' value from localForage, if it exists
            // 2 - false if it does not exist in localForage
            // 3 - null if error

            // If the wallet does not have Path1899, add it
            // or each Path1899, Path145, Path245 does not have a public key, add them
            if (existingWallet) {
                if (isLegacyMigrationRequired(existingWallet)) {
                    console.log(
                        `Wallet does not have Path1899 or does not have public key`,
                    );
                    existingWallet = await migrateLegacyWallet(
                        existingWallet,
                    );
					console.log("migrated existing wallet", existingWallet);
                }
            }

            // If not in localforage then existingWallet = false, check localstorage
            if (!existingWallet) {
                existingWallet = JSON.parse(
                    window.localStorage.getItem('wallet'),
                );
                // If you find it here, move it to indexedDb
                if (existingWallet !== null) {
                    wallet = await getWalletDetails(existingWallet);
                    await localforage.setItem('wallet', wallet);
                    return wallet;
                }
            }
        } catch (err) {
            console.log(`Error in getWallet()`, err);
            /* 
            Error here implies problem interacting with localForage or localStorage API
            
            Have not seen this error in testing

            In this case, you still want to return 'wallet' using the logic below based on 
            the determination of 'existingWallet' from the logic above
            */
        }

        if (existingWallet === null || !existingWallet) {
            wallet = await getWalletDetails(existingWallet);
			console.log("GET WALLET SET FROM WALLET DETAILS", wallet);
            await localforage.setItem('wallet', wallet);
        } else {
            wallet = existingWallet;
        }
        return wallet;
    };

    const migrateLegacyWallet = async (wallet) => {
        const NETWORK = process.env.REACT_APP_NETWORK;
        const mnemonic = wallet.mnemonic;
        const masterHDNode = HDPrivateKey.fromPhrase(mnemonic);

        const Path245 = await deriveAccount({
            masterHDNode,
            path: "m/44'/245'/0'/0/0",
        });
        const Path145 = await deriveAccount({
            masterHDNode,
            path: "m/44'/145'/0'/0/0",
        });
        const Path1899 = await deriveAccount({
            masterHDNode,
            path: "m/44'/1899'/0'/0/0",
        });

        wallet.Path245 = Path245;
        wallet.Path145 = Path145;
        wallet.Path1899 = Path1899;

        try {
            await localforage.setItem('wallet', wallet);
        } catch (err) {
            console.log(
                `Error setting wallet to wallet indexedDb in migrateLegacyWallet()`,
            );
            console.log(err);
        }

        return wallet;
    };

    const writeWalletState = async (wallet, newState) => {
		console.log("writeWalletState", wallet?.state, newState);
        // Add new state as an object on the active wallet
        wallet.state = newState;
        try {
            await localforage.setItem('wallet', wallet);
        } catch (err) {
            console.log(`Error in writeWalletState()`);
            console.log(err);
        }
    };

    const getWalletDetails = async wallet => {
        if (!wallet) {
            return false;
        }
        // Since this info is in localforage now, only get the var
        const NETWORK = process.env.REACT_APP_NETWORK;
        const mnemonic = wallet.mnemonic;
        const masterHDNode = HDPrivateKey.fromPhrase(mnemonic);

        const Path245 = await deriveAccount({
            masterHDNode,
            path: "m/44'/245'/0'/0/0",
        });
        const Path145 = await deriveAccount({
            masterHDNode,
            path: "m/44'/145'/0'/0/0",
        });
        const Path1899 = await deriveAccount({
            masterHDNode,
            path: "m/44'/1899'/0'/0/0",
        });

        let name = Path1899.cashAddress.slice(12, 17);
        // Only set the name if it does not currently exist
        if (wallet && wallet.name) {
            name = wallet.name;
        }

        return {
            mnemonic: wallet.mnemonic,
            name,
            Path245,
            Path145,
            Path1899,
        };
    };

    const getSavedWallets = async activeWallet => {
        let savedWallets;
        try {
            savedWallets = await localforage.getItem('savedWallets');
            if (savedWallets === null) {
                savedWallets = [];
            }
        } catch (err) {
            console.log(`Error in getSavedWallets`);
            console.log(err);
            savedWallets = [];
        }
        // Even though the active wallet is still stored in savedWallets, don't return it in this function
        for (let i = 0; i < savedWallets.length; i += 1) {
            if (
                typeof activeWallet !== 'undefined' &&
                activeWallet.name &&
                savedWallets[i].name === activeWallet.name
            ) {
                savedWallets.splice(i, 1);
            }
        }
        return savedWallets;
    };

    const activateWallet = async walletToActivate => {
        /*
    If the user is migrating from old version to this version, make sure to save the activeWallet

    1 - check savedWallets for the previously active wallet
    2 - If not there, add it
    */
        let currentlyActiveWallet;
        try {
            currentlyActiveWallet = await localforage.getItem('wallet');
        } catch (err) {
            console.log(
                `Error in localforage.getItem("wallet") in activateWallet()`,
            );
            return false;
        }
        // Get savedwallets
        let savedWallets;
        try {
            savedWallets = await localforage.getItem('savedWallets');
        } catch (err) {
            console.log(
                `Error in localforage.getItem("savedWallets") in activateWallet()`,
            );
            return false;
        }
        /*
        When a legacy user runs cashtab.com/, their active wallet will be migrated to Path1899 by 
        the getWallet function. getWallet function also makes sure that each Path has a public key

        Wallets in savedWallets are migrated when they are activated, in this function

        Two cases to handle

        1 - currentlyActiveWallet has Path1899, but its stored keyvalue pair in savedWallets does not
            > Update savedWallets so that Path1899 is added to currentlyActiveWallet
        
        2 - walletToActivate does not have Path1899
            > Update walletToActivate with Path1899 before activation

        NOTE: since publicKey property is added later,
        wallet without public key in Path1899 is also considered legacy and required migration.
        */

        // Need to handle a similar situation with state
        // If you find the activeWallet in savedWallets but without state, resave active wallet with state
        // Note you do not have the Case 2 described above here, as wallet state is added in the update() function of useWallet.js
        // Also note, since state can be expected to change frequently (unlike path deriv), you will likely save it every time you activate a new wallet
        // Check savedWallets for currentlyActiveWallet
        let walletInSavedWallets = false;
        for (let i = 0; i < savedWallets.length; i += 1) {
            if (savedWallets[i].name === currentlyActiveWallet.name) {
                walletInSavedWallets = true;
                // Check savedWallets for unmigrated currentlyActiveWallet
                if (isLegacyMigrationRequired(savedWallets[i])) {
                    // Case 1, described above
                    savedWallets[i].Path1899 = currentlyActiveWallet.Path1899;
                    savedWallets[i].Path145 = currentlyActiveWallet.Path145;
                    savedWallets[i].Path245 = currentlyActiveWallet.Path245;
                }

                /*
                Update wallet state
                Note, this makes previous `walletUnmigrated` variable redundant
                savedWallets[i] should always be updated, since wallet state can be expected to change most of the time
                */
                savedWallets[i].state = currentlyActiveWallet.state;
            }
        }

        // resave savedWallets
        try {
            // Set walletName as the active wallet
            await localforage.setItem('savedWallets', savedWallets);
        } catch (err) {
            console.log(
                `Error in localforage.setItem("savedWallets") in activateWallet() for unmigrated wallet`,
            );
        }

        if (!walletInSavedWallets) {
            console.log(`Wallet is not in saved Wallets, adding`);
            savedWallets.push(currentlyActiveWallet);
            // resave savedWallets
            try {
                // Set walletName as the active wallet
                await localforage.setItem('savedWallets', savedWallets);
            } catch (err) {
                console.log(
                    `Error in localforage.setItem("savedWallets") in activateWallet()`,
                );
            }
        }
        // If wallet does not have Path1899, add it
        // or each of the Path1899, Path145, Path245 does not have a public key, add them
        // by calling migrateLagacyWallet()
        if (isLegacyMigrationRequired(walletToActivate)) {
            // Case 2, described above
            console.log(
                `Case 2: Wallet to activate does not have Path1899 or does not have public key in each Path`,
            );
            console.log(
                `Wallet to activate from SavedWallets does not have Path1899 or does not have public key in each Path`,
            );
            console.log(`walletToActivate`, walletToActivate);
            walletToActivate = await migrateLegacyWallet(walletToActivate);
        } else {
            // Otherwise activate it as normal
            // Now that we have verified the last wallet was saved, we can activate the new wallet
            try {
                await localforage.setItem('wallet', walletToActivate);
            } catch (err) {
                console.log(
                    `Error in localforage.setItem("wallet", walletToActivate) in activateWallet()`,
                );
                return false;
            }
        }
        // Make sure stored wallet is in correct format to be used as live wallet
        if (isValidStoredWallet(walletToActivate)) {
            // Convert all the token balance figures to big numbers
            const liveWalletState = loadStoredWallet(walletToActivate.state);
            walletToActivate.state = liveWalletState;
        }

        return walletToActivate;
    };

    const renameWallet = async (oldName, newName) => {
        // Load savedWallets
        let savedWallets;
        try {
            savedWallets = await localforage.getItem('savedWallets');
        } catch (err) {
            console.log(
                `Error in await localforage.getItem("savedWallets") in renameWallet`,
            );
            console.log(err);
            return false;
        }
        // Verify that no existing wallet has this name
        for (let i = 0; i < savedWallets.length; i += 1) {
            if (savedWallets[i].name === newName) {
                // return an error
                return false;
            }
        }

        // change name of desired wallet
        for (let i = 0; i < savedWallets.length; i += 1) {
            if (savedWallets[i].name === oldName) {
                // Replace the name of this entry with the new name
                savedWallets[i].name = newName;
            }
        }
        // resave savedWallets
        try {
            // Set walletName as the active wallet
            await localforage.setItem('savedWallets', savedWallets);
        } catch (err) {
            console.log(
                `Error in localforage.setItem("savedWallets", savedWallets) in renameWallet()`,
            );
            return false;
        }
        return true;
    };

    const deleteWallet = async walletToBeDeleted => {
        // delete a wallet
        // returns true if wallet is successfully deleted
        // otherwise returns false
        // Load savedWallets
        let savedWallets;
        try {
            savedWallets = await localforage.getItem('savedWallets');
        } catch (err) {
            console.log(
                `Error in await localforage.getItem("savedWallets") in deleteWallet`,
            );
            console.log(err);
            return false;
        }
        // Iterate over to find the wallet to be deleted
        // Verify that no existing wallet has this name
        let walletFoundAndRemoved = false;
        for (let i = 0; i < savedWallets.length; i += 1) {
            if (savedWallets[i].name === walletToBeDeleted.name) {
                // Verify it has the same mnemonic too, that's a better UUID
                if (savedWallets[i].mnemonic === walletToBeDeleted.mnemonic) {
                    // Delete it
                    savedWallets.splice(i, 1);
                    walletFoundAndRemoved = true;
                }
            }
        }
        // If you don't find the wallet, return false
        if (!walletFoundAndRemoved) {
            return false;
        }

        // Resave savedWallets less the deleted wallet
        try {
            // Set walletName as the active wallet
            await localforage.setItem('savedWallets', savedWallets);
        } catch (err) {
            console.log(
                `Error in localforage.setItem("savedWallets", savedWallets) in deleteWallet()`,
            );
            return false;
        }
        return true;
    };

    const addNewSavedWallet = async importMnemonic => {
        // Add a new wallet to savedWallets from importMnemonic or just new wallet
        const lang = 'english';
        // create 128 bit BIP39 mnemonic
        const Bip39128BitMnemonic = importMnemonic
            ? importMnemonic
            : new Mnemonic( {language:lang} );
        const newSavedWallet = await getWalletDetails({
            mnemonic: Bip39128BitMnemonic.toString(),
        });
        // Get saved wallets
        let savedWallets;
        try {
            savedWallets = await localforage.getItem('savedWallets');
            // If this doesn't exist yet, savedWallets === null
            if (savedWallets === null) {
                savedWallets = [];
            }
        } catch (err) {
            console.log(
                `Error in savedWallets = await localforage.getItem("savedWallets") in addNewSavedWallet()`,
            );
            console.log(err);
            console.log(`savedWallets in error state`, savedWallets);
        }
        // If this wallet is from an imported mnemonic, make sure it does not already exist in savedWallets
        if (importMnemonic) {
            for (let i = 0; i < savedWallets.length; i += 1) {
                // Check for condition "importing new wallet that is already in savedWallets"
                if (savedWallets[i].mnemonic === importMnemonic) {
                    // set this as the active wallet to keep name history
                    console.log(
                        `Error: this wallet already exists in savedWallets`,
                    );
                    console.log(`Wallet not being added.`);
                    return false;
                }
            }
        }
        // add newSavedWallet
        savedWallets.push(newSavedWallet);
        // update savedWallets
        try {
            await localforage.setItem('savedWallets', savedWallets);
        } catch (err) {
            console.log(
                `Error in localforage.setItem("savedWallets", activeWallet) called in createWallet with ${importMnemonic}`,
            );
            console.log(`savedWallets`, savedWallets);
            console.log(err);
        }
        return true;
    };

    const createWallet = async importMnemonic => {
        const lang = 'english';
        // create 128 bit BIP39 mnemonic
        const Bip39128BitMnemonic = importMnemonic
            ? importMnemonic
            : new Mnemonic( {language:lang} );
        const wallet = await getWalletDetails({
            mnemonic: Bip39128BitMnemonic.toString(),
        });
		// set initial state so that only valid wallets are usually stored
		const initialState = {
			balances: {},
			utxos: [],
			tokens: [],
			slpBalancesAndUtxos: [],
			tickets: [], 
		};
		wallet.state = initialState;

		console.log("createWallet() wallet", wallet);

        try {
            await localforage.setItem('wallet', wallet);
            console.log("createWallet() wallet set in localforage", wallet);
        } catch (err) {
            console.log(
                `Error setting wallet to wallet indexedDb in createWallet()`,
            );
            console.log(err);
        }

		// todo: is this necessary?
		// try {
        //     await localforage.setItem('savedWallets', [wallet]);
        // } catch (err) {
        //     console.log(
        //         `Error setting wallet to savedWallets indexedDb in createWallet()`,
        //     );
        //     console.log(err);
        // }

		return wallet;
    };

    const validateMnemonic = (mnemonic) => {
        let mnemonicTestOutput;

        try {
            mnemonicTestOutput = Mnemonic.fromPhrase(mnemonic);

            if (mnemonicTestOutput.toString() === mnemonic) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    };

	const handleLoadWallet = async setWallet => {
        await loadWalletFromStorageOnStartup(setWallet);
    };

    // const handleUpdateWallet = async setWallet => {
    //     console.log("handleUpdateWallet called")
    //     const walletFromStorage = await loadWalletFromStorageOnStartup(setWallet);
	// 	if (!walletFromStorage) {
	// 		const testMnemonic = "math poverty speak lumber giant yellow crack element drill program crane maid";
	// 		const newWallet = await createWallet(testMnemonic);
	// 		newWallet.state = initialWalletState;
	// 		console.log("created a new Wallet", newWallet);
	// 		setWallet(newWallet);
	// 	}

	// 	setLoading(false);
    // };

    const loadCashtabSettings = async () => {
        // get settings object from localforage
        let localSettings;
        try {
            localSettings = await localforage.getItem('settings');
            // If there is no keyvalue pair in localforage with key 'settings'
            if (localSettings === null) {
                // Create one with the default settings from Ticker.js
                localforage.setItem('settings', currency.defaultSettings);
                // Set state to default settings
                setCashtabSettings(currency.defaultSettings);
                return currency.defaultSettings;
            }
        } catch (err) {
            console.log(`Error getting cashtabSettings`, err);
            // TODO If they do not exist, write them
            // TODO add function to change them
            setCashtabSettings(currency.defaultSettings);
            return currency.defaultSettings;
        }
        // If you found an object in localforage at the settings key, make sure it's valid
        if (isValidCashtabSettings(localSettings)) {
            setCashtabSettings(localSettings);
            return localSettings;
        }
        // if not valid, also set cashtabSettings to default
        setCashtabSettings(currency.defaultSettings);
        return currency.defaultSettings;
    };


    const changeCashtabSettings = async (key, newValue) => {
        // Set loading to true as you do not want to display the fiat price of the last currency
        // loading = true will lock the UI until the fiat price has updated
        setLoading(true);
        // Get settings from localforage
        let currentSettings;
        let newSettings;
        try {
            currentSettings = await localforage.getItem('settings');
        } catch (err) {
            console.log(`Error in changeCashtabSettings`, err);
            // Set fiat price to null, which disables fiat sends throughout the app
            // setFiatPrice(null);
            // Unlock the UI
            setLoading(false);
            return;
        }
        // Make sure function was called with valid params
        if (
            Object.keys(currentSettings).includes(key) &&
            currency.settingsValidation[key].includes(newValue)
        ) {
            // Update settings
            newSettings = currentSettings;
            newSettings[key] = newValue;
        }
        // Set new settings in state so they are available in context throughout the app
        setCashtabSettings(newSettings);
        // Write new settings in localforage
        try {
            await localforage.setItem('settings', newSettings);
        } catch (err) {
            console.log(
                `Error writing newSettings object to localforage in changeCashtabSettings`,
                err,
            );
            console.log(`newSettings`, newSettings);
            // do nothing. If this happens, the user will see default currency next time they load the app.
        }
        setLoading(false);
    };

    const forceWalletUpdate = async () => {
        const wallet = await getWallet();
        return await update({ wallet });
    }

    // Update wallet state every 5s
    useAsyncTimeout(async () => {
		if (wallet && isValidStoredWallet(wallet)) {
			const wallet = await getWallet();
			setWallet(wallet);
			setLoading(false);		
		} 		
    }, 5000);


	// load wallet on start up
    useEffect(async () => {
		await sleep(3000);
		console.log("useWallet useEffect");
		console.log("GET WALLET FROM STORAGE")
		const walletFromStorage = await loadWalletFromStorageOnStartup();
		if (walletFromStorage) {
			console.log("WALLETFROMSTORAGE", walletFromStorage)
			console.log("useWallet useEffect isValid", isValidStoredWallet(walletFromStorage));
			setWallet(walletFromStorage);
		} else {
			const newWallet = await createWallet();
			console.log("NEWWALLET", newWallet);
			console.log("useWallet useEffect isValid", isValidStoredWallet(newWallet));
            setWallet(newWallet);
		}

		setLoading(false);	
    }, []);


    return {
        wallet,
        // fiatPrice,
        loading,
        apiError,
        cashtabSettings,
        changeCashtabSettings,
        getActiveWalletFromLocalForage,
        forceWalletUpdate,
        validateMnemonic,
        getWalletDetails,
        getSavedWallets,
        migrateLegacyWallet,
        createWallet: async (importMnemonic) => {
            console.log("prototype createWallet called")
            setLoading(true);
            const newWallet = await createWallet(importMnemonic);
            setWallet(newWallet);
			// if import wallet was used get existing tickets and balance
			if (importMnemonic) {
				update({
					wallet: newWallet,
				}).finally(() => setLoading(false));				
			} else {
				setLoading(false);
			}

        },
        activateWallet: async walletToActivate => {
            setLoading(true);
            const newWallet = await activateWallet(walletToActivate);
            setWallet(newWallet);
            if (isValidStoredWallet(walletToActivate)) {
                // If you have all state parameters needed in storage, immediately load the wallet
                setLoading(false);
            } else {
                // If the wallet is missing state parameters in storage, wait for API info
                // This handles case of unmigrated legacy wallet
                update({
                    wallet: newWallet,
                }).finally(() => setLoading(false));
            }
        },
        addNewSavedWallet,
        renameWallet,
        deleteWallet,
		addIssueTxs, 
		addMinedTicketToStorage,
		addRedeemTxToStorage,
    };
};

export default useWallet;