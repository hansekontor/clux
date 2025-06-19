import styled from "styled-components";

export const BackgroundCover = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.color.background.cover};
    z-index: 99;
`;

export default BackgroundCover;