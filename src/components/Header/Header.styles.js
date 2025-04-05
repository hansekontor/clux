import styled from "styled-components";

export const StyledHeader = styled.div`
    margin-top: 0px;
    background-color:${props => props.$transparent ? "transparent" : props.theme.checkout.background};
    height: 83px;
    width: 100%;
`;
export const StyledHeaderIcon = styled.img`
    height: 90%;
    width: auto;
    cursor: pointer;
`;