import React from "react";
import { StyledContainer, StyledWrapper } from "./Layout.styles";
import { Flex, Container } from "@components/Common";
import Header from "@components/Header";

export default function Layout({ children }) {
  return (
    <StyledWrapper>
      <StyledContainer>
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
              {children}
            </Flex>
          </Container>
        </Flex>
      </StyledContainer>
    </StyledWrapper>
  );
}
