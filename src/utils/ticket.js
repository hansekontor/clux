import { 
    Script, 
    Outpoint, 
    Output,
    script,
    TX,
    MTX,
    bcrypto
} from '@hansekontor/checkout-components';
const { SLP } = script;
const {	Hash256: hash256 } = bcrypto;
import { U64 } from 'n64';
import bio, { read } from 'bufio';


export default class TicketHistory {
    constructor(tickets) {
        this.tickets = tickets;
    }   
    
    async addTicketsFromNode(txs) {
        const matchedTickets = this.matchTickets(txs);
        const sortedTickets = matchedTickets.sort(this.compareTickets);
        const parsedTickets = await this.parseTickets(sortedTickets);

        this.tickets = parsedTickets;
    }

    async addTicketsFromIssuance(txs) {
        const matchedTickets = this.matchTickets(txs);
        // console.log("matchedTickets", matchedTickets)
        const sortedTickets = matchedTickets.sort(this.compareTickets);
        // console.log("sorted Tickets", sortedTickets);
        const parsedTickets = await this.parseTickets(sortedTickets);      
        // console.log("parsedTickets", parsedTickets);

        this.tickets = parsedTickets;
    }

    async addTicketFromRedemption(tx, redeemData) {
        // console.log("addTicketFromRedemption tx", tx, TX.isTX(tx));
        const matchedTickets = this.matchTickets([tx]);
        const sortedTickets = matchedTickets.sort(this.compareTickets);
        const parsedTickets = await this.parseTickets(sortedTickets); 

        // add redeem data to ticket
        const index = parsedTickets.findIndex(ticket => ticket.redeemTx?.hash === tx.hash);
        parsedTickets[index].details = Object.assign(parsedTickets[index].details, { redemption: redeemData });
        
        this.tickets = parsedTickets;
    }

    /**
     * 
     * @param {array} txs 
     * @returns 
     */
    matchTickets(txs) {
        // take new txs as base and add additional info from previous history
        const tickets = this.tickets;

        // add issueTx / redeemTX
        const isEmptyWallet = this.tickets.length === 0;
        if (isEmptyWallet) {
            // if wallet is empty, no matching is required

            for (const txInput of txs) {
                const tx = TX.isTX(txInput) ? txInput.toJSON() : txInput;
                // console.log("matching tx.hash", tx.hash);
                const isRedeemTx = tx.slpToken ? true : false;
                // console.log("isRedeemTx", isRedeemTx);
                // console.log("inspect potential slp output", tx.outputs[2]);

                if (isRedeemTx) {
                    const issueHash = tx.inputs[0].prevout.hash;
                    const redeemed = {
                        issueTx: {
                            hash: issueHash
                        },
                        redeemTx: tx
                    };
                    tickets.push(redeemed);
                } else {
                    const unredeemed = {
                        issueTx: tx
                    };

                    tickets.push(unredeemed);
                }
            }

            return tickets;
        } else {
            const toAdd = [];

            for (const txInput of txs) {
                const tx = TX.isTX(txInput) ? txInput.toJSON() : txInput;
                // console.log("tx", tx.hash);

                const opReturn = SLP.fromRaw(Buffer.from(tx.outputs[0].script, 'hex'));
                const isValidSlp = opReturn.isValidSlp(); 
                // console.log("isValidSlp", isValidSlp);
                const isUnredeemed = tx.slpToken ? false : true;
                // console.log("isUnredeemed", isUnredeemed);

                if (isUnredeemed) {
                    const newTicket = { issueTx: tx };
                    const index = tickets.findIndex(ticket => ticket.issueTx.hash === tx.hash);
                    const isNewUnredeemed = index === -1;
                    // console.log("isNewUnredeemed", isNewUnredeemed);
                    
                    if (isNewUnredeemed) {
                        toAdd.push(newTicket);
                    } else {
                        const oldTicket = tickets[index]
                        tickets[index] = Object.assign(oldTicket, newTicket);
                    }
                } else {
                    const index = tickets.findIndex(ticket => ticket.redeemTx?.hash === tx.hash);
                    // console.log("index", index)
                    const isNewRedeemTx = index === -1;
                    // console.log("matchTickets isNewRedeem", isNewRedeemTx);
                    
                    if (isNewRedeemTx) {
                        const issueHash = tx.inputs[0].prevout.hash;
                        const issueIndex = tickets.findIndex(ticket => ticket.issueTx.hash === issueHash);
                        const hasIssueTx = issueIndex !== -1;
                        if (hasIssueTx) {
                            const oldTicket = tickets[issueIndex];
                            tickets[issueIndex] = Object.assign(oldTicket, { redeemTx: tx});
                        } else {
                            const newTicket = {
                                issueTx: {
                                    hash: issueHash
                                }, 
                                redeemTx: tx
                            };
                            toAdd.push(newTicket);
                        }
                    } else {							
                        const oldTicket = tickets[index];
                        const wasConfirmed = oldTicket.redeemTx.height === -1 && tx.height !== -1;
                        if (wasConfirmed) {
                            tickets[index] = Object.assign(oldTicket, { redeemTx: tx });
                        }
                    }
                }
            }

            const matchedTickets = tickets.concat(toAdd);

            return matchedTickets;
        }
    }

    compareTickets(a,b) {

        if (!a.redeemTx && !b.redeemTx) {	
            
            if (a.issueTx.height === -1)
                return -1
    
            if (b.issueTx.height === -1)
                return 1
    
            if (a.issueTx?.height > b.issueTx?.height) 
                return -1
            
            if (a.issueTx?.height < b.issueTx?.height) 
                return 1		
        } else if (!a.redeemTx) {
            return -1
        } else if (!b.redeemTx) {
            return 1
        }
    
        if (a.redeemTx?.height === -1)
            return -1
    
        if (b.redeemTx?.height === -1)
            return 1
    
        if (a.redeemTx?.height > b.redeemTx?.height)
            return -1
    
        if (a.redeemTx?.height < b.redeemTx?.height)
            return 1
    
        return 0;
    }

    async parseTickets(txs) {
        const tickets = txs;
        // playerNumbers, payoutAmount, redeem sig data
        for (const ticket of tickets) {
            // console.log("parse", ticket);
            const details = ticket.details || {};

            const getTXs = async () => {
                // console.log("GETTXS");
                // console.log(ticket.issueTx?.hex);
                // console.log(ticket.redeemTx?.hex);
                let issueTx = ticket.issueTx?.hex ? MTX.fromRaw(Buffer.from(ticket.issueTx.hex, 'hex')) : false;
                let redeemTx = ticket.redeemTx?.hex ? MTX.fromRaw(Buffer.from(ticket.redeemTx.hex, 'hex')) : false;

                if (!issueTx && redeemTx) {
                    // console.log("conditional")
                    const redeemScript = redeemTx.inputs[0].script;
                    const rawIssueTx = redeemScript.get(5).data;
                    issueTx = MTX.fromRaw(Buffer.from(rawIssueTx));
                    const issueTxJson = issueTx.toJSON();
                    // console.log("issueTxJson", issueTxJson);

                    ticket.issueTx = issueTxJson;				
                }

                return { issueTx, redeemTx };
            }		
            const { issueTx, redeemTx} = await getTXs();
            // console.log("issueTx", issueTx);
            // console.log("redeemTx", redeemTx);

            // parse player numbers from ticket auth code
            if (!details.playerNumbers || !details.maxPayoutBE && issueTx) {
                const opReturn = issueTx.outputs[0].script;
                const ticketAuthCode = opReturn.get(1).data;
                // console.log("ticketAuthCode", ticketAuthCode.toString('hex'))
                const { minterNumbers, txOutputs } = readTicketAuthCode(ticketAuthCode); 

                const minterNumbersArray = [];
                const br = bio.read(minterNumbers);
                for (const byte of minterNumbers) {
                    const minterNumberInt = br.readU8(byte);
                    minterNumbersArray.push(minterNumberInt);
                }
                details.playerNumbers = minterNumbersArray;				

                const maxPayoutBufBE = txOutputs[0].script.code[6].data;
                // console.log("maxPayout", maxPayoutBufBE);
                details.maxPayoutBE = maxPayoutBufBE;
            }

            // parse payout amount from redeem tx
            if (!details.payoutAmount && redeemTx) {
                // console.log("can I get the slp value from this?", redeemTx.outputs[2]);
                const payoutAmount = ticket.redeemTx.outputs[2].slp?.value;
                details.payoutAmount = payoutAmount;
            }

            // add parsed ticket details
            if (!ticket.details) 
                ticket.details = details;
            else 
                ticket.details = Object.assign(ticket.details, details);

        }

        return tickets;
    }
}

export const readAuthCodeMin = (authCode) => {
    const splitCode = authCode.split('-');
    const authCodeB64 = splitCode.length === 2 ? splitCode[1] : authCode;

    const authCodeBuf = Buffer.from(authCodeB64, 'base64');
    const authReader = read(authCodeBuf);
    const txAuthSig = authReader.readVarBytes();
    const authPubKey = authReader.readBytes(33);
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
    const mintQuantityReader = read(txOutputs[0].script.toRaw().slice(46));
    const slpOutputs = txOutputs[0].script.code.slice(5);
    while (mintQuantityReader.getSize() > mintQuantityReader.offset) {
        const valueU64 = U64.fromBE(mintQuantityReader.readVarBytes());
        mintQuantity.iadd(valueU64);
    }

    return {
        version: 2,
        tokenId,
        mintQuantity: mintQuantity.toInt(),
        authCodeBuf,
        authPubKey,
        txAuthSig,
        minterPubKeyHash,
        batonUtxo,
        txSerializedOutputs,
        txOutputs,
    }
}

export const readTicketAuthCode = (authCodeBuf) => {

	const authReader = read(authCodeBuf);
    const txSerializedOutputs = authReader.readBytes(139);
    const raisedBits = authReader.readBytes(4);
    const minterNumbers = authReader.readBytes(4);
    const txAuthSig = authReader.readBytes(authReader.getSize() - authReader.offset);

    const outputsReader = read(txSerializedOutputs);
    const txOutputs = [];
    while (outputsReader.getSize() > outputsReader.offset) {
        txOutputs.push(Output.fromReader(outputsReader))
    }

    return {
        // tokenId,
        txAuthSig,
        raisedBits,
        minterNumbers,
        txSerializedOutputs,
        txOutputs,
    }
}

export const calculatePayout = (ttxHash, blockHash, playerChoiceBytes, maxPayoutBufBE, paytable) => {

    // console.log({ttxHash, blockHash})
    const combineHashes = Buffer.concat([ttxHash, blockHash]);
    const randomNumber = hash256.digest(combineHashes);
    let payoutNum = parseInt(U64.fromBE(maxPayoutBufBE).toString());

    let modSum = 0;
	const resultingNumbers = new Array(4);
	const opponentNumbers = new Array(4);

    for (let i = 0; i < playerChoiceBytes.length; i++) {
        
        const pOffset = 3 - i
        const playerByte = playerChoiceBytes.slice(pOffset, pOffset + 1)
        const offset = 31 - i
        const randomByte = randomNumber.slice(offset, offset + 1)
		const randomNum = randomByte.readUInt8();
		opponentNumbers[i] = randomNum;
        // console.log({playerByte, randomByte})
        const numBuf = Buffer.concat([randomByte, playerByte])
        const number = numBuf.readInt16LE()
        // console.log({numBuf, number})
		resultingNumbers[i] = number % (4 * playerChoiceBytes.length);
        modSum += number % (4 * playerChoiceBytes.length)
    }

    // console.log("modSum", modSum)
    // Paytable zero index pays max amount, the rest divide by 2 and greater than final pays zero
	let tier = paytable.length;
	for (let i = 0; i < paytable.length; i++) {
        if (modSum > paytable[i]) {
            if (i === paytable.length - 1) {
                payoutNum = 0;
				tier = 0;
			} else {
                payoutNum = payoutNum / 2;
				tier = tier - 1;
			}
        }
    }

    const actualPayout = U64.fromInt(payoutNum);
	const actualPayoutBE = actualPayout.toBE(Buffer);

    return { actualPayoutBE, tier, opponentNumbers, resultingNumbers }
}

export const schrodingerOutscript = (authPubKey) => {

    const script = new Script()

        .pushSym('3dup')
        .pushSym('hash256')
        .pushSym('dup')
        .pushSym('rot')
        .pushSym('hash256')
        .pushSym('cat')
        .pushInt(6)
        .pushSym('roll')
        .pushSym('over')
        .pushData(authPubKey)
        .pushSym('dup')
        .pushSym('toaltstack')
        .pushSym('checkdatasigverify') // Verify tx+block signature
        .pushSym('hash256') // Random number

        // Begin dissecting preimage
        .pushSym('rot')
        .pushInt(4)
        .pushSym('split')
        .pushSym('nip')
        .pushInt(32)
        .pushSym('split')
        .pushInt(3)
        .pushSym('roll')
        .pushData(Buffer.from('01000000', 'hex'))
        .pushSym('cat')
        .pushSym('hash256')
        .pushSym('rot')
        .pushSym('equalverify') // Validate single input is from index 0 of ttx outputs
        .pushSym('size')
        .pushInt(40)
        .pushSym('sub')
        .pushSym('split')
        .pushSym('nip')
        .pushInt(32)
        .pushSym('split')
        .pushSym('drop') // Output hash

        // Begin dissecting ttx
        .pushSym('rot')
        .pushInt(5)
        .pushSym('split')
        .pushSym('nip')
        .pushInt(36)
        .pushSym('split')
        .pushInt(1)
        .pushSym('split')
        .pushSym('swap')
        .pushSym('split')
        .pushSym('nip')
        .pushInt(13)
        .pushSym('split')
        .pushSym('nip')
        .pushInt(1)
        .pushSym('split')
        .pushSym('swap')
        .pushData(Buffer.from('00', 'hex'))
        .pushSym('cat')
        .pushSym('split')
        .pushSym('drop')
        .pushInt(3)
        .pushSym('split')
        .pushSym('nip')
        .pushInt(147)
        .pushSym('split')
        .pushSym('rot')
        .pushInt(2)
        .pushSym('pick')
        .pushSym('cat')
        .pushSym('fromaltstack')
        .pushSym('checkdatasigverify')
        .pushInt(139)
        .pushSym('split')
        .pushInt(4)
        .pushSym('split')

        // Begin random number modification
        .pushInt(3)
        .pushSym('split')
        .pushSym('swap')
        .pushInt(2)
        .pushSym('split')
        .pushSym('swap')
        .pushInt(1)
        .pushSym('split')
        .pushInt(7)
        .pushSym('roll')

        // Modulo calculate and sum that solves for signs
        .pushInt(31)
        .pushSym('split')
        .pushSym('rot')
        .pushSym('cat')
        .pushInt(16)
        .pushSym('mod')
        .pushSym('swap')

        .pushInt(30)
        .pushSym('split')
        .pushInt(3)
        .pushSym('roll')
        .pushSym('cat')
        .pushInt(16)
        .pushSym('mod')
        .pushSym('swap')

        .pushInt(29)
        .pushSym('split')
        .pushInt(4)
        .pushSym('roll')
        .pushSym('cat')
        .pushInt(16)
        .pushSym('mod')
        .pushSym('swap')

        .pushInt(28)
        .pushSym('split')
        .pushSym('nip')
        .pushInt(4)
        .pushSym('roll')
        .pushSym('cat')
        .pushInt(16)
        .pushSym('mod')

        .pushSym('add')
        .pushSym('add')
        .pushSym('add')

        // // Original modulo calculate and sum
        // .pushInt(2)
        // .pushSym('split')
        // .pushSym('toaltstack')
        // .pushSym('add')
        // .pushSym('abs')
        // .pushInt(16)
        // .pushSym('mod')
        // .pushSym('swap')
        // .pushSym('fromaltstack')

        // .pushInt(2)
        // .pushSym('split')
        // .pushSym('toaltstack')
        // .pushSym('add')
        // .pushSym('abs')
        // .pushInt(16)
        // .pushSym('mod')
        // .pushSym('add')
        // .pushSym('swap')
        // .pushSym('fromaltstack')

        // .pushInt(2)
        // .pushSym('split')
        // .pushSym('toaltstack')
        // .pushSym('add')
        // .pushSym('abs')
        // .pushInt(16)
        // .pushSym('mod')
        // .pushSym('add')
        // .pushSym('swap')
        // .pushSym('fromaltstack')

        // .pushInt(2)
        // .pushSym('split')
        // .pushSym('drop')
        // .pushSym('add')
        // .pushSym('abs')
        // .pushInt(16)
        // .pushSym('mod')
        // .pushSym('add') //

        .pushSym('rot')
        .pushInt(73)
        .pushSym('split')
        .pushSym('swap')
        .pushInt(65)
        .pushSym('split')
        .pushSym('reversebytes')
        .pushSym('bin2num')
        .pushInt(3)
        .pushSym('roll')
        .pushSym('tuck')

    // Payout Calculation
    const paytable = [1, 5, 7, 12]

    for (let i = 0; i < paytable.length; i++) {

        script.pushInt(paytable[i])
            .pushSym('greaterthanorequal')
            .pushSym('if')
            .pushInt(2)
            .pushSym('div')
            .pushSym('endif')
        // Do OP_OVER unless final and then do OP_SWAP
        if (i === paytable.length - 1) {
            script.pushSym('swap')
        } else {
            script.pushSym('over')
        }
    }

    script.pushInt(36)
        .pushSym('greaterthanorequal')
        .pushSym('if')
        .pushSym('drop')
        .pushData(Buffer.from('00', 'hex'))
        .pushSym('endif')

        .pushInt(8)
        .pushSym('num2bin')
        .pushSym('reversebytes')
        .pushSym('rot')
        .pushSym('cat')
        .pushSym('cat')
        .pushSym('hash256')
        .pushSym('rot')
        .pushSym('equalverify')
        .pushInt(3)
        .pushSym('split')
        .pushSym('dup')
        .pushInt(32)
        .pushSym('swap')
        .pushSym('sub')
        .pushData(Buffer.from('00', 'hex'))
        .pushSym('swap')
        .pushSym('num2bin')
        .pushInt(3)
        .pushSym('roll')
        .pushSym('hash256')
        .pushSym('rot')
        .pushSym('split')
        .pushSym('rot')
        .pushSym('equalverify')
        .pushSym('size')
        .pushInt(3)
        .pushSym('sub')
        .pushSym('split')
        .pushSym('nip')
        .pushData(Buffer.from('00', 'hex'))
        .pushSym('cat')
        .pushSym('bin2num')
        .pushSym('swap')
        .pushData(Buffer.from('00', 'hex'))
        .pushSym('cat')
        .pushSym('bin2num')
        .pushSym('lessthanorequal')
        .pushSym('verify')

    // Begin preimage validation
    // Anyone can spend
    .pushSym('sha256')
    .pushSym('3dup')
    .pushSym('rot')
    .pushSym('size')
    .pushSym('1sub')
    .pushSym('split')
    .pushSym('drop')
    .pushSym('swap')
    .pushSym('rot')
    .pushSym('checkdatasigverify')
    
    .pushSym('drop')
    .pushSym('checksig');
    
    // compile and return
    return script.compile();

}