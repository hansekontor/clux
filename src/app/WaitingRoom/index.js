import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// core functions
import { useApp, useNotifications, getWalletState } from "blocklotto-sdk";

// react components
import Header from "@components/Header";
import { Container, Flex } from "@components/Common";
import Button from "@components/Button";
import Alert from "@components/Alert";
import { TicketNumbers } from "../../components/Misc";

export default function WaitingRoom() {
  const {
    playerNumbers,
    wallet,
    ticketsToRedeem,
    setGameTickets,
    gameTickets,
    checkRedeemability,
    redeemTicket,
    isFirstTicket,
    setLoadingStatus,
  } = useApp();
  const history = useHistory();
  const notify = useNotifications();

  // states
  const [isRedeemable, setIsRedeemable] = useState(false);
  const [activeTicket, setActiveTicket] = useState({});
  const [showBackup, setShowBackup] = useState(isFirstTicket);
  const [redeemHashes, setRedeemHashes] = useState(false);

  // set active ticket to state
  useEffect(() => {
    if (ticketsToRedeem.length > 0) {
      setLoadingStatus(false);
      setActiveTicket(ticketsToRedeem[0]);
    } else {
      setLoadingStatus("LOADING TICKET");
    }
  }, [ticketsToRedeem]);

  // wait until ticket is redeemable
  useEffect(() => {
    const checkTicketRedeemability = async () => {
      console.log("checkTicketRedeemability");
      if (activeTicket.redeemTx?.hash) {
        notify({ type: "error", message: "Ticket has already been redeemed." });
        history.push("/select");
        setIsRedeemable(false);
      } else if (activeTicket.issueTx?.height > 0) {
        console.log("issueTx is already mined");
        setIsRedeemable(true);
      } else if (activeTicket.issueTx?.hash) {
        console.log("check if ticket is mined");
        const isRedeemableTicket = await checkRedeemability(activeTicket, true);
        if (isRedeemableTicket) {
          setIsRedeemable(true);
        } else {
          setIsRedeemable(false);
        }
      } else {
        setIsRedeemable(false);
      }
    };

    if (activeTicket) {
      checkTicketRedeemability();
    }
  }, [activeTicket]);

  // prepare tickets for result when ticket was redeemed
  useEffect(() => {
    if (redeemHashes) {
      console.log("WaitingRoom: redeemHash available", redeemHashes);
      const walletState = getWalletState(wallet);
      const { tickets } = walletState;
      console.log("tickets", tickets);
      const redeemedTicket = tickets.find(
        (ticket) => ticket.redeemTx?.hash === redeemHashes[0]
      );
      console.log("found redeemedTicket", redeemedTicket);
      if (redeemedTicket) {
        setGameTickets([redeemedTicket]);
        console.log("gameTickets was set");
      }
    }
  });

  // move to /result section when gameTickets are available
  useEffect(() => {
    if (gameTickets.length > 0) {
      console.log("gameTickets are available: go to /result");
      history.push("/result");
    }
  }, [gameTickets]);

  // handlers
  const handleButtonClick = async () => {
    if (isRedeemable) {
      setLoadingStatus("REDEEMING TICKET");
      const newRedeemHash = await redeemTicket(activeTicket);
      setRedeemHashes([newRedeemHash]);
    } else {
      history.push("/select");
    }
  };

  const playerNumbersFromTicket = activeTicket?.parsed?.playerNumbers;
  const buttonText = isRedeemable ? "Redeem Ticket" : "Purchase another Ticket";

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

          {showBackup ? (
            <></>
          ) : (
            <Flex
              direction="column"
              height="100%"
              gap={2}
              justifyContent={"space-between"}
            >
              <Flex direction="column" gap={2}>
                <DotLottieReact src="animations/ticket.lottie" autoplay />
              </Flex>
              <Flex direction="column" gap={2}>
                {!isRedeemable && (
                  <Alert severity="info">
                    Expected waiting time for your ticket is 10 minutes. You can
                    either wait here or redeem at a later time.
                  </Alert>
                )}
                <TicketNumbers
                  numbers={
                    playerNumbersFromTicket
                      ? playerNumbersFromTicket
                      : playerNumbers
                  }
                />
                <Button onClick={handleButtonClick}>{buttonText}</Button>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Container>
    </Flex>
  );
}
