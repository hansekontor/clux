import React from "react";

import { Flex } from "@components/Common";
import Typography from "@components/Typography";
import { TicketIcon } from "@components/Icons";

export default function Ticket() {
  return (
    <Flex
      borderRadius="sm"
      backgroundColor="white"
      boxShadow={2}
      alignItems="start"
      direction="column"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        gap={2}
        padding={2}
        paddingBottom={1}
        paddingTop={1}
        style={{ cursor: "pointer" }}
      >
        <Flex justifyContent="space-between" alignItems="center" gap={2}>
          <Flex
            borderRadius="full"
            backgroundColor={'primary.main'}
            color="white"
            padding={1}
            boxShadow={2}
          >
            <TicketIcon />
          </Flex>

          <Flex direction="column">
            <Flex gap={1} alignItems="center">
              <Typography>Ticket</Typography>
              <Typography variant="body2">
                HASH
              </Typography>
            </Flex>

            <Flex gap={2}>
              <Typography variant="body2">DISPLAY TIME</Typography>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
