import React from 'react'
import styled from 'styled-components';
import { Input } from '@components/Inputs';
import Button from '@components/Button';

import { useNotifications } from 'blocklotto-sdk';

const CopyCodeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    box-sizing: border-box;
`;

const CopyButton = styled(Button)`
    font-family: inherit;
    font-size: inherit;
    width: auto;
    min-width: 120px;
`;

export default function CopyCode({ value }) {
    const notify = useNotifications();

    const handleCopyClick = () => {
        navigator.clipboard.writeText(value);
        notify({
            type: 'success',
            message: 'Copied to clipboard',
        });
    }

    return (
        <CopyCodeContainer>
            <Input value={value}/>
            <CopyButton onClick={handleCopyClick}>Share</CopyButton>
        </CopyCodeContainer>
    )
}
