import React from "react";
import { StyledBalance } from './Balance.styles';
import { useApp } from 'blocklotto-sdk';

export default function Balance() {
    const { balance } = useApp();

    // Convert to string and pad to 6 digits
    const rawValue = String(Math.floor(balance || 0));
    const formattedValue = rawValue.padStart(6, '0');

    // Calculate the index from where the "real" number starts
    const activeStart = 6 - rawValue.length;

    return (
        <StyledBalance>
            {formattedValue.split('').map((char, index) => (
                <span key={index} className={index >= activeStart ? 'active' : ''}>
                    {char}
                </span>
            ))}
        </StyledBalance>
    );
}