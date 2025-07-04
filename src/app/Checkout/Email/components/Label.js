import styled from "styled-components";
import Typography from '@components/Typography';

const Label = styled(Typography).attrs({
	variant: "header", weight: "bold"
})`
	width: 100%;
`;

export default Label;