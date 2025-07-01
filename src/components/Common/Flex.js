import styled from "styled-components";
import { resolveThemeColor } from "@utils/themeUtils";

const Flex = styled.div`
      box-sizing: border-box;
      display: flex;
      flex-direction: ${({ direction }) => direction || "row"};
      flex-wrap: ${({ wrap }) => wrap || "nowrap"};

      gap: ${({ theme, gap }) => gap ? theme.spacing(gap) : null};
      margin: ${({ theme, margin }) => margin ? theme.spacing(margin) : null};
      margin-top: ${({ theme, marginTop }) => marginTop ? marginTop === "auto" ? "auto" : theme.spacing(marginTop) : null};
      margin-bottom: ${({ theme, marginBottom }) => marginBottom ? marginBottom === "auto" ? "auto" : theme.spacing(marginBottom) : null};
      margin-left: ${({ theme, marginLeft }) => marginLeft ? marginLeft === "auto" ? "auto" : theme.spacing(marginLeft) : null};
      margin-right: ${({ theme, marginRight }) => marginRight ? marginRight === "auto" ? "auto" : theme.spacing(marginRight) : null};

      padding: ${({ theme, padding }) => padding ? theme.spacing(padding) : null};
      padding-top: ${({ theme, paddingTop }) => paddingTop ? theme.spacing(paddingTop) : null};
      padding-bottom: ${({ theme, paddingBottom }) => paddingBottom ? theme.spacing(paddingBottom) : null};
      padding-left: ${({ theme, paddingLeft }) => paddingLeft ? theme.spacing(paddingLeft) : null};
      padding-right: ${({ theme, paddingRight }) => paddingRight ? theme.spacing(paddingRight) : null};

      justify-content: ${({ justifyContent }) => justifyContent || "flex-start"};
      align-items: ${({ alignItems }) => alignItems || "stretch"};
      align-content: ${({ alignContent }) => alignContent || "stretch"};
      flex-grow: ${({ flexGrow }) => flexGrow || 0};

      width: ${({ width }) => width || "auto"};
      height: ${({ height }) => height || "auto"};
      min-width: ${({ minWidth }) => minWidth || null};
      min-height: ${({ minHeight }) => minHeight || null};
      max-width: ${({ maxWidth }) => maxWidth || "100%"};
      max-height: ${({ maxHeight }) => maxHeight || "100%"};
      overflow: ${({ overflow }) => overflow || "visible"};
      text-align: ${({ textAlign }) => textAlign || null};
      display: ${({ display }) => display || "flex"};
      border: ${({ theme, border }) => border ? `${border}px solid ${theme.color.divider}` : null};
      border-color: ${({ theme, borderColor }) => borderColor ? resolveThemeColor(theme, borderColor) : null};

      border-top: ${({ theme, borderTop }) => borderTop ? `${borderTop}px solid ${theme.color.divider}` : borderTop !== 0 ? null : "0px"};
      border-bottom: ${({ theme, borderBottom }) => borderBottom ? `${borderBottom}px solid ${theme.color.divider}` : borderBottom !== 0 ? null : "0px"};
      border-left: ${({ theme, borderLeft }) => borderLeft ? `${borderLeft}px solid ${theme.color.divider}` : borderLeft !== 0 ? null : "0px"};
      border-right: ${({ theme, borderRight }) => borderRight ? `${borderRight}px solid ${theme.color.divider}` : borderRight !== 0 ? null : "0px"};

      position: ${({ position }) => position || "static"};
      top: ${({ top }) => top || null};
      right: ${({ right }) => right || null};
      bottom: ${({ bottom }) => bottom || null};
      left: ${({ left }) => left || null};
      z-index: ${({ zIndex }) => zIndex || null};

      background-color: ${({ theme, backgroundColor }) =>
            backgroundColor ? resolveThemeColor(theme, backgroundColor) : "transparent"};

      color: ${({ theme, color }) =>
            color ? resolveThemeColor(theme, color) : "inherit"};

      border-radius: ${({ theme, borderRadius }) =>
            borderRadius === "full"
                  ? theme.shape.full
                  : borderRadius === "lg"
                        ? theme.shape.lg
                        : borderRadius === "md"
                              ? theme.shape.md
                              : borderRadius === "sm"
                                    ? theme.shape.sm
                                    : null};
      border-bottom-left-radius: ${({ theme, bottomLeftBorderRadius }) =>
            bottomLeftBorderRadius === "lg"
                  ? theme.shape.lg
                  : bottomLeftBorderRadius === "md"
                        ? theme.shape.md
                        : bottomLeftBorderRadius === "sm"
                              ? theme.shape.sm
                              : bottomLeftBorderRadius === "none"
                                    ? "0px"
                                    : null};
      border-bottom-right-radius: ${({ theme, bottomRightBorderRadius }) =>
            bottomRightBorderRadius === "lg"
                  ? theme.shape.lg
                  : bottomRightBorderRadius === "md"
                        ? theme.shape.md
                        : bottomRightBorderRadius === "sm"
                              ? theme.shape.sm
                              : bottomRightBorderRadius === "none"
                                    ? "0px"
                                    : null};
      border-top-left-radius: ${({ theme, topLeftBorderRadius }) =>
            topLeftBorderRadius === "lg"
                  ? theme.shape.lg
                  : topLeftBorderRadius === "md"
                        ? theme.shape.md
                        : topLeftBorderRadius === "sm"
                              ? theme.shape.sm
                              : topLeftBorderRadius === "none"
                                    ? "0px"
                                    : null};
      border-top-right-radius: ${({ theme, topRightBorderRadius }) =>
            topRightBorderRadius === "lg"
                  ? theme.shape.lg
                  : topRightBorderRadius === "md"
                        ? theme.shape.md
                        : topRightBorderRadius === "sm"
                              ? theme.shape.sm
                              : topRightBorderRadius === "none"
                                    ? "0px"
                                    : null};


      overflow: ${({ overflow }) => overflow || "visible"};
      overflow-x: ${({ overflowX }) => overflowX || "visible"};
      overflow-y: ${({ overflowY }) => overflowY || "visible"};
      box-shadow: ${({ theme, boxShadow }) =>
            boxShadow ? theme.shadows[boxShadow] : null};
`;

export default Flex;