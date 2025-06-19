import React from "react";

import { TicketIcon, ArrowHeadRightIcon } from "@components/Icons";
import { Flex } from "@components/Common";
import Typography from "@components/Typography";
import IconButton from "@components/IconButton";

const shortifyHash = (hash, length) => {
  return String(hash.slice(0, length) + "..." + hash.slice(64 - length));
};

export default function TicketHeader({
  ticket,
  primaryHash,
  displayTime,
  handleTicketOnClick,
  collapsed = true,
}) {
  const hasPayout = ticket.parsed?.payoutAmount !== undefined;
  const isWinner = ticket.parsed?.payoutAmount > 0;
  const isReadyToRedeem = ticket.issueTx?.height > 0;

  const ticketColor = () => {
    if (hasPayout) {
      if (isWinner) {
        return "success.main";
      } else {
        return "secondary.main";
      }
    } else {
      if (isReadyToRedeem) {
        return "primary.main";
      } else {
        return "tertiary.main";
      }
    }
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      gap={2}
      padding={2}
      paddingBottom={1}
      paddingTop={1}
      onClick={handleTicketOnClick}
      style={{ cursor: "pointer" }}
    >
      <Flex justifyContent="space-between" alignItems="center" gap={2}>
        <Flex
          borderRadius="full"
          backgroundColor={ticketColor()}
          color="white"
          padding={1}
          boxShadow={2}
        >
          <TicketIcon />
        </Flex>

        <Flex direction="column">
          <Flex gap={1} alignItems="center">
            <Typography>Ticket</Typography>
            <Typography variant="body2">
              {shortifyHash(primaryHash, 4)}
            </Typography>
          </Flex>

          <Flex gap={2}>
            <Typography variant="body2">{displayTime}</Typography>
          </Flex>
        </Flex>
      </Flex>

      <IconButton>
        <ArrowHeadRightIcon
          style={{
            transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
            transition: "transform 0.3s ease-in-out",
          }}
        />
      </IconButton>
    </Flex>
  );
}
