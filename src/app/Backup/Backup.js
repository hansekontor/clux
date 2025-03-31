// node modules
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// custom react components
import PrimaryButton, { SecondaryButton } from '@components/PrimaryButton';
import SeedPhrase from '@components/SeedPhrase';
import { WalletContext } from '@utils/context';
import FadeInOut from '@components/FadeInOut'
import { successNotification } from '@components/Notifications';
import { LargeHeading } from '@components/Text';
import { Paragraph } from '@components/Text';
import * as S from './components/Styled';

// assets
import CopyboardSvg from '@assets/svgs/copyboard.svg';

// styled components
import { CopyboardIcon, Modal, ModalCtn } from './components/Styled';


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
                <S.ModalCtn>
                    <S.Modal>
                        <LargeHeading>Backup Account</LargeHeading>
                        <Paragraph>This unhosted and non-custodial wallet associated with this lottery game is not backed up. Please backup your seed phrase and secure this wallet to avoid loss of funds from potential winnings.</Paragraph>
                        <SeedPhrase 
                            phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                        />            
                        <SecondaryButton type="button" onClick={handleCopySeedPhrase}>
                            <S.CopyboardIcon src={CopyboardSvg} />
                            Copy
                        </SecondaryButton>
                        <PrimaryButton type="button" onClick={handleBackedUp}>I've Secured</PrimaryButton> 
                    </S.Modal>                                        
                </S.ModalCtn>
            </FadeInOut>
        </>
    )
}

export default Backup;