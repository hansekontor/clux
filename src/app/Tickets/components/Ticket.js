import React, { useState } from "react";

import { Flex } from "@components/Common";
import TicketHeader from "./TicketHeader";
import TicketBody from "./TicketBody";

export default function Ticket({ ticket }) {
  const [collapsed, setCollapsed] = useState(true);
  const [combinedNumbers, setCombinedNumbers] = useState(false);

  // toggle ticket collapse state
  const handleTicketOnClick = () => {
    setCollapsed((prev) => !prev);
  };

  // get redeem utc string -- CAN WE PUT THIS IN THE SDK?
  let displayTime = false;
  let redeemDisplayTime = false;
  if (ticket.redeemTx?.time && !redeemDisplayTime) {
    const date = new Date(ticket.redeemTx.time * 1000);
    const displayTime = date.toUTCString();
    redeemDisplayTime = displayTime;
  }

  // get issue utc string -- CAN WE PUT THIS IN THE SDK?
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
    ticket.parsed?.playerNumbers &&
    !combinedNumbers
  ) {
    const combined = [];
    for (let i = 0; i < 4; i++) {
      const buf = Buffer.alloc(2);
      buf.writeUInt8(ticket.parsed.opponentNumbers[i], 0);
      buf.writeUInt8(ticket.parsed.playerNumbers[i], 1);
      const combinedNum = buf.readInt16LE();
      combined.push(combinedNum);
    }
    setCombinedNumbers(combined);
  }

  return (
    <Flex
      borderRadius="sm"
      backgroundColor="white"
      boxShadow={2}
      alignItems="start"
      direction="column"
    >
      <TicketHeader
        ticket={ticket}
        primaryHash={primaryHash}
        displayTime={displayTime}
        collapsed={collapsed}
        handleTicketOnClick={handleTicketOnClick}
      />
      <TicketBody
        issueDisplayTime={issueDisplayTime}
        ticket={ticket}
        displayPlayerNumbers={displayPlayerNumbers}
        collapsed={collapsed}
        redeemDisplayTime={redeemDisplayTime}
        displayPayoutAmount={displayPayoutAmount}
        displayResultingNumbers={displayResultingNumbers}
        combinedNumbers={combinedNumbers}
      />
    </Flex>
  );
}
