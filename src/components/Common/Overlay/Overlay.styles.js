import styled from "styled-components";

export const StyledOverlay = styled.div`
    align-items: center;
	position: absolute;
	flex-direction: column;
	max-width: 480px;
	top: 0;
	right: 0;
	bottom: 0;
	right: 0 ;
	background: rgba(0, 0, 0, 0.5);
	transition: opacity 200ms;
	z-index: 10;
    width: 100vh;
`;