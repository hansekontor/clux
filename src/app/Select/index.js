// node modules
import React, { useState, useEffect } from "react";

import { useApp, CheckoutProvider } from "blocklotto-sdk";

// react components
import Header from "@components/Header";
import { Container, Flex } from "@components/Common";
import Jackpot from "./components/Jackpot";
import Tickets from "./components/Ticket";
import TicketSummary from "./components/TicketSummary";
import Checkout from "./Checkout";

export default function Select() {
  const { setTicketsToRedeem, setGameTickets } = useApp();
  const [openCheckout, setOpenCheckout] = useState(false);

  // reset ticketsToRedeem and gameTickets
  useEffect(() => {
    setTicketsToRedeem([]);
    setGameTickets([]);
  }, []);

  // handle checkout close
  const handleCheckoutClose = () => {
    setOpenCheckout(false);
  };

  return (
    <Flex
      direction={"column"}
      minHeight={"100dvh"}
      style={{ overflow: "hidden" }}
    >
      <Container
        height="100dvh"
        style={{
          overflowY: "auto",
        }}
      >
        <Flex
          direction="column"
          height="100%"
          paddingTop={2}
          paddingBottom={2}
          gap={2}
        >
          <Header />
          <Jackpot />
          <Tickets />
          <TicketSummary setOpenCheckout={setOpenCheckout} />
        </Flex>
      </Container>
      {openCheckout && (
        <CheckoutProvider>
          <Checkout open={openCheckout} handleClose={handleCheckoutClose} />
        </CheckoutProvider>
      )}
    </Flex>
  );
}
