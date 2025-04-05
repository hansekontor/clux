import React from 'react'

// core functions
import { useCheckout } from '@core/context/Checkout';

// custom react components
import Header from '@components/Header';
import { SecondaryFlexGrow } from '../Styled';
import KycContent from './KycContent';
import Button from '@components/Button';

export default function Kyc() {
    const { handleKYC } = useCheckout();

    return (
        <>
            <Header />
            <SecondaryFlexGrow>
                <KycContent />
                <Button onClick={handleKYC}>Continue</Button>
            </SecondaryFlexGrow>
        </>
    )
}
