import React from "react";

// core functions
import {
  useCheckout,
  useApp,
  NMICheckout,
  useNotifications,
} from "blocklotto-sdk";

import Button from "@components/Button";
import Alert from "@components/Alert";
import { Input } from "@components/Form";
import { Flex } from "@components/Common";
import Typography from "@components/Typography";
import { CartIcon } from "@components/Icons";
import { Divider } from "@components/Common";

export default function Payment() {
  const {
    ticketPrice,
    ticketQtyError,
    ticketQuantity,
    handlePaymentMethod,
    initiatePayment,
    paymentProcessor,
    handlePayment,
  } = useCheckout();

  const notify = useNotifications();
  const { balance } = useApp();

  const handlePaymentSuccess = () => {
    notify({ type: "success", message: "Successful purchase!" });
  };

  const handlePaymentError = () => {
    notify({ type: "error", message: "API Error. Try again" });
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    handlePaymentMethod("NMIC");
    await handlePayment(handlePaymentSuccess, handlePaymentError);
    await initiatePayment(e);
  };

  const handleEtokenSubmit = async (e) => {
    handlePaymentMethod("etoken");
    await handlePayment(handlePaymentSuccess, handlePaymentError);
  };

  return (
    <Flex direction="column" gap={3}>
      <Flex justifyContent="space-between" alignItems="center">
        <Typography textTransform="uppercase">
          Balance: ${balance.toFixed(2)} {paymentProcessor}
        </Typography>
        <Flex gap={1} alignItems="center">
          <CartIcon />
          <Typography textTransform="uppercase">
            ${ticketPrice * ticketQuantity}.00
          </Typography>
        </Flex>
      </Flex>
      <Flex
        as="form"
        direction="column"
        gap={2}
        id="NMIC-form"
        onSubmit={handleCardSubmit}
      >
        <Flex gap={1}>
          <Input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            fullWidth
            required
          />
          <Input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Last Name"
            fullWidth
            required
          />
        </Flex>
        <Input
          type="text"
          id="zip"
          name="zip"
          placeholder="Zip"
          fullWidth
          required
        />

        <NMICheckout variant="lightbox" />
      </Flex>

      <Flex direction="column" gap={1}>
        <Button type="submit" form="NMIC-form">
          Pay with Card
        </Button>
        {balance >= ticketPrice * ticketQuantity && (
          <>
            <Flex gap={1} alignItems="center">
              <Divider />
              <Typography variant="caption" color="divider">
                OR
              </Typography>
              <Divider />
            </Flex>

            <Button color="tertiary" onClick={handleEtokenSubmit}>
              Pay with Credits
            </Button>
          </>
        )}
        {ticketQtyError && <Alert type="error">{ticketQtyError}</Alert>}
      </Flex>
    </Flex>
  );
}
