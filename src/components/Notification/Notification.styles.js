import styled from "styled-components";
import blendHexColors from "../../utils/blendHexColors";

export const StyledNotification = styled.div`
  border-radius: ${({ theme }) => theme.shape.sm};
  padding: ${({ theme }) => theme.spacing(1.5)};
  padding-left: ${({ theme }) => theme.spacing(2.5)};
  padding-right: ${({ theme }) => theme.spacing(2.5)};
  border: 1px solid;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;
  margin-inline: ${({ theme }) => theme.spacing(2)};

  background-color: ${({ theme, type }) => {
    switch (type) {
      case "error":
        return `${blendHexColors(theme.color.error.main, "#ffffff", 0.9)}`;
      case "success":
        return `${blendHexColors(theme.color.success.light, "#ffffff", 0.9)}`;
      case "info":
        return `${blendHexColors(theme.color.info.light, "#ffffff", 0.9)}`;
      case "warning":
        return `${blendHexColors(theme.color.warning.light, "#ffffff", 0.9)}`;
      default:
        return `${blendHexColors(theme.color.primary.light, "#ffffff", 0.9)}`;
    }
  }};
  border-color: ${({ theme, type }) => {
    switch (type) {
      case "error":
        return theme.color.error.main;
      case "success":
        return theme.color.success.main;
      case "info":
        return theme.color.info.main;
      case "warning":
        return theme.color.warning.main;
      default:
        return theme.color.primary.main;
    }
  }};
  color: ${({ theme, type }) => {
    switch (type) {
      case "error":
        return theme.color.error.dark;
      case "success":
        return theme.color.success.dark;
      case "info":
        return theme.color.info.dark;
      case "warning":
        return theme.color.warning.dark;
      default:
        return theme.color.primary.dark;
    }
  }};
`;