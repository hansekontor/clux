// node modules
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';

// react components 
import SeedPhrase from '@components/SeedPhrase';

import Header from '@components/Header';
import Navigation from '@components/Navigation';
import Footer, { SupportBar } from '@components/Footer';
import { BillIcon, TicketIcon, ContactIcon, KeyIcon, LightWalletIcon, EnvelopeIcon, QrCodeIcon } from '@components/Icons';
import Typography from '@components/Typography';
import Button from '@components/Button';

import TicketHistory from './components/TicketHistory';
import Email from './components/Email';
import ImportWallet from './components/ImportWallet';
import * as S from './components/Styled';

// core functions
import { useApp } from 'blocklotto-sdk';
import { getWalletState } from 'blocklotto-sdk';
import sleep from '@utils/sleep';
import { useNotifications } from 'blocklotto-sdk';

// assets 
import RightArrowSvg from '@assets/svgs/arrow_right.svg';
import PencilIconSvg from '@assets/svgs/pencil_icon.svg';


const Wallet = ({
    passLoadingStatus,
}) => {
    const history = useHistory();
    const location = useLocation();
    const { wallet, redeemableTickets, updateWallet, walletUpdateAvailable, setGameTickets, email, user } = useApp();
    const walletState = getWalletState(wallet);
    const { tickets, slpBalancesAndUtxos } = walletState;
    const [selection, setSelection] = useState(false);
    const ticketIndicator = redeemableTickets.length;
    const notify = useNotifications();

    useEffect(() => {
        passLoadingStatus(false);
        setGameTickets([]);
    }, [])

    // handlers
    const handleReturn = () => {
        if (selection)
            setSelection(false);
        else
            history.push("/select");
    }
    const handleToCashout = async () => {
        passLoadingStatus("LOADING WALLET");
        history.push("/cashout");
    }
    const handleToTickets = () => {
        setSelection("Tickets");
    }
    const handleShowPhrase = () => {
        setSelection("Seed Phrase");
    };
    const handleChangeEmail = () => {
        setSelection("Email");
    }
    const handleToAffiliate = () => {
        history.push("/affiliate");
    }
    const handleImportWallet = () => {
        setSelection("Import Wallet");
    }
    const handleToTos = () => {
        window.location.href = "https://dollar.mp";
    }
    const handleToPrivacyPolicy = () => {
        window.location.href = "https://dollar.mp";
    }
    const handleToRegulation = () => {
        window.location.href = "https://dollar.mp";
    }
    const handleToResponsibleGaming = () => {
        window.location.href = "https://dollar.mp";
    }

    const handleCopySeedPhrase = () => {
        navigator.clipboard.writeText(wallet.mnemonic);
        notify({ message: "Copied to clipboard", type: "success" });
    }

    const title = "Wallet, Settings and Legal";

    return (
        <>
            <S.StyledFadeInOut duration={300} show={true}>
                <Header />
                <Navigation
                    handleOnClick={handleReturn}
                    title={selection ? selection : title}
                    light={true}
                >
                    {walletUpdateAvailable && selection === "Tickets" &&
                        <S.SyncButton 
                            variant="tertiary"
                            onClick={updateWallet}
                        >
                            Sync Wallet
                        </S.SyncButton>
                    }
                </Navigation>

                <S.WalletCtn>
                    {!selection && (
                        <>
                            {slpBalancesAndUtxos?.tokens?.length > 0 &&
                                <S.Item onClick={handleToCashout}>
                                    <S.LabelCtn>
                                        <BillIcon />
                                        <S.Label>Cash Out</S.Label>
                                    </S.LabelCtn>
                                    <S.ImgButton src={RightArrowSvg} />
                                </S.Item>
                            }

                            {tickets.length > 0 && (
                                <S.Item onClick={handleToTickets}>
                                    <S.LabelCtn>
                                        <TicketIcon indicator={ticketIndicator} />
                                        <S.Label>Your Tickets</S.Label>
                                    </S.LabelCtn>
                                    <S.ImgButton src={RightArrowSvg} />
                                </S.Item>
                            )}
                            <S.Item>
                                <S.LabelCtn>
                                    <ContactIcon />
                                    <S.Label>Contact Us</S.Label>
                                </S.LabelCtn>
                                <S.ImgButton src={RightArrowSvg} />
                            </S.Item>

                            <S.SmallItem>
                                Your Wallet
                            </S.SmallItem>

                            <S.Item onClick={handleShowPhrase}>
                                <S.LabelCtn>
                                    <KeyIcon />
                                    <S.Label>Show Seed Phrase</S.Label>
                                </S.LabelCtn>
                                <S.ImgButton src={RightArrowSvg} />
                            </S.Item>
                            <S.Item>
                                <S.LabelCtn>
                                    <LightWalletIcon />
                                    <S.Label>Wallet Address</S.Label>
                                </S.LabelCtn>
                                <S.Link href={`https://explorer.e.cash/address/${wallet.Path1899.cashAddress}`} rel="noopener noreferrer" target="_blank">
                                    <S.Value>
                                        {wallet.Path1899.cashAddress.slice(0, 10) + "..." + wallet.Path1899.cashAddress.slice(-4)}
                                    </S.Value>
                                    <LinkOutlined />
                                </S.Link>
                            </S.Item>
                            {(email || user.email) &&
                                <S.Item onClick={handleChangeEmail}>
                                    <S.LabelCtn>
                                        <EnvelopeIcon />
                                        <S.Label>Email</S.Label>
                                    </S.LabelCtn>
                                    <S.Value>{email || user.email}</S.Value>
                                    <S.ImgButton src={PencilIconSvg} />
                                </S.Item>
                            }
                            <S.Item onClick={handleToAffiliate}>
                                <S.LabelCtn>
                                    <QrCodeIcon />
                                    <S.Label>Affiliate</S.Label>
                                </S.LabelCtn>
                                <S.ImgButton src={RightArrowSvg} />
                            </S.Item>

                            <S.SmallItem onClick={handleImportWallet}>
                                <S.Label>
                                    Import Wallet
                                </S.Label>
                                <S.ImgButton src={RightArrowSvg} />

                            </S.SmallItem>
                            <S.SmallItem onClick={handleToTos}>
                                <S.Label>
                                    Terms of Use
                                </S.Label>
                                <S.ImgButton src={RightArrowSvg} />

                            </S.SmallItem>
                            <S.SmallItem onClick={handleToPrivacyPolicy}>
                                <S.Label>
                                    Privacy Policy
                                </S.Label>
                                <S.ImgButton src={RightArrowSvg} />

                            </S.SmallItem>
                            <S.SmallItem onClick={handleToRegulation}>
                                <S.Label>
                                    Regulatory Information
                                </S.Label>
                                <S.ImgButton src={RightArrowSvg} />

                            </S.SmallItem>
                            <S.SmallItem onClick={handleToResponsibleGaming}>
                                <S.Label>
                                    Responsible Gaming Policy
                                </S.Label>
                                <S.ImgButton src={RightArrowSvg} />
                            </S.SmallItem>
                        </>
                    )}
                    {selection === "Tickets" &&
                        <TicketHistory
                            tickets={tickets}
                            passLoadingStatus={passLoadingStatus}
                        />
                    }
                    {selection === "Seed Phrase" &&
                        <S.SeedPhraseCtn>
                            <KeyIcon />
                            <Typography variant="header" size="large">Backup Wallet</Typography>
                            <Typography variant="paragraph">Please write down this 12 word mnemonic seed phrase. Store this in a safe place. It's the only way to recover your account if you get locked out or move to a new device.</Typography>
                            <SeedPhrase
                                phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                            />
                            <S.StyledPrimaryButton type="button" onClick={() => setSelection(false)}>
                                I've backed up my wallet
                            </S.StyledPrimaryButton>
                            <S.CopyButton onClick={handleCopySeedPhrase}>
                                Copy {" "}
                                <CopyOutlined />
                            </S.CopyButton>
                        </S.SeedPhraseCtn>

                    }
                    {selection === "Email" &&
                        <Email />
                    }
                    {selection === "Import Wallet" &&
                        <ImportWallet
                            currentAddress={wallet.Path1899.cashAddress}
                            passLoadingStatus={passLoadingStatus}
                        />
                    }
                </S.WalletCtn>
                <Footer variant="empty">
                    <SupportBar slpBalances={slpBalancesAndUtxos} />
                </Footer>
            </S.StyledFadeInOut>
        </>

    );
};

Wallet.defaultProps = {
    paymentUrl: "",
    paymentRequest: {},
    onSuccess: (hash, link) => {
        console.log("Payment successful", hash)
        console.log("Explorer view:", link);
    },
    onCancel: status => {
        console.log("Payment cancelled:", status);
    },
    origin: "/",
    passLoadingStatus: () => {
        console.log("placeholder function");
    },
};

Wallet.propTypes = {
    paymentUrl: PropTypes.string,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    passLoadingStatus: PropTypes.func,
    origin: PropTypes.string,
};

export default Wallet;
