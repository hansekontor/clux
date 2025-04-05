import styled from "styled-components";
import { Background } from '@components/Common';
import { FadeIn, FadeOutShort } from '@components/Animations';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const StyledLoaderBackground = styled(Background)`
    z-index: 332;
    background: ${props => props.theme.loader.background};

    ${FadeIn}
    ${FadeOutShort}
`;

export const StyledLoadingContainer = styled.div`
    z-index: 333;
    background-color: ${props => props.theme.loader.container};
    gap: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;    
    padding: 24px 0;    
    border-radius: 20px;
    width: 250px;
    position: fixed;

    ${FadeIn}
    ${FadeOutShort}
`;

export const StyledLoadingCircle = styled(Spin)`
    color: ${props => props.theme.loader.circle};
`;

export const StyledLoadingIcon = styled(LoadingOutlined)`
    width: 64px;
    height: 64px;
    font-size: 64px;
`;

export const StyledStatus = styled.div`
    font-family: Inter-Semibold, Helvetica;
    font-size: 20px;
    line-height: 140%;
`;