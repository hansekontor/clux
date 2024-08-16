// node modules
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

// custom react components
import PrimaryButton, { SecondaryButton } from '@components/Common/PrimaryButton';
import SeedPhrase from '@components/Common/SeedPhrase';
import { WalletContext } from '@utils/context';
import Notification from '@components/Common/Notifications';
import { Enfold } from '@components/Common/CssAnimations';
import { FadeInAnimation } from '@components/Common/CssAnimations';
import FadeInOut from './FadeInOut'

// assets
import BellSvg from '@assets/bell.svg';
import CopyboardSvg from '@assets/copyboard.svg';

// styled components
const Title = styled.div`
    color: #000000;
    z-index: 1;
    font-size: 30px;
    font-weight: 600;
`;
const CustomForm = styled.form`
    width: 90%;
`;
const Input = styled.input`
    border-radius: 12px;
    background-color: #F6F6F6;
    color: #ABABAB;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 100%;
    border-style: none;
`;
const Text = styled.p`
    color: #000000;
    font-size: 16px;
    line-height: 140%;
    font-size: "Inter-Semibold", Helvetica;
    margin-block-start: 0px;
    margin-block-end: 0px;
    width: 90%;
`;
const Modal = styled.div`
    width: 95%;
    background-color: #ffffff;
    gap: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px 0;
    border-radius: 20px;
`;

const ModalCtn = styled.div`
    width: 100%;
    gap: 24px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;

    ${FadeInAnimation}
`;
const BellIcon = styled.img``;
const CopyboardIcon = styled.img`
    position: relative;
    top: 3px;
    margin-right: 5px;
`;
const NavigationCount = styled.div`
    background-color: #f2bc57;
    border-radius: 33px;
    width: 100px;
    height: 30px;
    margin: auto;
    font-family: "Sequel 100 Wide 95";
    font-weight: 300;
    font-size: 14px;
    align-content: center;
`;


const Backup = ({
    purchasedTicket,
    passLoadingStatus,
}) => {
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;

    const [backupFinished, setBackupFinished] = useState(false);
    const [phraseCopied, setPhraseCopied] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    // helpers
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // stop loading screen after rendering has been completed
    useEffect(() => {
        passLoadingStatus(false);
    }, [])

    // handlers
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        // dev add email submission to server
        setFadeOut(true);
        await sleep(300);
        history.push('/waitingroom');
    }
    const handleCopySeedPhrase = () => {
        navigator.clipboard.writeText(wallet.mnemonic);
        setPhraseCopied(true);
    }
    const handleBackupFinished = (e) => {
        e.preventDefault();
        setBackupFinished(true);
    }


    return (
        <>
            {phraseCopied && <Notification type="success" string={"Copied to clipboard"} />}
            <FadeInOut show={!fadeOut} duration={300}>
                <ModalCtn>
                    <Modal >
                        <BellIcon src={BellSvg} />
                        {!backupFinished ? (
                            <>
                                <Title>Backup Wallet</Title>
                                <Text>This unhosted and non-custodial wallet associated with this lottery game is not backed up. Please backup your seed phrase and secure this wallet to avoid loss of funds from potential winnings.</Text>
                                <SeedPhrase 
                                    phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                                />             
                                <SecondaryButton type="button" onClick={handleCopySeedPhrase}>
                                <CopyboardIcon src={CopyboardSvg} />Copy</SecondaryButton>
                                <PrimaryButton type="button" onClick={handleBackupFinished}>I've Secured</PrimaryButton> 
                            </>
                        ) : (
                            <>
                                <Title>Get Notified</Title>
                                <Text>Results are usually available in approximately 10 minutes or less.</Text>
                                <Text>Enter your email address to get notified when your results are ready.</Text>
                                <CustomForm id='email-form' onSubmit={handleOnSubmit}>
                                    <Input 
                                        placeholder="Enter your Email"
                                    />
                                </CustomForm>                                       
                                <PrimaryButton form='email-form' type="submit">Submit</PrimaryButton>                                
                            </>
                        )}
                    </Modal>                                        
                    <NavigationCount>{!backupFinished ? "1 / 2" : "2 / 2"}</NavigationCount>
                </ModalCtn>
            </FadeInOut>
        </>
    )
}

export default Backup;