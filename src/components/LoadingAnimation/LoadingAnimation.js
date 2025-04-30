import React from 'react'
import {
    StyledLoaderBackground,
    StyledLoadingCircle,
    StyledLoadingWrapper,
    StyledLoadingContainer,
    StyledLoadingIcon,
    StyledStatus
} from './LoadingAnimation.styles'

export default function LoadingAnimation({
    children,
}) {
    return (
        <StyledLoadingWrapper>
            <StyledLoaderBackground />
            <StyledLoadingContainer >
                <StyledLoadingCircle indicator={<StyledLoadingIcon spin />} />
                <StyledStatus>{children}</StyledStatus>
            </StyledLoadingContainer>
        </StyledLoadingWrapper>
    )
}
