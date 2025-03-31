import styled from "styled-components";
import RandomNumbers from '@components/RandomNumbers';
import { FadeOutAnimationShort } from '@components/CssAnimations';
import { AppCtn } from '@components/styles';


const AnimationCtn = styled.div`
    background-color: #fefffe;
    border-radius: 24px;
    border-style: none;
    width: 90%;
    margin-top: 9px;
    margin-bottom: 9px;
    height: 60%;
    overflow: hidden;
    position: relative;
    min-height: 300px;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const BackgroundCtn = styled.div`
    position: relative;
    bottom: 40%;
`;
const Background = styled.img`
    position: relative;
    left: 40px;
`;
const FlashCtn = styled.div`
    z-index: 100;
    position: absolute;
    overflow: visible;
    top: 10%;
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const StickyRandomNumbers = styled(RandomNumbers)`
    z-index: 1;
`;
const FadeOut = styled(AppCtn)`
    box-shadow: none;
    animate: fade-out 1s ease-out both;
    ${FadeOutAnimationShort}    
`;

export {
    AnimationCtn, 
    BackgroundCtn, 
    Background,
    FlashCtn, 
    StickyRandomNumbers, 
    FadeOut
}