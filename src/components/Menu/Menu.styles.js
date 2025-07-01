import styled from "styled-components";

// react components
import { Flex } from "../Common";
import { BackgroundCover } from "../Common";

export const BaseMenu = styled(Flex)`
  position: absolute;
  background-color: white;
  bottom: 0;
  right: 0;
  overflow: hidden;
  max-height: 100dvh;
  min-height: 100dvh;
  height: 100dvh;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;

  opacity: ${({ open }) => (open ? 1 : 0)};
  max-width: ${({ open }) => (open ? '480px' : '0px')};
  transition: ${({ theme }) => `all ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.complex}ms`};
`;

export const MenuBackground = styled(BackgroundCover)`
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  transition: ${({ theme }) => `opacity ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.complex}ms`};
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  transition: transform 0.3s ease;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;