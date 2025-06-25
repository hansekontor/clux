import React from "react";
import { useHistory } from "react-router-dom";

import { useApp, useNotifications } from "blocklotto-sdk";
import sleep from "../../../utils/sleep";

import { Flex, Divider } from "@components/Common";
import Typography from "@components/Typography";
import Button from "@components/Button";
import { CopyIcon } from "../../../components/Icons/CopyIcon";

const shortifyHash = (hash, length) => {
  return String(hash.slice(0, length) + "..." + hash.slice(64 - length));
};

export default function TicketBody({
  issueDisplayTime,
  ticket,
  displayPlayerNumbers,
  collapsed = true,
  redeemDisplayTime,
  displayPayoutAmount,
  displayResultingNumbers,
  combinedNumbers,
}) {
  const { setTicketsToRedeem, setLoadingStatus } = useApp();
  const history = useHistory();
  const notify = useNotifications();

  // handlers
  const handleCopy = (copy) => {
    navigator.clipboard.writeText(copy);
    notify({ message: "Copied to clipboard", type: "success" });
  };

  const handleRedeemTicket = async (e) => {
    e.stopPropagation();
    setLoadingStatus("LOADING TICKET");
    setTicketsToRedeem([ticket]);
    await sleep(1000);
    history.push("/waitingroom");
  };

  return (
    <Flex
      width="100%"
      maxHeight={collapsed ? "0px" : "auto"}
      style={{ overflow: "hidden", transition: "max-height 0.3s ease-in-out" }}
    >
      <Flex
        direction="column"
        gap={1}
        padding={2}
        paddingBottom={1}
        paddingTop={1}
        width="100%"
      >
        <Divider />
        <Flex justifyContent="space-between" width="100%">
          <Typography variant="body2">Issued:</Typography>
          <Typography variant="body2">{issueDisplayTime}</Typography>
        </Flex>
        <Flex justifyContent="space-between" width="100%">
          <Typography variant="body2">Issue ID:</Typography>
          <Flex
            alignItem="center"
            gap={1}
            style={{ cursor: "pointer" }}
            onClick={() => handleCopy(ticket.issueTx.hash)}
          >
            <CopyIcon />
            <Typography variant="body2">
              {shortifyHash(ticket.issueTx.hash, 8)}
            </Typography>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" width="100%">
          <Typography variant="body2">Ticket Numbers:</Typography>
          <Typography variant="body2">{displayPlayerNumbers}</Typography>
        </Flex>
        {ticket.redeemTx ? (
          <>
            {redeemDisplayTime && (
              <Flex justifyContent="space-between" width="100%">
                <Typography variant="body2">Redeemed:</Typography>
                <Typography variant="body2">{redeemDisplayTime}</Typography>
              </Flex>
            )}
            {ticket.parsed?.payoutAmount && (
              <Flex justifyContent="space-between" width="100%">
                <Typography variant="body2">Payout:</Typography>
                <Typography variant="body2">${displayPayoutAmount}</Typography>
              </Flex>
            )}
            <Flex justifyContent="space-between" width="100%">
              <Typography variant="body2">Redeem ID:</Typography>
              <Flex
                alignItem="center"
                gap={1}
                style={{ cursor: "pointer" }}
                onClick={() => handleCopy(ticket.redeemTx.hash)}
              >
                <CopyIcon />
                <Typography variant="body2">
                  {shortifyHash(ticket.redeemTx.hash, 8)}
                </Typography>
              </Flex>
            </Flex>
            {displayResultingNumbers && (
              <Flex justifyContent="space-between" width="100%">
                <Typography variant="body2">Resulting Numbers</Typography>
                <Typography variant="body2">
                  {displayResultingNumbers}
                </Typography>
              </Flex>
            )}

            <Divider />

            {combinedNumbers && ticket.parsed && (
              <>
                <Typography>Ticket Calculations</Typography>
                <table>
                  <thead style={{ textAlign: "left" }}>
                    <tr>
                      <th key={0}>You</th>
                      <th key={1}>Block</th>
                      <th key={2}>Combination</th>
                      <th key={3}>Module</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticket.parsed?.playerNumbers.map((choice, index) => {
                      return (
                        <tr key={index}>
                          <td>{choice}</td>
                          <td>{ticket.parsed?.opponentNumbers && ticket.parsed?.opponentNumbers[index]}</td>
                          <td>{combinedNumbers[index]}</td>
                          <td>{ticket.parsed?.resultingNumbers && ticket.parsed?.resultingNumbers[index]}</td>
                        </tr>
                      );
                    })}
                    <tr key={"summary"}>
                      <td key={0}></td>
                      <td key={1}></td>
                      <td key={2}></td>
                      <td key={3}>
                        <b>
                          {ticket.parsed?.resultingNumbers?.reduce(
                            (acc, number) => acc + number,
                            0
                          )}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </>
        ) : (
          <Flex width="100%" paddingTop={1}>
            <Button
              size="sm"
              fullWidth
              onClick={(e) => handleRedeemTicket(e)}
              color={ticket.issueTx?.height > 0 ? "primary" : "secondary"}
            >
              {ticket.issueTx?.height > 0 ? "Redeem" : "Request Redemption"}
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
