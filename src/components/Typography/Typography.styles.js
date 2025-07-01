import styled, { css } from "styled-components";
import { resolveThemeColor } from "@utils/themeUtils";

const baseTypographyStyles = css`
  color: inherit;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  line-height: 1.5;
  margin: 0;
  padding: 0;
  text-align: inherit;
  text-decoration: none;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  overflow-wrap: normal;
  overflow: visible;
  text-overflow: clip;
  display: block;
  width: auto;
  max-width: 100%;
  box-sizing: border-box;
`;

const variantStyles = {
    h1: css`
        font-size: ${({ theme }) => theme.typography.h1.fontSize};
        font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
        line-height: ${({ theme }) => theme.typography.h1.lineHeight};
        font-family: ${({ theme }) => theme.typography.h1.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.h1.letterSpacing};
    `,
    h2: css`
        font-size: ${({ theme }) => theme.typography.h2.fontSize};
        font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
        line-height: ${({ theme }) => theme.typography.h2.lineHeight};
        font-family: ${({ theme }) => theme.typography.h2.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.h2.letterSpacing};
    `,
    h3: css`
        font-size: ${({ theme }) => theme.typography.h3.fontSize};
        font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
        line-height: ${({ theme }) => theme.typography.h3.lineHeight};
        font-family: ${({ theme }) => theme.typography.h3.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.h3.letterSpacing};
    `,
    h4: css`
        font-size: ${({ theme }) => theme.typography.h4.fontSize};
        font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
        line-height: ${({ theme }) => theme.typography.h4.lineHeight};
        font-family: ${({ theme }) => theme.typography.h4.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.h4.letterSpacing};
    `,
    h5: css`
        font-size: ${({ theme }) => theme.typography.h5.fontSize};
        font-weight: ${({ theme }) => theme.typography.h5.fontWeight};
        line-height: ${({ theme }) => theme.typography.h5.lineHeight};
        font-family: ${({ theme }) => theme.typography.h5.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.h5.letterSpacing};
    `,
    h6: css`
        font-size: ${({ theme }) => theme.typography.h6.fontSize};
        font-weight: ${({ theme }) => theme.typography.h6.fontWeight};
        line-height: ${({ theme }) => theme.typography.h6.lineHeight};
        font-family: ${({ theme }) => theme.typography.h6.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.h6.letterSpacing};
    `,
    subtitle1: css`
        font-size: ${({ theme }) => theme.typography.subtitle1.fontSize};
        font-weight: ${({ theme }) => theme.typography.subtitle1.fontWeight};
        line-height: ${({ theme }) => theme.typography.subtitle1.lineHeight};
        font-family: ${({ theme }) => theme.typography.subtitle1.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.subtitle1.letterSpacing};
    `,
    subtitle2: css`
        font-size: ${({ theme }) => theme.typography.subtitle2.fontSize};
        font-weight: ${({ theme }) => theme.typography.subtitle2.fontWeight};
        line-height: ${({ theme }) => theme.typography.subtitle2.lineHeight};
        font-family: ${({ theme }) => theme.typography.subtitle2.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.subtitle2.letterSpacing};
    `,
    body1: css`
        font-size: ${({ theme }) => theme.typography.body1.fontSize};
        font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
        line-height: ${({ theme }) => theme.typography.body1.lineHeight};
        font-family: ${({ theme }) => theme.typography.body1.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.body1.letterSpacing};
    `,
    body2: css`
        font-size: ${({ theme }) => theme.typography.body2.fontSize};
        font-weight: ${({ theme }) => theme.typography.body2.fontWeight};
        line-height: ${({ theme }) => theme.typography.body2.lineHeight};
        font-family: ${({ theme }) => theme.typography.body2.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.body2.letterSpacing};
    `,
    caption: css`
        font-size: ${({ theme }) => theme.typography.caption.fontSize};
        font-weight: ${({ theme }) => theme.typography.caption.fontWeight};
        line-height: ${({ theme }) => theme.typography.caption.lineHeight};
        font-family: ${({ theme }) => theme.typography.caption.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.caption.letterSpacing};
    `,
    overline: css`
        font-size: ${({ theme }) => theme.typography.overline.fontSize};
        font-weight: ${({ theme }) => theme.typography.overline.fontWeight};
        line-height: ${({ theme }) => theme.typography.overline.lineHeight};
        font-family: ${({ theme }) => theme.typography.overline.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.overline.letterSpacing};
        text-transform: ${({ theme }) => theme.typography.overline.textTransform};
    `,
    inherit: css`
        font-size: ${({ theme }) => theme.typography.inherit.fontSize};
        font-weight: ${({ theme }) => theme.typography.inherit.fontWeight};
        line-height: ${({ theme }) => theme.typography.inherit.lineHeight};
        font-family: ${({ theme }) => theme.typography.inherit.fontFamily};
        letter-spacing: ${({ theme }) => theme.typography.inherit.letterSpacing};
    `,
};

export const StyledTypography = styled.div`
    ${baseTypographyStyles}
    ${({ variant }) => variant && variantStyles[variant]}

    /* Allow overrides */
    ${({ fontSize }) => fontSize && `font-size: ${fontSize};`}
    ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight};`}
    ${({ lineHeight }) => lineHeight && `line-height: ${lineHeight};`}
    ${({ textAlign }) => textAlign && `text-align: ${textAlign};`}
    ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
    ${({ letterSpacing }) => letterSpacing && `letter-spacing: ${letterSpacing};`}
    ${({ whiteSpace }) => whiteSpace && `white-space: ${whiteSpace};`}
    ${({ overflow }) => overflow && `overflow: ${overflow};`}
    ${({ textOverflow }) => textOverflow && `text-overflow: ${textOverflow};`}
    ${({ wordBreak }) => wordBreak && `word-break: ${wordBreak};`}
    ${({ overflowWrap }) => overflowWrap && `overflow-wrap: ${overflowWrap};`}

    /* Themed color */
    ${({ theme, color }) =>
        color ? `color: ${resolveThemeColor(theme, color)};` : ""}

    ${({ theme, disabled }) =>
        disabled ? `color: ${theme.color.text.disabled};` : ""}
`;