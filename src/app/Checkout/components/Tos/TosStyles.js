import styled from 'styled-components';

export const Scrollable = styled.div`
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    background-color: #FEFFFE;
`;
export const TosList = styled.ol`
    align-items: flex-start;
    display: inline-flex;
    flex-direction: column;
    height: fit-content;
    position: relative;
    width: 90%;
    gap: 10px;
`;
export const TosHeader = styled.p`
    color: #000000;
    font-family: "Inter-Medium", Helvetica;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0; 
    line-height: 25px;
    position: relative;
    width: 90%;
    top: 10px;
    text-align: left;
`; 
export const TosText = styled.li`
    color: #000000;
    font-family: "Inter-Medium", Helvetica;
    font-size: 14x;
    font-weight: 500;
    letter-spacing: 0; 
    line-height: 20px;
    position: relative;
    text-align: left;
    width: 90%;
`;

export const TosLink = styled.a`
    text-decoration-line: none;
`;