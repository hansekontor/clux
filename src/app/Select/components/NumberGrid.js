import styled from "styled-components";

const NumberGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: ${({ theme }) => theme.spacing(0.5)};
    width: 100%;
    overflow-y: auto;
`;

export default NumberGrid;