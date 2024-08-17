// node modules
import React from 'react';
import { Modal } from 'antd';

// custom react modules
import { SecondaryButton } from '@components/Common/PrimaryButton';

const ImportWallet = () => {
    const [alertModal, alertModalHolder] = Modal.useModal();

    const handleImportAlert = () => {
        alertModalHolder.alert(alertModalConfig);
    }

    return (
        <>
            {alertModalHolder}
            <SecondaryButton
                onClick={handleImportAlert}
            >
                Import Seed Phrase
            </SecondaryButton>        
        </>
    )
}

export default ImportWallet;