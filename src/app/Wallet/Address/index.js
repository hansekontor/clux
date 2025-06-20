import React from "react";
import { useHistory } from "react-router-dom";

import { useApp, useNotifications } from "blocklotto-sdk";

// react components
import { Flex } from "@components/Common";
import { Input } from "@components/Form";
import Button from "@components/Button";
import { CopyIcon, ArrowHeadLeftIcon, LinkIcon } from "@components/Icons";
import IconButton from "@components/IconButton";

export default function Address() {
  const { wallet } = useApp();
  const notify = useNotifications();
  const history = useHistory();

  // handlers
  const handleCopy = (copy) => {
    navigator.clipboard.writeText(copy);
    notify({ message: "Copied to clipboard", type: "success" });
  };

  const handleBackClick = () => {
    history.push("/wallet");
  };

  const handleBlockchainView = () => {
    window.open(
      `https://explorer.e.cash/address/${wallet.Path1899.cashAddress}`,
      "_blank"
    );
  };

  return (
    <Flex direction="column" gap={2} paddingTop={2} alignItems="start">
      <IconButton onClick={handleBackClick}>
        <ArrowHeadLeftIcon />
        Back
      </IconButton>
      <Flex
        direction="column"
        gap={1}
        backgroundColor="white"
        padding={2}
        borderRadius={"md"}
        width="100%"
      >
        <Input label="Wallet Address:" value={wallet.Path1899.cashAddress} />
        <Button
          size="sm"
          startIcon={<CopyIcon />}
          onClick={() => handleCopy(wallet.Path1899.cashAddress)}
        >
          Copy Address
        </Button>
        <Button
          color="secondary"
          size="sm"
          startIcon={<LinkIcon />}
          onClick={handleBlockchainView}
        >
          View Blockchain
        </Button>
      </Flex>
    </Flex>
  );
}
