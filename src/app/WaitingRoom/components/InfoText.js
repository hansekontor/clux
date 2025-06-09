import React from 'react';
import styled from 'styled-components';

import StyledParagraph from '@components/Typography';

const InfoTextContainer = styled.div`
    width: 90%;
    color: #FFFFFF;
`;

const InfoText = ({ children }) => {

    return (
        <>
            <InfoTextContainer>
                <StyledParagraph>
                    {children}
                </StyledParagraph>
            </InfoTextContainer>
        </>
    )
}

export default InfoText;