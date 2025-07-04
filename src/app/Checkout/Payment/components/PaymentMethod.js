import styled from "styled-components";
import ErrorMessage from "../../components/ErrorMessage";

const PaymentMethod = styled(ErrorMessage)`
	background-color: ${props => props.$active ? props.theme.checkout.methods.active.background : props.theme.checkout.methods.inactive.background};
	color: ${props => props.$active ? props.theme.checkout.methods.active.color : props.theme.checkout.methods.inactive.color};
	border-width: 1px;
	border-style: solid;
	border-color: ${props => props.theme.checkout.methods.border};
`;

export default PaymentMethod;