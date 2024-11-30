// node modules
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

// custom react components
import PrimaryButton, { SecondaryButton } from '@components/Common/PrimaryButton';
import SeedPhrase from '@components/Common/SeedPhrase';
import { WalletContext } from '@utils/context';
import { FadeInAnimation } from '@components/Common/CssAnimations';
import FadeInOut from './FadeInOut'
import { successNotification } from '@components/Common/Notifications';

// assets
import CopyboardSvg from '@assets/copyboard.svg';

// styled components
const Title = styled.div`
    color: #000000;
    z-index: 1;
    font-size: 30px;
    font-weight: 600;
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
const CopyboardIcon = styled.img`
    position: relative;
    top: 3px;
    margin-right: 5px;
`;


const Backup = ({
    passLoadingStatus,
}) => {
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;

    const [fadeOut, setFadeOut] = useState(false);

    // manually stop loading screen
    useEffect(() => {
        passLoadingStatus(false);
    }, [])

    // handlers
    const handleCopySeedPhrase = () => {
        navigator.clipboard.writeText(wallet.mnemonic);
        successNotification("Copied to clipboard");
    }
    const handleBackedUp = (e) => {
        e.preventDefault();
        setFadeOut(true);
        history.push('/waitingroom');
    }


    return (
        <>
            <FadeInOut show={!fadeOut} duration={300}>
                <ModalCtn>
                    <Modal >
                        <Title>Backup Account</Title>
                        <Text>This unhosted and non-custodial wallet associated with this lottery game is not backed up. Please backup your seed phrase and secure this wallet to avoid loss of funds from potential winnings.</Text>
                        <SeedPhrase 
                            phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                        />            
                        <SecondaryButton type="button" onClick={handleCopySeedPhrase}>
                            <CopyboardIcon src={CopyboardSvg} />
                            Copy
                        </SecondaryButton>
                        <PrimaryButton type="button" onClick={handleBackedUp}>I've Secured</PrimaryButton> 
                    </Modal>                                        
                </ModalCtn>
            </FadeInOut>
        </>
    )
}

export default Backup;