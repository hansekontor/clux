import React from "react";

import { useApp, useNotifications } from "blocklotto-sdk";

// react components
import { Flex } from "@components/Common";
import Alert from "@components/Alert";
import Typography from "@components/Typography";
import Button from "@components/Button";
import { CopyIcon } from "../Icons";
import { Input } from "@components/Form";

export default function Backup({ buttonClick }) {
  const { wallet } = useApp();
  const notify = useNotifications();

  const seedPhrase = wallet.mnemonic ? wallet.mnemonic : "";
  const phraseArray = seedPhrase.split(" ");

  // handlers
  const handleCopy = (copy) => {
    navigator.clipboard.writeText(copy);
    notify({ message: "Copied to clipboard", type: "success" });
  };

  return (
    <>
      <Alert>
        <Typography>
          Please write down this 12 word mnemonic seed phrase. Store this in a
          safe place. It's the only way to recover your account if you get
          locked out or move to a new device.
        </Typography>
      </Alert>
      <Flex
        direction="column"
        gap={1}
        backgroundColor="white"
        padding={2}
        borderRadius={"md"}
        width="100%"
      >
        <Typography variant="subtitle1">Seed Phrase:</Typography>

        <Flex direction="column" gap={1} width="100%" paddingBottom={2}>
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <Flex gap={1} width="100%" key={rowIndex}>
              {phraseArray
                .slice(rowIndex * 3, rowIndex * 3 + 3)
                .map((word, i) => (
                  <Input
                    fullWidth
                    key={i}
                    value={`${word}`}
                    style={{ fontSize: "0.875rem" }}
                  />
                ))}
            </Flex>
          ))}
        </Flex>

        <Button
          size="sm"
          startIcon={<CopyIcon />}
          onClick={() => handleCopy(seedPhrase)}
        >
          Copy Seed Phrase
        </Button>
        <Button color="tertiary" size="sm" onClick={buttonClick}>
          I've Backed Up My Seed Phrase
        </Button>
      </Flex>
    </>
  );
}
