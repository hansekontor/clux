import React from "react";

// react components
import Header from "@components/Header";
import { Container, Flex } from "@components/Common";
import Typography from "@components/Typography";

export default function NotFound() {
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
        </Flex>
      </Container>
    </Flex>
  );
}
