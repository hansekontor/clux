import React from "react";

//  core functions
import { useApp } from "blocklotto-sdk";

// react components
import { Flex } from "@components/Common";
import Button from "@components/Button";
import Typography from "@components/Typography";
import NumberButton from "./NumberButton";
import NumberGrid from "./NumberGrid";

const totalNumbers = 25;

export default function Ticket() {
  const { ticketQuantity, setTicketQuantity, playerNumbers, setPlayerNumbers } =
    useApp();

  const handleNumberClick = (number) => {
    if (playerNumbers.includes(number)) {
      // Remove number if already selected
      setPlayerNumbers(playerNumbers.filter((n) => n !== number));
    } else if (playerNumbers.length < 4) {
      // Add number if less than 4 are selected
      setPlayerNumbers([...playerNumbers, number]);
    }
  };

  const handleAddTicket = () => {
    setTicketQuantity(ticketQuantity + 1);
  };

  const handleRemoveTicket = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity - 1);
    }
  };

  return (
    <Flex direction={"column"} gap={2} marginBottom={2}>
      {/* Ticket Selection Section */}
      <Flex
        padding={2}
        backgroundColor={"secondary.main"}
        borderRadius={"lg"}
        direction={"column"}
        gap={2}
      >
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Flex gap={0.8} alignItems={"center"}>
            <Typography variant={"h6"} as={"div"}>
              Select 4 Numbers
            </Typography>
            <Typography variant={"subtitle1"} as={"div"} color={"grey.600"}>
              ({playerNumbers.length}/4 selected)
            </Typography>
          </Flex>
        </Flex>

        {/* NumberGrid Component */}
        <NumberGrid>
          {Array.from({ length: totalNumbers }, (_, i) => {
            const number = i + 1;
            const selected = playerNumbers.includes(number);
            return (
              <NumberButton
                key={number}
                active={selected}
                onClick={() => handleNumberClick(number)}
              >
                {number}
              </NumberButton>
            );
          })}
        </NumberGrid>
      </Flex>

      {/* Action Buttons */}
      <Flex gap={1}>
        <Flex width={"100%"}>
          <Button
            variant="pill"
            size="sm"
            color="tertiary"
            fullWidth
            onClick={handleAddTicket}
          >
            Add Ticket
          </Button>
        </Flex>
        <Flex width={"100%"}>
          {ticketQuantity > 1 && (
            <Button
              variant="pill"
              size="sm"
              color="secondary"
              fullWidth
              onClick={handleRemoveTicket}
            >
              Remove Ticket
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
