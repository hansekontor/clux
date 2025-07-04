import styled from "styled-components";

export const StyledParagraph = styled.p`
    color: ${props => props.theme.text.color};
    font-size: 16px;
    font-family: Helvetica;
    margin-block-start: 0px;
    margin-block-end: 0px;
    width: 100%;
    line-height: 140%;
    hyphens: auto;
    text-align: left;
`;
export const StyledText = styled.div`
    font-weight: 500;
    font-family: Helvetica;
    font-size: 14px;
    padding: 0px;
    text-align: left;
    margin: 0;
`;
export const StyledBoldText = styled(StyledText)`
    font-weight: 600;
`;
export const StyledHeader = styled(StyledText)`
    font-size: 16px;
`;
export const StyledBoldHeader = styled(StyledHeader)`
    font-weight: 600;
    margin: 6px; 0 0 0;
`;
export const StyledLargeHeading = styled(StyledBoldHeader)`
    margin: 12px 0 0 0;
    font-size: 24px;
    width: 100%;
`;

// // checkout styles
// const PaymentHeader = styled(HeaderText)`
//     width: 100%;
// `;

export const StyledTextItem = styled.div`
    border-radius: 12px;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 100%;
    border-style: none;
    text-indent: 12px;
`;