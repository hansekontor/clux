// node modules
import React from 'react';
import { Modal } from 'antd';

// custom react modules
import { TertiaryButton } from '@components/Common/PrimaryButton';

const ChangeWallet = () => {
    const [alertModal, alertModalHolder] = Modal.useModal();

    const handleImportAlert = () => {
        alertModalHolder.alert(alertModalConfig);
    }

    return (
        <>
            {alertModalHolder}
            <TertiaryButton
                onClick={handleImportAlert}
            >
                Import Seed Phrase
            </TertiaryButton>        
        </>
    )
}