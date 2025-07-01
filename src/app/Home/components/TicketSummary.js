import React from "react";

//  core functions
import { useNotifications, useApp } from "blocklotto-sdk";

// react components
import { Flex } from "@components/Common";
import Button from "@components/Button";
import Typography from "@components/Typography";

// icons
import { ArrowRightIcon } from "@components/Icons";

const ticketPrice = 10;

export default function TicketSummary({ setOpenCheckout }) {
  const { ticketQuantity, balance, playerNumbers} = useApp();
  const notify = useNotifications();

  const handleCheckout = () => {
    // Check if there are any tickets that are invalid
    if (!Array.isArray(playerNumbers) || playerNumbers.length !== 4 || !playerNumbers.every(num => typeof num === 'number')) {
        notify({ message: "Please select exactly 4 numbers for your ticket.", type: "error" });
        return;
    }
    setOpenCheckout(true);
  };

  return (
    <Flex
      backgroundColor={"tertiary.main"}
      color={"tertiary.contrastText"}
      borderRadius="lg"
      padding={1}
      justifyContent={"space-between"}
      alignItems={"center"}
      paddingLeft={3}
      marginTop={"auto"}
      gap={2}
      style={{
        zIndex: 1,
        position: "sticky",
        bottom: 8,
      }}
    >
      <Flex direction={"column"} gap={0.2}>
        <Typography variant="h5" as="div">
          {ticketQuantity} Ticket{ticketQuantity > 1 && "s"}
        </Typography>
        <Typography
          variant="body2"
          as="div"
        >
            Balance: ${balance.toFixed(2)}
        </Typography>
      </Flex>
      <Button
        onClick={handleCheckout}
        endIcon={<ArrowRightIcon />}
        style={{
          gap: 24,
        }}
      >
        Buy ${ticketPrice * ticketQuantity}
      </Button>
    </Flex>
  );
}
