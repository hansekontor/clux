import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { LeftOutlined } from '@ant-design/icons';


const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    align-items: center;
    justify-content: center;
    // position: fixed;
    padding: 20px 0;
    top: 0;
    left: 0;
    z-index: 3;
    background-color: ${({ theme }) => theme.footer.background};
    box-sizing: border-box;
`;

const IconWrapper = styled.div`
    position: absolute;
    left: 0;
    padding-left: 3%;
    cursor: pointer;
`;

export const HeaderTitle = styled.div`
    font-family:  Helvetica;
    font-weight: 600;
    color: white;
`;

export default function Header() {
    const history = useHistory();

    const handleToWallet = () => {
        history.push("/wallet");
    }
    return (
        <HeaderContainer>
            <IconWrapper onClick={handleToWallet}>
                <LeftOutlined style={{ color: 'white' }} />
            </IconWrapper>
            <HeaderTitle>Refer & Earn</HeaderTitle>
        </HeaderContainer>
    )
}
