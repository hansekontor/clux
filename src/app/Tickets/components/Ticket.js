import React, { useState } from "react";

import { Flex } from "@components/Common";
import TicketHeader from "./TicketHeader";
import TicketBody from "./TicketBody";
import { formateTicketData } from "@utils/formateTicketData";

export default function Ticket({ ticket }) {
  const [collapsed, setCollapsed] = useState(true);

  // toggle ticket collapse state
  const handleTicketOnClick = () => {
    setCollapsed((prev) => !prev);
  };

  // format ticket data
  const {
    displayTime,
    redeemDisplayTime,
    issueDisplayTime,
    primaryHash,
    displayPlayerNumbers,
    displayPayoutAmount,
    displayResultingNumbers,
    combinedNumbers,
  } = formateTicketData(ticket);

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
