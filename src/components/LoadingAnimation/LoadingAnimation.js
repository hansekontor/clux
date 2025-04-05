import React from 'react'
import {
    StyledLoaderBackground,
    StyledLoadingCircle,
    StyledLoadingContainer,
    StyledLoadingIcon,
    StyledStatus
} from './LoadingAnimation.styles'

export default function LoadingAnimation({
    loadingStatus,
}) {
    return (
        <>
            <StyledLoaderBackground />
            <StyledLoadingContainer >
                <StyledLoadingCircle indicator={<StyledLoadingIcon spin />} />
                <StyledStatus>{loadingStatus}</StyledStatus>
            </StyledLoadingContainer>
        </>
    )
}
