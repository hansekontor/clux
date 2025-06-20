import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useApp, useNotifications } from "blocklotto-sdk";

// react components
import { Flex } from "@components/Common";
import { Input } from "@components/Form";
import Button from "@components/Button";
import { ArrowHeadLeftIcon } from "@components/Icons";
import IconButton from "@components/IconButton";

export default function Email() {
  const history = useHistory();
  const notify = useNotifications();
  const { changeEmail, email, user } = useApp();

  const [inputEmail, setInputEmail] = useState(email || user.email || "");

  // handlers
  const handleBackClick = () => {
    history.push("/wallet");
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    const emailInput = e.target.email.value;
    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      emailInput
    );
    if (!isValid) {
      notify({
        type: "error",
        message: "Invalid email",
      });
      return;
    }

    await changeEmail(emailInput);

    history.push("/wallet");
  };

  return (
    <Flex
      direction="column"
      gap={2}
      paddingTop={2}
      alignItems="start"
      as="form"
      onSubmit={handleChangeEmail}
    >
      <IconButton onClick={handleBackClick}>
        <ArrowHeadLeftIcon />
        Back
      </IconButton>
      <Flex
        direction="column"
        gap={1}
        backgroundColor="white"
        padding={2}
        borderRadius={"md"}
        width="100%"
      >
        <Input
          label="Email:"
          type="email"
          name="email"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        <Button size="sm" type="submit">
          Change Email
        </Button>
      </Flex>
    </Flex>
  );
}
