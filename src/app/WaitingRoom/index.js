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
import Backup from "../../components/Misc/Backup";

export default function WaitingRoom() {
  const {
    playerNumbers,
    wallet,
    ticketsToRedeem,
    setGameTickets,
    gameTickets,
    checkTicketRedeemability,
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
    if (activeTicket.issueTx?.hash) {
      const polling = true;
      checkTicketRedeemability(activeTicket, polling, handleResult);
    }
  }, [activeTicket]);

  // prepare tickets for game when ticket was redeemed
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
  const handleResult = (result) => {
    if (result.redeemable) {
      setIsRedeemable(true);
    } else {
      console.error(message);
      notify({ type: "error", message: "Ticket can not be redeemed" });
      history.push("/home");
    }
  };

  const handleButtonClick = async () => {
    if (isRedeemable) {
      setLoadingStatus("REDEEMING TICKET");
      const newRedeemHash = await redeemTicket(activeTicket);
      setRedeemHashes([newRedeemHash]);
    } else {
      history.push("/home");
    }
  };

  const handleBackupClick = () => {
    setShowBackup(false);
  };

  const playerNumbersFromTicket = activeTicket?.parsed?.playerNumbers;
  const buttonText = isRedeemable ? "Redeem Ticket" : "Purchase Another Ticket";

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
            <Backup buttonClick={handleBackupClick} />
          ) : (
            <Flex
              direction="column"
              height="100%"
              gap={2}
              justifyContent={"space-between"}
            >
              <Flex
                direction="column"
                height="100%"
                width="100%"
                maxHeight="300px"
                marginTop="auto"
                marginBottom="auto"
                justifyContent="center"
                alignItems="center"
              >
                <DotLottieReact
                  src="animations/ticket.lottie"
                  segment={[40, 40]}
                />
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
