import React from 'react'

// custom react components
import Header from '@components/Header';
import NavigationBar from '@components/Navigation';
import RandomNumbers from '@components/RandomNumbers';
import PrimaryButton from '@components/PrimaryButton';
import { FooterCtn } from '@components/Footer';
import { PrimaryFooterBackground } from '../Styled';

import TosContent from './TosContent';

// core functions
import { useCheckout } from '@core/context/Checkout';

const tosTitle = "Purchase Terms";
const agreeButtonText = "Agree and Continue";

export default function Tos() {
    const {
        playerNumbers,
        handleReturn,
        handleAgree,
    } = useCheckout();

    return (
        <>
            <Header />
            <NavigationBar
                handleOnClick={handleReturn}
                title={tosTitle}
            />
            
            <TosContent />
            <FooterCtn>
                <PrimaryFooterBackground />
                <RandomNumbers
                    fixedRandomNumbers={playerNumbers}
                />
                <PrimaryButton
                    onClick={handleAgree}
                >
                    {agreeButtonText}
                </PrimaryButton>
            </FooterCtn>
        </>
    )
}
