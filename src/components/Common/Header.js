import React from "react";
import styled from "styled-components";

const HeaderCtn = styled.div`
    height: 84px;
    width: 284px;
    top: 0;
    margin-bottom: 0px;
    position: absolute;
    background-color: transparent;
`;
const Title = styled.div`
    color: #000000;
    font-family: "Seymour One", Helvetica;
    font-size: 72px;
    font-weight: 600;
    height: 73px;
    transform: rotate(-2.5deg);
    text-align: center;
    -webkit-text-stroke: 6px white;
    -webkit-font-smoothing: antialiased;
    stroke-linejoin: round;
    background-color: transparent;
    top: 5px;
    position: absolute;
    
    text-shadow: 0 0 2px #FFF, 0 0 4px #FFF, 0 0 6px #FFF, 0 0 8px , 0 0 12px #00000040, 0 0 16px #00000040, 0 0 22px #00000040, 0 0 26px #00000040;
`;

/*
    fill: none;
    stroke: red;
    stroke-width:2px;
    stroke-linejoin: round;
    left: -6px;
    line-height: 72.6px;
    position: absolute;
    top: -3px;
    white-space: nowrap;
    letter-spacing: -3px;

*/


const Header = ({...props}) => {
    return (
        <HeaderCtn {...props}>
            <Title>CLUX</Title>
        </HeaderCtn>
    )
}

export default Header;