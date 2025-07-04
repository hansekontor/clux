// node modules
import React from 'react';
import { useHistory } from 'react-router-dom';

// core functions
import { useApp } from 'blocklotto-sdk';
import { useNotifications } from 'blocklotto-sdk';

// assets
import CopyboardSvg from '@assets/svgs/copyboard.svg';

// custom react components
import SeedPhrase from '@components/SeedPhrase';
import { FadeInOut } from '@components/Animations';
import Typography from '@components/Typography';
import Button from '@components/Button';
import ModalContainer from './components/ModalContainer';
import Modal from './components/Modal';
import CopyboardIcon from './components/CopyboardIcon';

const Backup = ({
    close
}) => {
    const { wallet } = useApp();
    const notify = useNotifications();

    const handleCopySeedPhrase = () => {
        navigator.clipboard.writeText(wallet.mnemonic);
        notify({ message: "Copied to clipboard", type: "success" });
    }

    const handleBackedUp = (e) => {
        e.preventDefault();
        close();
    }

    return (
        <FadeInOut show={true} duration={300}>
            <ModalContainer>
                <Modal>
                    <Typography variant="header" size="large">Backup Account</Typography>
                    <Typography variant="paragraph">This unhosted and non-custodial wallet associated with this lottery game is not backed up. Please backup your seed phrase and secure this wallet to avoid loss of funds from potential winnings.</Typography>
                    <SeedPhrase
                        phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                    />
                    <Button variant="secondary" type="button" onClick={handleCopySeedPhrase}>
                        <CopyboardIcon src={CopyboardSvg} />
                        Copy
                    </Button>
                    <Button type="button" onClick={handleBackedUp}>I've Secured</Button>
                </Modal>
            </ModalContainer>
        </FadeInOut>
    )
}

export default Backup;