import styled from 'styled-components';

const Background = styled.img`
    position: absolute;
    top: 0;
    margin-left: auto;
    margin-right: auto;
    height: 85vh;
    z-index: -4;
    object-fit: cover;
`;
const FlexGrow = styled.div`
    flex-grow: 1;
    display: flex; 
    flex-direction: column;
    justify-content: flex-end;
`;

export {
    Background, 
    FlexGrow
}