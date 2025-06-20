import React from "react";
import { useHistory } from "react-router-dom";

// react components
import { Flex } from "../Common";
import Menu from "../Menu";

// icons
import { Logo } from "../Icons";

export default function Header({ hideMenu }) {
  const history = useHistory();

  const handleLogoClick = () => {
    history.push("/home");
  };

  return (
    <Flex marginBottom={0} justifyContent="space-between" alignItems="center">
      <Logo onClick={handleLogoClick} style={{ cursor: "pointer" }} />

      <Flex justifyContent="center" alignItems="center" gap={2}>
        <a href="https://dollar.mp/" target="_blank" rel="noopener noreferrer">
          <img
            src="/lottomp.png"
            alt="BlockLotto Logo"
            style={{ height: "30px", width: "30px", objectFit: "contain" }}
          />
        </a>

        {!hideMenu && <Menu />}
      </Flex>
    </Flex>
  );
}
