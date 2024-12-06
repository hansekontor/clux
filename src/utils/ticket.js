import { 
    Script, 
    Outpoint, 
    Output,
    script,
    bcrypto
} from '@hansekontor/checkout-components';
const { SLP } = script;
const {	Hash256: hash256 } = bcrypto;
import { U64 } from 'n64';
import { read } from 'bufio';


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