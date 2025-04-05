import styled from "styled-components";

export const StyledContainer = styled.div`
    width: 90%;
    height: 56px;
    border-radius: 0px 0px 16px 16px;
    background: ${props => props.theme.numbers.background};
    color: ${props => props.theme.text.color};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin-bottom: 12px;
`;

export const StyledVerticalDivider = styled.div`
    width: 1px;
    height: 56px;
    border-left: 1px dashed;
    background-color: ${props => props.theme.numbers.divider};
`;

export const StyledEnd = styled.div`
    width: 10%;
    object-fit: cover;
    position: relative;
`;

export const StyledLeftEnd = styled(StyledEnd)`
    margin-left: 0px;
    width: 10%;
`;

export const StyledRightEnd = styled(StyledEnd)`
    margin-right: 0px;
    width: 10%;
`;

export const StyledArrowIcon = styled.img`
    top: 2px;
    position: relative;
`;

export const StyledNumber = styled.div`
    text-align: center;    
    font-size: 24px;
    font-weight: 400;
    font-family: '${props => props.theme.text.font}', Helvetica;
    color: ${props => props.$blurred ? "transparent" : "#000000"};
    width: 20%;
    text-shadow: ${props => props.$blurred ? "0 0 20px black" : "none"};
`;

export const StyledCutOut = styled.div`
    position: absolute;
    top: -26px;
    border-radius: 24px;
    background-color: ${props => props.$color ? props.color : '#48445c'};
    width: 24px;
    height: 24px;
`;

export const StyledLeftCutOut = styled(StyledCutOut)`
    left: -12px;
`;

export const StyledRightCutOut = styled(StyledCutOut)`
    right: -12px;
`;

export const StyledMultiplier = styled.div`
	background-color: yellow;
	height: 50px;
	width: 50px;
	border-radius: 30px;
	position: absolute;
	right: 0;
	z-index: 10;
	font-size: 20px;
	font-weight: 600;
	display: flex;
	justify-content: center;
	align-items: center;
`;