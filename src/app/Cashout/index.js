import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

// react components
import Header from "@components/Header";
import { Container, Flex } from "@components/Common";
import Button from "@components/Button";
import Typography from "@components/Typography";

// core functions
import { useCashout, useNotifications, useApp } from "blocklotto-sdk";
import Filter from "./components/Filter";
import Brand from "./components/Brand";
import GiftCard from "./components/GiftCard";

export default function Cashout() {
  const history = useHistory();
  const notify = useNotifications();
  const { checkBalance, tilloStage, giftcardLink, setGiftcardLink } =
    useCashout();
  const { balance } = useApp();

  // redirect to homepage is insufficient balance
  useEffect(() => {
    const isSufficientBalance = checkBalance();
    if (!isSufficientBalance) {
      notify({ type: "error", message: "Insufficient Balance" });
      history.push("/home");
    }
  }, []);

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

          <Flex
            direction="column"
            height="100%"
            gap={2}
            justifyContent={"space-between"}
          >
            <Flex direction="column" paddingTop={3}>
              <Flex
                paddingBottom={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5" as="h2">
                  Cashout
                </Typography>

                <Typography textTransform="uppercase">
                  Balance: ${balance.toFixed(2)}
                </Typography>
              </Flex>
              <Flex direction="column">
                {tilloStage === "filter" && <Filter />}

                {tilloStage === "brand" && <Brand />}

                {tilloStage === "giftcard" && <GiftCard />}
              </Flex>
            </Flex>
            {tilloStage !== "giftcard" && (
              <Button type="submit" form={`${tilloStage}-form`}>
                {tilloStage === "filter" && <>Go to Brands</>}
                {tilloStage === "brand" && <>Get Giftcard</>}
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}
