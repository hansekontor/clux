import React from 'react'
import { PrimaryFlexGrow, SecondaryFlexGrow } from './FlexGrow.styles'

export default function FlexGrow({ variant, children, ...props }) {
    switch (variant) {
        case 'secondary':
            return <SecondaryFlexGrow {...props}>{children}</SecondaryFlexGrow>
        default:
            return <PrimaryFlexGrow {...props}>{children}</PrimaryFlexGrow>
    }
}
