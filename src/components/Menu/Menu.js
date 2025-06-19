import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// react components
import { BaseMenu, IconWrapper, MenuBackground } from "./Menu.styles";
import { Container, Divider, Flex } from "../Common";
import IconButton from "../IconButton";
import Button from "../Button";

// icons
import { MenuIcon } from "../Icons";
import { CancelIcon } from "../Icons/CancelIcon";

// constants
import menuItems from "../../constants/menuItems";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const pathname = history.location.pathname;

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <IconButton
        onClick={handleToggle}
        style={{ position: "relative", zIndex: 91 }}
      >
        <IconWrapper open={open}>
          {open ? <CancelIcon size={16} /> : <MenuIcon size={24} />}
        </IconWrapper>
      </IconButton>

      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        position={"fixed"}
        left={"0px"}
        bottom={"0px"}
        zIndex={90}
      >
        <Flex
          maxWidth={"480px"}
          position={"absolute"}
          bottom={"0px"}
          width={"100%"}
          height={"100%"}
          overflow={"hidden"}
          marginLeft={"auto"}
          marginRight={"auto"}
        >
          <BaseMenu open={open}>
            <Flex paddingTop={12} minWidth={"300px"}>
              <Container>
                <Flex direction={"column"} gap={2}>
                  {menuItems.map((item, index) => {
                    const onClickHandler = () => {
                      if (item.href) {
                        if (item.internal) {
                            history.push(item.href);
                        } else {
                            window.open(item.href, "_blank");
                        }
                      }
                    };

                    return (
                      <div>
                        <Button
                          key={item.label}
                          variant="text"
                          startIcon={item.icon}
                          justifyContent={"start"}
                          textAlign={"start"}
                          color={pathname.startsWith(item.href) ? "primary" : "tertiary"}
                          onClick={onClickHandler}
                        >
                          {item.label}
                        </Button>
                        {menuItems.length !== index + 1 && <Divider />}
                      </div>
                    );
                  })}
                </Flex>
              </Container>
            </Flex>
          </BaseMenu>
        </Flex>
        <MenuBackground open={open} onClick={handleToggle} />
      </Flex>
    </>
  );
}
