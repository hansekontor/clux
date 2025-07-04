import React from 'react';
import { StyledReturnButtonContainer } from './Button.styles';
import { ArrowLeftOutlined } from '@ant-design/icons';

export const ReturnButton = (props) => {
    return (
        <StyledReturnButtonContainer {...props}>
            <ArrowLeftOutlined />
        </StyledReturnButtonContainer>
    )
}