import React from 'react';
import { ReturnButton } from '@components/Button';
import { 
    StyledAgreeHeader, 
    StyledMerchant, 
    StyledMerchantLabel, 
    StyledMerchantName, 
    StyledNavigation, 
    StyledTitle 
} from './Navigation.styles';

// assets
import MerchantSvg from '@assets/svgs/merchant_icon.svg';

export default function Navigation({
    title,
    merchantTag,
    handleOnClick,
    children
}) {
    return (
        <StyledAgreeHeader>
            <StyledNavigation>
                <ReturnButton onClick={handleOnClick} />
                <StyledTitle>{title}</StyledTitle>
            </StyledNavigation>
            {merchantTag && (
                <StyledMerchant>
                    <img src={MerchantSvg} />
                    <StyledMerchantLabel></StyledMerchantLabel>
                    <StyledMerchantName>Marianas Blockchain Lottery</StyledMerchantName>
                </StyledMerchant>
            )}
            {children}
        </StyledAgreeHeader>
    )
}
