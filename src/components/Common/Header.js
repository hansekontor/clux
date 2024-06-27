import React from "react";
import styled from "styled-components";

const HeaderCtn = styled.div`
    margin-top: 0px;
    background-color: transparent;
    height: 83px;
`;
const SmallHeaderCtn = styled.div`
    width: 150px;
    height: 50px;
`;

const Title = styled.div`
    color: #000000;
    font-family: "Seymour One", Helvetica;
    font-size: 56px;
    font-weight: 600;
    height: 57px;
    transform: rotate(-2.5deg);
    text-align: center;
    -webkit-text-stroke: 5px white;
    -webkit-font-smoothing: antialiased;
    stroke-linejoin: round;
    background-color: transparent;
    
    text-shadow: 0 0 2px #FFF, 0 0 4px #FFF, 0 0 6px #FFF, 0 0 8px , 0 0 12px #00000040, 0 0 16px #00000040, 0 0 22px #00000040, 0 0 26px #00000040;
`;
const Subtitle = styled.div`
    color: #000000;
    font-family: "Seymour One", Helvetica;
    font-size: 20px;
    font-weight: 600;
    height: 21px;
    transform: rotate(-2.5deg);
    text-align: center;
    -webkit-text-stroke: 1px white;
    -webkit-font-smoothing: antialiased;
    stroke-linejoin: round;
    background-color: transparent;

    text-shadow: 0 0 1px #FFF, 0 0 1px #FFF, 0 0 2px #FFF, 0 0 2px , 0 0 3px #00000040, 0 0 4px #00000040, 0 0 5px #00000040, 0 0 6px #00000040;
`;
const SmallTitle = styled.div`
    color: #ffffff;
    font-family: "Seymour One", Helvetica;
    font-size: 54px;
    font-weight: 600;
    height: 55px;
    text-align: center;
    -webkit-text-stroke: 3px #696482;
    -webkit-font-smoothing: antialiased;
    stroke-linejoin: round;
    background-color: transparent;
    position: absolute;
    
    text-shadow: 0 0 1px #FFF, 0 0 2px #FFF, 0 0 3px #FFF, 0 0 4px , 0 0 6px #00000040, 0 0 8px #00000040, 0 0 11px #00000040, 0 0 13px #00000040;
`;



const Header = ({...props}) => {
    return (
        <HeaderCtn {...props}>
            <Title>CLUX</Title>
        </HeaderCtn>
    )
}

export const SmallHeader = ({...props}) => {
    return (
        <SmallHeaderCtn {...props}>
            <SmallTitle>CLUX</SmallTitle>
        </SmallHeaderCtn>
    )
}

export default Header;