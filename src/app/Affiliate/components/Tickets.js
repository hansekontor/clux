import React from "react";

import { Flex } from "@components/Common";
import Ticket from "./Ticket";

const ticketActivity = Array.from({ length: 15 });

export default function Tickets() {
  return (
    <Flex direction="column" gap={1}>
      {ticketActivity.map((_, index) => (
        <Ticket key={index} />
      ))}

      <Flex minHeight="16px" />
    </Flex>
  );
}
