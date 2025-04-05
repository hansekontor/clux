// node modules
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// core functions
import { useNotifications } from '@core/context/Notifications';
import { useWallet } from '@core/context/Wallet';

// custom react components
import SeedPhrase from '@components/SeedPhrase';
import { FadeInOut } from '@components/Animations';
import Typography from '@components/Typography';
import Button from '@components/Button';
import * as S from './components/Styled';

// assets
import CopyboardSvg from '@assets/svgs/copyboard.svg';

// styled components
import { CopyboardIcon, Modal, ModalCtn } from './components/Styled';


const Backup = ({
    passLoadingStatus,
}) => {
    const history = useHistory();
    const { wallet } = useWallet();
    const notify = useNotifications();

    const [fadeOut, setFadeOut] = useState(false);

    // manually stop loading screen
    useEffect(() => {
        passLoadingStatus(false);
    }, [])

    // handlers
    const handleCopySeedPhrase = () => {
        navigator.clipboard.writeText(wallet.mnemonic);
        notify({ message: "Copied to clipboard", type: "success" });
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
                        <Typography variant="header" size="large">Backup Account</Typography>
                        <Typography variant="paragraph">This unhosted and non-custodial wallet associated with this lottery game is not backed up. Please backup your seed phrase and secure this wallet to avoid loss of funds from potential winnings.</Typography>
                        <SeedPhrase
                            phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                        />
                        <Button variant="secondary" type="button" onClick={handleCopySeedPhrase}>
                            <S.CopyboardIcon src={CopyboardSvg} />
                            Copy
                        </Button>
                        <Button type="button" onClick={handleBackedUp}>I've Secured</Button>
                    </S.Modal>
                </S.ModalCtn>
            </FadeInOut>
        </>
    )
}

export default Backup;