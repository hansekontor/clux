import styled from "styled-components";
import { Scrollable } from '@components/Common';

export const PrimaryFlexGrow = styled(Scrollable)`
    background-color:${props => props.theme.checkout.payment.background};
`;

export const SecondaryFlexGrow = styled(Scrollable)`
	background-color: ${props => props.theme.checkout.background};
`;