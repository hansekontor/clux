import React from 'react';
import styled, {css} from 'styled-components';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { FadeInAnimation, FadeOutAnimationShort } from '@components/Common/CssAnimations';

// styled css components
const Background = styled.div`
    z-index: 332;
    background: #000000;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    ${FadeInAnimation}
    ${FadeOutAnimationShort}
`;
const LoadingCtn = styled.div`
    z-index: 333;
    background-color: #ffffff;
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
    color: #32C770;
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
            <Background />
            <LoadingCtn >
                <LoadingCircle indicator={<CustomLoadingIcon spin />}/>
                <Status>{loadingStatus}</Status>
            </LoadingCtn>        
        </>
    )
}
