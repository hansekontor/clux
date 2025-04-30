import React from 'react';
import { PrimaryFooterBackground, SecondaryFooterBackground } from './FooterBackground.styles';

export default function FooterBackground({ variant, children, ...props }) {
    switch (variant) {
        case 'secondary':
            return <SecondaryFooterBackground {...props}>{children}</SecondaryFooterBackground>
        default:
            return <PrimaryFooterBackground {...props}>{children}</PrimaryFooterBackground>
    }
}
