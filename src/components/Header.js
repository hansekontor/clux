// node modules
import React from "react";
import { useHistory } from 'react-router-dom';
import styled from "styled-components";

// assets
import CluxLogo from '@assets/clux_logo.png';

// styled css modules
const HeaderCtn = styled.div`
    margin-top: 0px;
    background-color:${props => props.$transparent ? "transparent" : props.theme.checkout.background};
    height: 83px;
    width: 100%;
`;
const HeaderIcon = styled.img`
    height: 90%;
    width: auto;
    cursor: pointer;
`;


const Header = ({...props}) => {

    const history = useHistory();

    const handleOnClick = () => {
        return history.push("/select");
    }
    return (
        <HeaderCtn {...props}>
            <HeaderIcon src={CluxLogo} onClick={handleOnClick}/>
        </HeaderCtn>
    )
}

export default Header;