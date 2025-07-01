import React from "react";
import { useHistory } from "react-router-dom";

// react components
import { Flex } from "@components/Common";
import Backup from "../../../components/Misc/Backup";
import { ArrowHeadLeftIcon } from "@components/Icons";
import IconButton from "@components/IconButton";

export default function Export() {
  const history = useHistory();

  // handlers
  const handleBackClick = () => {
    history.push("/wallet");
  };

  return (
    <Flex direction="column" gap={2} paddingTop={2} alignItems="start">
      <IconButton onClick={handleBackClick}>
        <ArrowHeadLeftIcon />
        Back
      </IconButton>

      <Backup buttonClick={handleBackClick}/>
    </Flex>
  );
}
