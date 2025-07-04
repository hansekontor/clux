import styled from "styled-components";
import Typography from '@components/Typography';

const ErrorMessage = styled(Typography).attrs({
	variant: "textItem"
})`
	background-color: ${props => props.theme.error.background};
	color: ${props => props.theme.error.color};
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default ErrorMessage;