import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// core functions
import { useApp } from "blocklotto-sdk";
import sleep from "../../utils/sleep";

// react components
import Header from "@components/Header";
import { Container, Flex } from "@components/Common";
import Button from "@components/Button";
import Typography from "@components/Typography";
import { TicketNumbers } from "../../components/Misc";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Dollar } from "./components/Dollar";

export default function Result() {
  const [animation, setAnimation] = useState(false);
  const { gameTickets, setGameTickets, ticketsToRedeem } = useApp();
  const history = useHistory();
  const activeTicket = gameTickets[0];
  const redemptionsOutstanding = ticketsToRedeem.length > 0;
  console.log("Result outstanding redemptions", ticketsToRedeem);

  // redirect if ticket data missing
  useEffect(() => {
    if (!activeTicket) {
      sleep(1000);
      history.push("/select");
    } else if (!activeTicket.parsed) {
      sleep(1000);
      history.push("/select");
    }
  }, []);

  // handlers
  const handleRedirect = () => {
    setGameTickets([]);
    if (ticketsToRedeem.length > 0) {
      console.log("tickets available: go to waiting room");
      history.push("/waitingroom");
    } else {
      console.log("no more tickets: go to select");
      history.push("/select");
    }
  };

  const handleTicketsRedirect = () => {
    setGameTickets([]);
    history.push("/tickets");
  };

  const handleCashoutRedirect = () => {
    setGameTickets([]);
    history.push("/cashout");
  };

  const handleEvent = () => {
    setAnimation(true);
  };

  // DOM variables
  // account for strange browser behaviour and try both properties
  const payoutAmountNum = activeTicket.parsed?.payoutAmountNum;
  const actualPayoutNum = activeTicket.parsed?.actualPayoutNum;
  const amount =
    payoutAmountNum >= 0 ? payoutAmountNum / 100 : actualPayoutNum / 100;
  const resultingNumbers = activeTicket.parsed?.resultingNumbers;
  const buttonText = redemptionsOutstanding
    ? "Redeem Next Ticket"
    : "Play Again";
  const isWinner = amount > 0;

  console.log(
    "Result conditions:",
    amount >= 0,
    resultingNumbers?.length === 4
  );

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
          <Header hideMenu />

          <Flex
            direction="column"
            gap={2}
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {animation ? (
              <Flex
                direction="column"
                height="100%"
                gap={4}
                width="100%"
                justifyContent="space-between"
              >
                <Flex
                  height="100%"
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                >
                  <DotLottieReact
                    src={`animations/${isWinner ? "confetti" : "smoke"}.lottie`}
                    autoplay
                    loop={isWinner}
                    dotLottieRefCallback={(dotLottie) => {
                      dotLottie.addEventListener("complete", handleEvent);
                    }}
                  />
                  <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                  >
                    {isWinner ? (
                      <Dollar>
                        <Typography
                          variant="h2"
                          fontWeight="400"
                          fontSize="5rem"
                        >
                          ${amount.toFixed(2)}
                        </Typography>
                      </Dollar>
                    ) : (
                      <Typography variant="h2" fontWeight="400" fontSize="5rem">
                        ${amount.toFixed(2)}
                      </Typography>
                    )}
                  </Flex>
                </Flex>
                <Flex gap={2} direction="column" width="100%">
                  <Flex gap={1} direction="column" width="100%">
                    <Flex gap={1} width="100%">
                      <Button fullWidth size="sm" color="tertiary" onClick={handleCashoutRedirect}>
                        Cashout
                      </Button>
                      <Button fullWidth size="sm" color="tertiary" onClick={handleTicketsRedirect}>
                        Tickets
                      </Button>
                    </Flex>
                    <TicketNumbers numbers={resultingNumbers} />
                    <Button onClick={handleRedirect}>{buttonText}</Button>
                  </Flex>
                </Flex>
              </Flex>
            ) : (
              <DotLottieReact
                src="animations/ticket.lottie"
                autoplay
                dotLottieRefCallback={(dotLottie) => {
                  dotLottie.addEventListener("complete", handleEvent);
                }}
              />
            )}
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}
