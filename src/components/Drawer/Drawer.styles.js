import styled from "styled-components";

// react components
import { Flex } from "../Common";
import { BackgroundCover } from "../Common";

export const BaseDrawer = styled(Flex)`
  position: absolute;
  background-color: white;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  max-height: 100dvh;
  z-index: 100;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;

  opacity: ${({ open }) => (open ? 1 : 0)};
  max-height: ${({ open }) => (open ? '100dvh' : '0px')};
  transition: ${({theme}) => `all ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.complex}ms`};
`;

export const DrawerBackground = styled(BackgroundCover)`
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  transition: ${({ theme }) => `opacity ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.complex}ms`};
  cursor: pointer;
`;