import styled from "styled-components";

export const Container = styled.div`
    box-sizing: border-box;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    padding-left: ${({ theme }) => theme.spacing(2)};
    padding-right: ${({ theme }) => theme.spacing(2)};
    height: ${({ height }) => height || "auto"};
    min-height: ${({ minHeight }) => minHeight || "auto"};
    max-width: ${({ theme, maxWidth }) =>
        maxWidth ? theme.breakpoints.values[maxWidth] : "100%"};
    flex-grow: ${({ flexGrow }) => flexGrow || 0};
    overflow: ${({ overflow }) => overflow || "visible"};
    overflow-x: ${({ overflowX }) => overflowX || "visible"};
    overflow-y: ${({ overflowY }) => overflowY || "visible"};
`;

export default Container;