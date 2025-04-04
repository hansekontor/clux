import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 90%;
`;

export const Header = styled.div`
    font-weight: 700;
    font-size: 20px;
    font-family: Helvetica;
    padding: 12px 0;
`;

export const Subtitle = styled.div`
    font-family: 12px;
    padding-bottom: 7px;
`;

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

export const Content = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: 12px;
`;

export const Subscript = styled.div`
    font-size: 12px;
    padding: 12px 0;
`;