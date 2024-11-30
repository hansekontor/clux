// node modules
import React, { useState } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';

// custom react modules
import { SecondaryButton } from '@components/Common/PrimaryButton';
import { WalletContext } from '@utils/context';
import { infoNotification } from '@components/Common/Notifications';

// styled css modules
const ImportWalletCtn = styled.div`
    display: flex-start;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-grow: 1;
`;
const Address = styled.div`
`;
const AddressLabel = styled.div`
`;
const Form = styled.form`
    flex-grow: 1;
    width: 100%;
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
    width: 90%;
    border: ${props => props.error ? "1px solid red" : "none"};
    margin-top: 12px;
    margin-bottom: 12px;
	text-indent: 12px;
`;
const Help = styled.div`
    color: red;
`;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ImportWallet = ({
    currentAddress,
    passLoadingStatus
}) => {
    const ContextValue = React.useContext(WalletContext);
    const { createWallet, validateMnemonic } = ContextValue;

    const [alertModal, alertModalHolder] = Modal.useModal();
    const [isValidMnemonic, setIsValidMnemonic] = useState(false);
    const [formData, setFormData] = useState({
        dirty: true,
        mnemonic: '',
    });
    const [walletChanged, setWalletChanged] = useState(false);


    const handleChange = (e) => {
        const { value, name } = e.target;

        // Validate mnemonic on change
        setIsValidMnemonic(validateMnemonic(value));
        setFormData(p => ({ ...p, [name]: value }));
    }


    const handleImportPhrase = async () => {

        setFormData({
            ...formData,
            dirty: false,
        });

        if (!formData.mnemonic) {
            return;
        }

        // Event("Category", "Action", "Label")
        // Track number of created wallets from onboarding
        // Event('ImportWallet .js', 'Create Wallet', 'Imported');
        passLoadingStatus("IMPORT WALLET");
        createWallet(formData.mnemonic);
        passLoadingStatus(false);
        infoNotification("Imported Wallet");
    }

    console.log("dirty", formData.dirty, "isvalidmnemonic", isValidMnemonic);

    return (
        <ImportWalletCtn>
            {alertModalHolder}
            <Address>
                <AddressLabel>Current Wallet Address</AddressLabel>
                {currentAddress}
            </Address>
            <Form
                validateStatus={!formData.dirty && !formData.mnemonic ? "error" : ""}
                help={
                    !formData.mnemonic || !isValidMnemonic
                        ? 'Valid mnemonic seed phrase required'
                        : ''
                }
            >
                <Input
                    type="text"
                    placeholder="New Seed Phrase"
                    name="mnemonic"
                    autoComplete="off"
                    onChange={e => handleChange(e)}
                    error={!formData.dirty && !formData.mnemonic}
                    required
                />              
            </Form>
            <SecondaryButton
                onClick={handleImportPhrase}
                disabled={!isValidMnemonic}
            >
                Import
            </SecondaryButton>        
        </ImportWalletCtn>
    )
}

export default ImportWallet;