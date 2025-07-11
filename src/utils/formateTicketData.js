export function formateTicketData(ticket, isAffiliate=false) {
  // get redeem utc string
  let displayTime = false;

  if (isAffiliate) {
    const date = new Date(ticket.time * 1000);
    displayTime = date.toUTCString().slice(0, 16);
    const displayAffiliateAmount = ticket.outputs[1].slp.value / 100;
    const primaryHash = ticket.hash;

    return {
      primaryHash, 
      displayTime, 
      displayAffiliateAmount
    };
  }

  let redeemDisplayTime = false;
  let combinedNumbers;

  if (ticket.redeemTx?.time && !redeemDisplayTime) {
    const date = new Date(ticket.redeemTx.time * 1000);
    const displayTime = date.toUTCString();
    redeemDisplayTime = displayTime;
  }

  // get issue utc string 
  let issueDisplayTime = false;
  if (ticket.issueTx?.time) {
    const date = new Date(ticket.issueTx.time * 1000);
    const displayTime = date.toUTCString();
    issueDisplayTime = displayTime;
  }

  if (redeemDisplayTime) displayTime = redeemDisplayTime.slice(0, 16);
  else if (issueDisplayTime) displayTime = issueDisplayTime.slice(0, 16);

  const primaryHash = ticket.redeemTx
    ? ticket.redeemTx?.hash
    : ticket.issueTx?.hash;
  const displayPlayerNumbers = ticket.parsed?.playerNumbers?.join(", ");
  const displayPayoutAmount = ticket.parsed?.payoutAmount / 100;
  const displayResultingNumbers =
    ticket.parsed?.game?.resultingNumbers?.join(", ");

  if (
    ticket.parsed?.opponentNumbers &&
    ticket.parsed?.playerNumbers
  ) {
    const combined = [];
    for (let i = 0; i < 4; i++) {
      const buf = Buffer.alloc(2);
      buf.writeUInt8(ticket.parsed.opponentNumbers[i], 0);
      buf.writeUInt8(ticket.parsed.playerNumbers[i], 1);
      const combinedNum = buf.readInt16LE();
      combined.push(combinedNum);
    }
    combinedNumbers = combined;
  }


  return {
    displayTime,
    redeemDisplayTime,
    issueDisplayTime,
    primaryHash,
    displayPlayerNumbers,
    displayPayoutAmount,
    displayAffiliateAmount,
    displayResultingNumbers,
    combinedNumbers,
  };
}
