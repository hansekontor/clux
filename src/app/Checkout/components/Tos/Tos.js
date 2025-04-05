import React from 'react'

// core functions
import { useCheckout } from '@core/context/Checkout';

// custom react components
import Header from '@components/Header';
import Navigation from '@components/Navigation';
import PlayerNumbers from '@components/PlayerNumbers';
import Footer from '@components/Footer';
import { PrimaryFooterBackground } from '../Styled';
import TosContent from './TosContent';
import Button from '@components/Button';

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
            <Navigation
                handleOnClick={handleReturn}
                title={tosTitle}
            />
            
            <TosContent />
            <Footer variant="empty">
                <PrimaryFooterBackground />
                <PlayerNumbers
                    fixedRandomNumbers={playerNumbers}
                />
                <Button
                    onClick={handleAgree}
                >
                    {agreeButtonText}
                </Button>
            </Footer>
        </>
    )
}
