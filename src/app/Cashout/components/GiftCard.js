import React from "react";

// core functions
import { useCashout } from "blocklotto-sdk";
import Button from "@components/Button";
import { Flex } from "@components/Common";
import Alert from "@components/Alert";
import Typography from "@components/Typography";

export default function GiftCard() {
  const { giftcardLink } = useCashout();

  return (
    <Flex direction="column" gap={2}>
      <Button onClick={() => window.open(giftcardLink, "_blank")}>
        Claim your Giftcard
      </Button>

      <Alert severity="info">
        <Typography>
          Please claim your giftcard now, you will not be able to claim it
          later.
        </Typography>
      </Alert>
    </Flex>
  );
}
