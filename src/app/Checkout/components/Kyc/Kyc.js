import React from 'react'

// custom react components
import Header from '@components/Header';
import { SecondaryFlexGrow } from '../Styled';
import KycContent from './KycContent';
import PrimaryButton from '@components/PrimaryButton';

// core functions
import { useCheckout } from '@core/context/Checkout';

export default function Kyc() {
    const { handleKYC } = useCheckout();

    return (
        <>
            <Header />
            <SecondaryFlexGrow>
                <KycContent />
                <PrimaryButton onClick={handleKYC}>Continue</PrimaryButton>
            </SecondaryFlexGrow>
        </>
    )
}
