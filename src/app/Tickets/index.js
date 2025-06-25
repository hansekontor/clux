import React from "react";
import { useHistory } from "react-router-dom";

// core functions
import { useApp, getWalletState } from "blocklotto-sdk";

// react components
import Header from "@components/Header";
import { Container, Flex } from "@components/Common";
import Ticket from "./components/Ticket";
import Button from "@components/Button";
import Typography from "@components/Typography";
import sleep from "@utils/sleep";

export default function Tickets() {
  const {
    wallet,
    setTicketsToRedeem,
    redeemableTickets,
    setLoadingStatus,
    walletUpdateAvailable,
    updateWallet,
  } = useApp();
  const walletState = getWalletState(wallet);
  const history = useHistory();
  const { tickets } = walletState;

  const handleRedeemAll = async () => {
    setLoadingStatus("LOADING TICKET");
    await setTicketsToRedeem(redeemableTickets);
    await sleep(1000);
    history.push("/waitingroom");
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

          <Flex gap={1}>
            {tickets.find(
              (ticket) => !ticket.redeemTx && ticket.issueTx?.height > 0
            ) && (
              <Button fullWidth onClick={handleRedeemAll} size="sm">
                Redeem All
              </Button>
            )}

            {walletUpdateAvailable && (
              <Button
                fullWidth
                color="tertiary"
                size="sm"
                onClick={updateWallet}
              >
                Sync Wallet
              </Button>
            )}
          </Flex>

          <Flex direction="column" height="100%" paddingBottom={2} gap={1}>
            {tickets.map((ticket, index) => (
              <Ticket key={index} ticket={ticket} />
            ))}

            {tickets.length === 0 && (
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <Typography>No tickets found.</Typography>
              </Flex>
            )}

            <Flex minHeight="16px" />
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}
