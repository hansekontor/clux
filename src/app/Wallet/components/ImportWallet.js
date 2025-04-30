// node modules
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';
import styled from 'styled-components';

// custom react modules
import Button from '@components/Button';

// core functions
import { useApp } from 'blocklotto-sdk';
import { useNotifications } from 'blocklotto-sdk';


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
    border: ${props => props.$error ? "1px solid red" : "none"};
    margin-top: 12px;
    margin-bottom: 12px;
	text-indent: 12px;
`;
const Help = styled.div`
    color: red;
`;
const StyledPrimaryButton = styled(Button)`
	font-family: "Helvetica";
	font-size: 14px;
	font-weight: 600;
`;

const ImportWallet = ({
    currentAddress,
}) => {
    const history = useHistory();
    const { importWallet, validateMnemonic } = useApp();
    const notify = useNotifications();

    const [alertModal, alertModalHolder] = Modal.useModal();
    const [isValidMnemonic, setIsValidMnemonic] = useState(false);


    const handleChange = (e) => {
        const { value, name } = e.target;

        // Validate mnemonic on change
        setIsValidMnemonic(validateMnemonic(value));
    }


    const handleImportPhrase = async (e) => {
        e.preventDefault();

        if (!isValidMnemonic) {
            notify({
                type: "error",
                message: "Invalid Seed Phrase"
            });
            return;
        }

        await importWallet(e.target.mnemonic.value);
        history.push("/select");
    }

    return (
        <ImportWalletCtn>
            {alertModalHolder}
            <Address>
                <AddressLabel>Current Wallet Address</AddressLabel>
                {currentAddress}
            </Address>
            <Form
                id='import-form'
                validateStatus={!isValidMnemonic ? "error" : ""}
                help={
                        !isValidMnemonic
                        ? 'Valid mnemonic seed phrase required'
                        : ''
                }
                onSubmit={e => handleImportPhrase(e)}
            >
                <Input
                    type="text"
                    placeholder="New Seed Phrase"
                    name="mnemonic"
                    autoComplete="off"
                    onChange={e => handleChange(e)}
                    $error={!isValidMnemonic}
                    required
                />              
            </Form>
            <StyledPrimaryButton
                type="submit"
                form="import-form"
                disabled={!isValidMnemonic}
            >
                Import
            </StyledPrimaryButton>        
        </ImportWalletCtn>
    )
}

export default ImportWallet;