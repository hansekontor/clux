import React from "react";

import { ArrowHeadRightIcon } from "@components/Icons";
import { Flex } from "@components/Common";

export default function ButtonLink({ children, ...props}) {
  return (
    <Flex
      borderRadius="sm"
      backgroundColor="white"
      boxShadow={2}
      padding={2}
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      style={{ cursor: "pointer" }}
      {...props}
    >
      {children}
      <ArrowHeadRightIcon />
    </Flex>
  );
}
