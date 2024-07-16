import React from "react";
import styled from "styled-components";

import CluxLogo from '@assets/clux_logo.png';

const HeaderCtn = styled.div`
    margin-top: 0px;
    background-color:${props => props.background ? props.background : "transparent"};
    height: 83px;
    width: 100%;
`;
const HeaderIcon = styled.img`
    height: 90%;
    width: auto;
`;


const Header = ({...props}) => {
    return (
        <HeaderCtn {...props}>
            <HeaderIcon src={CluxLogo} />
        </HeaderCtn>
    )
}


export default Header;