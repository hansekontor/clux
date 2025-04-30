import styled from 'styled-components';

export const Item = styled.div`
    background-color: #F6F6F6;
    height: 60px;
    width: 100%;
    border: 1px solid #DFDFDF; 
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const TopItem = styled(Item)`
    border-radius: 8px 8px 0 0;
`;

export const BottomItem = styled(Item)`
    border-radius: 0 0 8px 8px;
`;