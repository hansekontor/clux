import React from "react";

// react components
import { Flex } from "../Common";
import Menu from "../Menu";

// icons
import { Logo } from "../Icons";

export default function Header({ hideMenu }) {
  return (
    <Flex marginBottom={0} justifyContent="space-between" alignItems="center">
      <Logo />

      <Flex direction={"column"} alignItems="end">
        {!hideMenu && <Menu />}
      </Flex>
    </Flex>
  );
}
