// Typography.js
import React from "react";
import { StyledTypography } from "./Typography.styles";

const variantMapping = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "h6",
    subtitle2: "h6",
    body1: "p",
    body2: "p",
    caption: "span",
    overline: "span",
    inherit: "span",
};

export default function Typography({
    variant = "body1",
    as,
    children,
    fontSize,
    fontWeight,
    lineHeight,
    color,
    ...props
}) {
    const Component = as || variantMapping[variant] || "span";

    return (
        <StyledTypography
            as={Component}
            variant={variant}
            fontSize={fontSize}
            fontWeight={fontWeight}
            lineHeight={lineHeight}
            color={color}
            {...props}
        >
            {children}
        </StyledTypography>
    );
}