import React from 'react';
import styled, {css} from 'styled-components';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { FadeInAnimation, FadeOutAnimationShort } from '@components/CssAnimations';
import { Background } from '@components/Container';

// styled css components
const LoaderBackground = styled(Background)`
    z-index: 332;
    background: ${props => props.theme.loader.background};

    ${FadeInAnimation}
    ${FadeOutAnimationShort}
`;
const LoadingCtn = styled.div`
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

    ${FadeInAnimation}
    ${FadeOutAnimationShort}
`;
const LoadingCircle = styled(Spin)`
    color: ${props => props.theme.loader.circle};
`;
const CustomLoadingIcon = styled(LoadingOutlined)`
    width: 64px;
    height: 64px;
    font-size: 64px;
`;
const Status = styled.div`
    font-family: Inter-Semibold, Helvetica;
    font-size: 20px;
    line-height: 140%;
`;


export const LoadingAnimation = ({
    loadingStatus, 
}) => {

    return (
        <>
            <LoaderBackground />
            <LoadingCtn >
                <LoadingCircle indicator={<CustomLoadingIcon spin />}/>
                <Status>{loadingStatus}</Status>
            </LoadingCtn>        
        </>
    )
}
