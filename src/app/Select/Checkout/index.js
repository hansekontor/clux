import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

// core functions
import { useCheckout, useApp } from "blocklotto-sdk";

// react components
import Drawer from "@components/Drawer";
import Kyc from "./Kyc";
import Tos from "./Tos";
import Email from "./Email";
import Payment from "./Payment";

export default function Checkout({ open, handleClose }) {
  const { hasAgreed, hasEmail, showKyc } = useCheckout();
  const { ticketsToRedeem } = useApp();
  const history = useHistory();

  // proceed to waiting room once at least one ticket has been bought
  useEffect(() => {
    console.log("Purchased tickets are in storage, move on");
    if (ticketsToRedeem.length > 0) {
      history.push("/waitingroom");
    }
  }, [ticketsToRedeem]);

  return (
    <Drawer open={open} handleClose={handleClose}>
      {!hasAgreed || !hasEmail ? (
        <>
          {!hasAgreed && <Tos />}
          {hasAgreed && !hasEmail && <Email />}
        </>
      ) : (
        <>{showKyc ? <Kyc /> : <Payment />}</>
      )}
    </Drawer>
  );
}
