import React from 'react';
import { useHistory } from 'react-router-dom';

// core functions
import { useCheckout } from 'blocklotto-sdk';

// custom react components
import Header from '@components/Header';
import Navigation from '@components/Navigation';
import PlayerNumbers from '@components/PlayerNumbers';
import Footer from '@components/Footer';
import Button from '@components/Button';
import FooterBackground from '../components/FooterBackground';
import Scrollable from './components/Scrollable';
import ContentHeader from './components/ContentHeader';
import List from './components/List';
import Text from './components/Text';
import Link from './components/Link';

export default function Tos() {
    const history = useHistory();
    const { handleAgree } = useCheckout();

    const handleReturn = () => {
        const previousPath = "/select";
        history.push(previousPath);
    }

    return (
        <>
            <Header />
            <Navigation
                handleOnClick={handleReturn}
                title={"Purchase Terms"}
            />
            <Scrollable>
                <ContentHeader>
                    <b>You are purchasing a lottery ticket for Block Lotto. </b>
                </ContentHeader>
                <List>
                    <Text>
                        The seller of the digital good in this transaction is {" "}
                        <Link href={"https://nmrai.com"} rel="noopener noreferrer" target="_blank">
                            {' Marianas Rai Corp.'}
                        </Link>, the operator of the lottery.
                    </Text>
                    <Text>
                        This purchase is for a lottery ticket only. It is not a purchase of digital currency, credits on any third-party platform, or any other product or service.
                    </Text>
                    <Text>
                        Once purchased, the data comprising the lottery ticket will be stored, as a transaction, on the eCash (XEC) blockchain. When the ticket transaction is confirmed in a block, this unhosted and non-custodial wallet will independently use the lottery ticket data to perform ticket redemption and (if applicable) payout of credits.
                    </Text>
                    <Text>
                        You have read and understand the {" "}
                        <Link href="https://example.com" rel="noopener noreferrer" target="_blank">
                            {' Terms & Conditions '}
                        </Link>
                        and
                        <Link href="https://example.com" rel="noopener noreferrer" target="_blank">
                            {' Privacy Policy '}
                        </Link>
                    </Text>
                </List>
            </Scrollable>
            <Footer variant="empty">
                <FooterBackground />
                <PlayerNumbers isFixed />
                <Button
                    onClick={handleAgree}
                >
                    Agree and Continue
                </Button>
            </Footer>
        </>
    )
}
