import React from "react";

// react components
import { Flex } from "@components/Common";
import Typography from "@components/Typography";

export default function NotFound() {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <Typography variant="h1">404</Typography>
      <Typography>
        Oops! The page you are looking for does not exist.
      </Typography>
    </Flex>
  );
}
