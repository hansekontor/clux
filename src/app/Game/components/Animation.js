import styled from "styled-components";

const Animation = styled.div`
    width: inherit;
    position: absolute; 
    display: ${props => props.$hidden ? 'none' : 'flex'};
    justify-content: center;
    align-items: center;
`;

export default Animation;