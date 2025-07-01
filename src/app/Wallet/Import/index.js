import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useApp, useNotifications } from "blocklotto-sdk";

// react components
import { Flex } from "@components/Common";
import { Input } from "@components/Form";
import Button from "@components/Button";
import { ArrowHeadLeftIcon } from "@components/Icons";
import IconButton from "@components/IconButton";
import Typography from "@components/Typography";
import Alert from "@components/Alert";

export default function Import() {
  const history = useHistory();
  const notify = useNotifications();
  const { wallet, importWallet, validateMnemonic } = useApp();

  const [isValidMnemonic, setIsValidMnemonic] = useState(false);
  const [mnemonic, setMnemonic] = useState("");

  const walletAddress = wallet?.Path1899?.cashAddress;

  // handlers
  const handleBackClick = () => {
    history.push("/wallet");
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    // Validate mnemonic on change
    setIsValidMnemonic(validateMnemonic(value));
    setMnemonic(value);
  };

  const handleImportPhrase = async (e) => {
    e.preventDefault();

    if (!isValidMnemonic) {
      notify({
        type: "error",
        message: "Invalid Seed Phrase",
      });
      return;
    }

    await importWallet(e.target.mnemonic.value);

    notify({
        type: "success",
        message: "Wallet imported successfully",
      });
  };

  return (
    <>
      <Flex direction="column" gap={2} paddingTop={2} alignItems="start">
        <IconButton onClick={handleBackClick}>
          <ArrowHeadLeftIcon />
          Back
        </IconButton>

        <Alert servity="info">
          <Typography variant="subtitle1">
            Please ensure you have your seed phrase ready to import your wallet.
          </Typography>
        </Alert>

        <Flex
          direction="column"
          gap={1}
          backgroundColor="white"
          padding={2}
          borderRadius={"md"}
          width="100%"
          as="form"
          id="import-form"
          onSubmit={handleImportPhrase}
        >
          <Input
            label="Seed Phrase:"
            type="text"
            name="mnemonic"
            required
            placeholder="Enter your seed phrase"
            value={mnemonic}
            onChange={handleChange}
          />
          <Button size="sm" type="submit">
            Import Wallet
          </Button>
        </Flex>
      </Flex>

      {!isValidMnemonic && mnemonic.split("").length > 0 && (
        <Alert type="error">
          <Typography>Valid mnemonic seed phrase required</Typography>
        </Alert>
      )}

      {walletAddress && (
        <Flex direction="column" gap={2} alignItems="start">
          <Flex
            direction="column"
            gap={1}
            backgroundColor="white"
            padding={2}
            borderRadius={"md"}
            width="100%"
          >
            <Typography variant="subtitle1">Current Wallet Address:</Typography>
            <Typography variant="body2" style={{ wordBreak: "break-all" }}>
              {walletAddress}
            </Typography>
          </Flex>
        </Flex>
      )}
    </>
  );
}
