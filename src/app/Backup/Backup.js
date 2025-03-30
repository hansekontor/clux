// node modules
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

// custom react components
import PrimaryButton, { SecondaryButton } from '@components/PrimaryButton';
import SeedPhrase from '@components/SeedPhrase';
import { WalletContext } from '@utils/context';
import { FadeInAnimation } from '@components/CssAnimations';
import FadeInOut from './FadeInOut'
import { successNotification } from '@components/Notifications';
import { LargeHeading } from '@components/Text';
import { Paragraph } from '@components/Text';

// assets
import CopyboardSvg from '@assets/svgs/copyboard.svg';

// styled components
const Modal = styled.div`
    width: 95%;
    background-color: #FEFFFE;
    gap: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px 0;
    border-radius: 20px;
    div, p {
        text-align: center;
    }
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
                        <LargeHeading>Backup Account</LargeHeading>
                        <Paragraph>This unhosted and non-custodial wallet associated with this lottery game is not backed up. Please backup your seed phrase and secure this wallet to avoid loss of funds from potential winnings.</Paragraph>
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