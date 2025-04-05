import styled from "styled-components";

export const Details = styled.div`
    background-color: #f2bc57;
    height: 95px;
    display: flex; 
    justify-content: space-between;
    align-items: center;
    border-radius: 16px 16px 0 0;
    margin-top: 12px;
    width: 90%;
    border-bottom: 1px dashed black;
`;

export const Row = styled.div`
    display: flex;
    align-items: center;
    margin-left: 12px;
    gap: 12px;
`;

export const Column = styled(Row)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 46px;
    margin: 0;
`;

export const DateColumn = styled(Column)`
    align-items: baseline;
    gap: 0px;
`;

export const PriceColumn = styled(Column)`
    align-items: end;
    padding-right: 24px;
`;

export const Price = styled.div`
    font-family: "Sequel 100 Wide 95", Helvetica;
`;