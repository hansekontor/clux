import styled from "styled-components";
import { Background } from '@components/Common';

export const PrimaryFooterBackground = styled(Background)`
    background-color:${props => props.theme.checkout.payment.background};
`;

export const SecondaryFooterBackground = styled(Background)`
	background-color: ${props => props.theme.checkout.background};
`;