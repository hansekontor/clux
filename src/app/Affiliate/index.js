import React from "react";

// core functions
import { useApp } from "blocklotto-sdk";

// react components
import Header from "@components/Header";
import { Container, Flex, Divider } from "@components/Common";
import Typography from "@components/Typography";
import QrCode from "./components/QrCode";
import CopyLink from "./components/CopyLink";
import Tickets from "./components/Tickets";

export default function Affiliate() {
  const { affiliate } = useApp();

  const affUrl = affiliate?.url || "";

  return (
    <Flex
      direction={"column"}
      minHeight={"100dvh"}
      style={{ overflow: "hidden" }}
    >
      <Container
        height="100dvh"
        style={{
          overflowY: "auto",
        }}
      >
        <Flex
          direction="column"
          height="100%"
          paddingTop={2}
          paddingBottom={2}
          gap={2}
        >
          <Header />

          <Flex direction="column" gap={3} marginTop={2}>
            <Flex justifyContent="center" alignItems="center">
              <QrCode value={affUrl} />
            </Flex>

            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              gap={1}
            >
              <Typography variant="h3">Refer & Earn Money</Typography>
              <Typography variant="body2">
                Instantly earn an affiliate fee with every ticket sale generated
                by your referral, forever. Simply share your link or QR code to
                start earning today.
              </Typography>
            </Flex>

            <CopyLink value={affUrl} />
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}
