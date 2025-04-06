import styled from "styled-components";
import ChickenBackgroundPng from '@assets/images/ResultBackground.png';

const FlashContainer = styled.div`
    border-radius: 12px;
    width: 90%;
    height: 40%;
    flex-grow: 1;
	background-image: url(${ChickenBackgroundPng});
	position: relative;
	display: flex;
	justify-content:center;
	overflow: hidden;
`;

export default FlashContainer;