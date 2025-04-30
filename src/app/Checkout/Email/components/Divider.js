import styled from "styled-components";

const Divider = styled.div`
	height: 1px;
	width: 100%;
	color: #00000;
	background-color: ${props => props.theme.checkout.divider};
`;

export default Divider;