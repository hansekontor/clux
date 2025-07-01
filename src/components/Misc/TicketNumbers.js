import React, { Fragment } from "react";

import { Flex, Divider } from "@components/Common";
import Typography from "@components/Typography";

export default function TicketNumbers({ numbers }) {
  return (
    <Flex
      borderRadius="sm"
      boxShadow={2}
      backgroundColor="white"
      padding={6}
      paddingTop={2}
      paddingBottom={2}
      width="100%"
      gap={2}
      justifyContent="space-between"
    >
      {numbers &&
        numbers.map((number, index) => (
          <Fragment key={index}>
            <Typography as="div" variant="h4">
              {number}
            </Typography>
            {numbers.length !== index + 1 && (
              <Divider vertical style={{ margin: "0px" }} />
            )}
          </Fragment>
        ))}
    </Flex>
  );
}
