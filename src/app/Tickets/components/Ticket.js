import React, { useState } from "react";

// core functions
import { useApp } from "blocklotto-sdk";

import { Flex } from "@components/Common";
import TicketHeader from "./TicketHeader";
import TicketBody from "./TicketBody";

export default function Ticket({ ticket }) {
  const { getFormattedTicketData } = useApp();
  const [collapsed, setCollapsed] = useState(true);

  const {
    displayTime,
    issueDisplayTime,
    redeemDisplayTime,
    primaryHash,
    displayPlayerNumbers,
    displayPayoutAmount,
    displayResultingNumbers,
    combinedNumbers,
  } = getFormattedTicketData(ticket);

  // toggle ticket collapse state
  const handleTicketOnClick = () => {
    setCollapsed((prev) => !prev);
  };

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
