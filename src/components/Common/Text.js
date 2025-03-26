import styled from 'styled-components';

export const Paragraph = styled.p`
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
export const Text = styled.div`
    font-weight: 500;
    font-family: Helvetica;
    font-size: 14px;
    padding: 0px;
    text-align: left;
    margin: 0;
`;
export const BoldText = styled(Text)`
    font-weight: 600;
`;
export const Header = styled(Text)`
    font-size: 16px;
`;
export const BoldHeader = styled(Header)`
    font-weight: 600;
    margin: 6px; 0 0 0;
`;
export const LargeHeading = styled(BoldHeader)`
    margin: 12px 0 0 0;
    font-size: 24px;
    width: 100%;
`;

// // checkout styles
// const PaymentHeader = styled(HeaderText)`
//     width: 100%;
// `;