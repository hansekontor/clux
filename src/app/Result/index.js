import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// core functions
import { useApp, getWalletState } from "blocklotto-sdk";
import useQuery from "../../hooks/useQuery";

// react components
import { Flex } from "@components/Common";
import Button from "@components/Button";
import Typography from "@components/Typography";
import { TicketNumbers } from "../../components/Misc";
import Alert from "@components/Alert";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Dollar } from "./components/Dollar";

export default function Result() {
  const history = useHistory();
  const { wallet } = useApp();
  const { tickets } = getWalletState(wallet);
  const query = useQuery();

  const [animation, setAnimation] = useState(true);

  const ticketHash = query.get("ticket") || "";
  const redeemAll = query.get("redeemAll") || "";

  const currentTicket = tickets.find(
    (ticket) => ticket.issueTx?.hash === ticketHash
  );

  console.log("currentTicket", currentTicket);

  if (!currentTicket || !currentTicket.parsed) {
    return (
      <Flex direction="column" height="100%" justifyContent="center" gap={2}>
        <Alert type="error">
          No ticket found with the provided hash. Please ensure you have a valid
          ticket.
        </Alert>
        <Button size="sm" color="tertiary" onClick={() => history.push("/")}>
          Go Home
        </Button>
      </Flex>
    );
  }

  // DOM variables
  // account for strange browser behaviour and try both properties
  const payoutAmountNum = currentTicket.parsed.payoutAmountNum;
  const actualPayoutNum = currentTicket.parsed.actualPayoutNum;
  const amount =
    payoutAmountNum >= 0 ? payoutAmountNum / 100 : actualPayoutNum / 100;
  const resultingNumbers = currentTicket.parsed?.resultingNumbers;
  const buttonText = redeemAll ? "Redeem Next Ticket" : "Play Again";
  const isWinner = amount > 0;

  // handlers
  const handleRedirect = () => {
    if (redeemAll) {
      history.push("/waitingroom?redeemAll=true");
    } else {
      history.push("/home");
    }
  };

  const handleTicketsRedirect = () => {
    history.push("/tickets");
  };

  const handleCashoutRedirect = () => {
    history.push("/cashout");
  };

  const handleFinishAnimation = () => {
    setAnimation(false);
  };

  return (
    <Flex
      direction="column"
      gap={2}
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      {!animation ? (
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
            />
            <Flex position="absolute" top={0} left={0} right={0} bottom={0}>
              {isWinner ? (
                <Dollar>
                  <Typography variant="h2" fontWeight="400" fontSize="5rem">
                    ${amount}
                  </Typography>
                </Dollar>
              ) : (
                <Typography variant="h2" fontWeight="400" fontSize="5rem">
                  ${amount}
                </Typography>
              )}
            </Flex>
          </Flex>
          <Flex gap={2} direction="column" width="100%">
            <Flex gap={1} direction="column" width="100%">
              <Flex gap={1} width="100%">
                <Button
                  fullWidth
                  size="sm"
                  color="tertiary"
                  onClick={handleCashoutRedirect}
                >
                  Cashout
                </Button>
                <Button
                  fullWidth
                  size="sm"
                  color="tertiary"
                  onClick={handleTicketsRedirect}
                >
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
            if (dotLottie) {
              dotLottie.addEventListener("complete", handleFinishAnimation);
            }
          }}
        />
      )}
    </Flex>
  );
}
