import React from 'react';
import {
    StyledBoldHeader,
    StyledBoldText,
    StyledHeader,
    StyledLargeHeading,
    StyledParagraph,
    StyledText,
    StyledTextItem
} from './Typography.styles';

export default function Typography({ variant, weight, size, children, ...props }) {
    switch (variant) {
        case 'paragraph':
            return <StyledParagraph {...props}>{children}</StyledParagraph>;
        case 'textItem':
            return <StyledTextItem {...props}>{children}</StyledTextItem>;
        case 'header':
            switch (weight) {
                case 'bold':
                    return <StyledBoldHeader {...props}>{children}</StyledBoldHeader>;
                default:
                    switch (size) {
                        case 'large':
                            return <StyledLargeHeading {...props}>{children}</StyledLargeHeading>;
                        default:
                            return <StyledHeader {...props}>{children}</StyledHeader>;
                    }
            }
        case 'text':
        default:
            switch (weight) {
                case 'bold':
                    return <StyledBoldText {...props}>{children}</StyledBoldText>;
                default:
                    return <StyledText {...props}>{children}</StyledText>;
            }
    }
}
