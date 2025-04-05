import styled from 'styled-components';
import { SlideIn as SlideInAnimation, FadeOutShort } from '@components/Animations';
import { Flash } from 'react-ruffle';


const Background = styled.img`
    position: absolute;
    bottom: 128px;
    margin-left: auto;
    margin-right: auto;
    height: 100vh;
    z-index: -4;
`;
const FlexGrow = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
	min-height: 60%;
`;
const Animation = styled.div`
    width: inherit;
    position: absolute; 
    display: ${props => props.$hidden ? 'none' : 'flex'};
    justify-content: center;
    align-items: center;
`;
const CustomFlash = styled(Flash)`
    position: absolute;
    visibility: ${props => props.$hidden ? "hidden" : "visible"};
`;
const SlideIn = styled.div`
    position: absolute;
    z-index: 200;
    top: 0;
    animation: slide-in-from-top 0.5s cubic-bezier(0.24, 0.48, 0.47, 0.95);

    ${SlideInAnimation};
`;
const FadeOut = styled.div`
    ${FadeOutShort};
`;
const Versus = styled.img`
    width: 70%;
`;
const animationStyle = { width: "960px", height: "600px" };
const faceoffAnimationStyle = { width: "960px", height: "600px", position: "absolute", marginLeft: "15%" };


export { 
    Background, 
    FlexGrow, 
    Animation, 
    CustomFlash, 
    SlideIn, 
    FadeOut,
    Versus, 
    animationStyle, 
    faceoffAnimationStyle
}