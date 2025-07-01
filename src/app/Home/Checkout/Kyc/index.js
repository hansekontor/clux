import React from "react";
import { useHistory } from "react-router-dom";

import { useCheckout, useNotifications } from "blocklotto-sdk";

import { Flex } from "@components/Common";
import Button from "@components/Button";
import Typography from "@components/Typography";

import { VideoIcon, PictureIcon, SmartPhoneIcon } from "@components/Icons";

export default function Kyc() {
  const history = useHistory();
  const { handleKYCandCapture } = useCheckout();
  const notify = useNotifications();

  const handleSuccess = async (message) => {
    notify({ type: "success", message: "KYC successful" });
  };

  const handleError = (message) => {
    notify({ type: "error", message });
    history.push("/");
  };

  return (
    <Flex direction="column" textAlign="center" gap={2}>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          backgroundColor="tertiary.main"
          borderRadius="full"
          color="tertiary.contrastText"
          width={"60px"}
          height={"60px"}
        >
          <VideoIcon />
        </Flex>
        <Typography variant="h4">Complete KYC</Typography>
        <Typography variant="body1">
          You need to submit a photo ID and liveness check
        </Typography>
      </Flex>

      <Flex direction="column">
        <Flex
          padding={2}
          border={1}
          borderRadius={"md"}
          bottomLeftBorderRadius={"none"}
          bottomRightBorderRadius={"none"}
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex gap={1} alignItems="center">
            <PictureIcon />
            <Typography weight="bold">Submit a photo ID</Typography>
          </Flex>
          <Typography style={{ opacity: 0.8 }}>1 minute</Typography>
        </Flex>
        <Flex
          padding={2}
          border={1}
          borderRadius={"md"}
          topLeftBorderRadius={"none"}
          topRightBorderRadius={"none"}
          borderTop={0}
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex gap={1} alignItems="center">
            <SmartPhoneIcon />
            <Typography weight="bold">Do a liveness check</Typography>
          </Flex>
          <Typography style={{ opacity: 0.8 }}>1 minute</Typography>
        </Flex>
      </Flex>

      <Typography variant="caption">Total time 2 minutes</Typography>
      <Button onClick={(e) => handleKYCandCapture(e, handleSuccess, handleError)} size="sm" color="tertiary">
        Continue
      </Button>
    </Flex>
  );
}
