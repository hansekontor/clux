import React from "react";

import { useNotifications } from "blocklotto-sdk";

import { Flex } from "@components/Common";
import { Input } from "@components/Form";
import Button from "@components/Button";

export default function CopyLink({ value }) {
  const notify = useNotifications();

  // handlers
  const handleCopy = (copy) => {
    navigator.clipboard.writeText(copy);
    notify({ message: "Copied to clipboard", type: "success" });
  };

  return (
    <Flex backgroundColor="white" padding={0.5} borderRadius="md">
      <Input
        fullWidth
        value={value}
        style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
      />
      <Button
        size="sm"
        style={{
          borderRadius: "8px",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
        }}
        onClick={() => handleCopy(value)}
      >
        Share
      </Button>
    </Flex>
  );
}
