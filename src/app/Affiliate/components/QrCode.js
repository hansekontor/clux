import React from "react";

import { QRCodeCanvas } from "qrcode.react";
import { Flex } from "@components/Common";

export default function QrCode({ value }) {
  if (!value) {
    return null;
  }
  return (
    <Flex
      padding={2}
      borderRadius="md"
      backgroundColor="white"
      justifyContent="center"
      alignItems="center"
      boxShadow={2}
    >
      <QRCodeCanvas value={value} size={164} />
    </Flex>
  );
}
