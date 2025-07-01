import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// core functions
import { useApp, useNotifications, getWalletState } from "blocklotto-sdk";

// react components
import { Flex } from "@components/Common";
import Button from "@components/Button";
import Alert from "@components/Alert";
import { TicketNumbers } from "../../components/Misc";
import Backup from "../../components/Misc/Backup";
import useQuery from "../../hooks/useQuery";
import { Spinner } from "../../components/Loading";

export default function WaitingRoom() {
  const {
    wallet,
    checkTicketRedeemability,
    redeemTicket,
    isFirstTicket,
    setLoadingStatus,
  } = useApp();
  const history = useHistory();
  const notify = useNotifications();
  const query = useQuery();

  // states
  const [isRedeemable, setIsRedeemable] = useState(false);
  const [activeTicket, setActiveTicket] = useState({});
  const [showBackup, setShowBackup] = useState(isFirstTicket);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { tickets } = getWalletState(wallet);
  const redeemableTickets = tickets.filter(
    (ticket) => !ticket.redeemTx && ticket.issueTx?.height > 0
  );
  const redeemAll = query.get("redeemAll");
  const ticketHash = redeemAll
    ? redeemableTickets[0]?.issueTx?.hash || ""
    : query.get("ticket") || "";

  const playerNumbersFromTicket = activeTicket?.parsed?.playerNumbers;
  const buttonText = isRedeemable ? "Redeem Ticket" : "Purchase Another Ticket";

  // load ticket data when component mounts
  useEffect(() => {
    (async () => {
      try {
        // check if ticketHash is provided
        if (!ticketHash) {
          console.error("No ticket hash provided.");
          setError("No ticket hash provided.");
        } else {
          // find the ticket with the provided hash
          const currentTicket = tickets.find(
            (ticket) => ticket.issueTx?.hash === ticketHash
          );

          // check if ticket was found
          if (!currentTicket) {
            console.error("Ticket not found:", ticketHash);
            setError("Ticket not found.");
          } else {
            // set the active ticket to state
            setActiveTicket(currentTicket);

            // check if ticket is redeemable with no polling for initial load
            if (currentTicket.issueTx?.hash) {
              await checkTicketRedeemability(currentTicket, false, (result) => {
                // if there is an error, log it and set error state
                if (result.error) {
                  console.error("Error checking redeemability:", result.error);
                  setError("Ticket can not be redeemed. Please try again.");
                  return;
                }

                // if ticket is redeemable, set state
                if (result.redeemable) {
                  setIsRedeemable(true);
                }
              });
            }
          }
        }

        // catch any errors during the loading process
      } catch (error) {
        console.error("Error loading ticket:", error);
        setError("Failed to load ticket. Please try again.");

        // finally set loading to false
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // wait until ticket is redeemable with polling
  useEffect(() => {
    if (activeTicket.issueTx?.hash && !isRedeemable) {
      checkTicketRedeemability(activeTicket, true, (result) => {
        // if there is an error, log it and set error state
        if (result.error) {
          console.error("Error checking redeemability:", result.error);
          setError("Ticket can not be redeemed. Please try again.");
          return;
        }

        // if ticket is redeemable, set state
        if (result.redeemable) {
          setIsRedeemable(true);
        }
      });
    }
  }, [activeTicket]);

  const handleClick = async () => {
    if (!isRedeemable) {
      // if ticket is not redeemable, redirect to home
      history.push("/home");
    } else {
      // if ticket is redeemable, set loading status and redeem ticket
      setLoadingStatus("REDEEMING TICKET");

      // redeem ticket
      const redeemHash = await redeemTicket(activeTicket);

      // check if redeemHash is available
      if (!redeemHash) {
        setLoadingStatus(false);
        notify({
          type: "error",
          message: "Ticket could not be redeemed. Please try again.",
        });
        console.error("Ticket could not be redeemed.");
        return;
      } else {
        // find the redeemed ticket in the wallet state
        const redeemedTicket = tickets.find(
          (ticket) => ticket.redeemTx?.hash === redeemHash
        );

        // check if redeemed ticket was found
        if (!redeemedTicket || !redeemedTicket.issueTx) {
          setLoadingStatus(false);
          notify({
            type: "error",
            message: "Redeemed ticket not found. Please try again.",
          });
          console.error("Redeemed ticket not found.");
          return;
        } else {
          // build query parameters for redirect
          const queryParams = new URLSearchParams();
          queryParams.set("ticket", redeemedTicket.issueTx.hash);

          if (redeemAll && redeemableTickets.length > 1) {
            // if redeemAll is true and there are more tickets to redeem, set the flag
            queryParams.set("redeemAll", "true");
          }

          // redirect to result page with ticket hash
          history.push("/result?" + queryParams.toString());
        }
      }
    }
  };

  const handleBackupClick = () => {
    setShowBackup(false);
  };

  if (loading) {
    return (
      <Flex
        direction="column"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" height="100%" justifyContent="center" gap={2}>
        <Alert type="error">{error}</Alert>
        <Button size="sm" color="tertiary" onClick={() => history.push("/")}>
          Go Home
        </Button>
      </Flex>
    );
  }

  if (showBackup) {
    return <Backup buttonClick={handleBackupClick} />;
  }

  return (
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
        <DotLottieReact src="animations/ticket.lottie" segment={[40, 40]} />
      </Flex>
      <Flex direction="column" gap={2}>
        {!isRedeemable && (
          <Alert severity="info">
            Expected waiting time for your ticket is 10 minutes. You can either
            wait here or redeem at a later time.
          </Alert>
        )}
        <TicketNumbers numbers={playerNumbersFromTicket} />
        <Button onClick={handleClick}>{buttonText}</Button>
      </Flex>
    </Flex>
  );
}
