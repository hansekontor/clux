import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { SecondaryButton, SupportButtons } from '@components/Common/PrimaryButton';
import RingPng from '@assets/ring.png';
import SeedPhrase from '@components/Common/SeedPhrase';
import { WalletContext } from '@utils/context';


const Background = styled.img`
    position: relative;
    height: 100vh;
    z-index: -4;
    object-fit: cover;
    filter: grayscale(1);
`;
const Overlay = styled.div`
    background-color: rgba(255,255,255,0.9);
    position: absolute;
    width: inherit;
    height: inherit;
    z-index: -3;
    display: block;
    top: 0;
    left: 0; 
`;
const Title = styled.div`
    color: #000000;
    z-index: 1;
    font-size: 30px;
    font-weight: 600;
`;
const Input = styled.input`
    text-align: center;
    white-space: nowrap;

    border-radius: 40px;
    background-color: #000000;
    color: #ffffff;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 44px;
    padding: 0 15px;
    cursor: pointer;
    width: 90%;
`;
const Text = styled.p`
    z-index: 1;
    color: #000000;
`;
const Content = styled.div`
    top: 40%;
    position: absolute;
    left: 7%;
    right: 7%;
    text-align: left;
`;
const Skip = styled.a`
    margin-left: 10px;
    cursor: pointer;
`;
const ButtonCtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
`;
const SubmitButton = styled(SecondaryButton)`
    width: fit-content;
`;



const Backup = ({
    purchasedTicket,
    passLoadingStatus
}) => {
    const history = useHistory();
    const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;

    const [backupRequested, setBackupRequested] = useState(false);
    const [backupFinished, setBackupFinished] = useState(false);

    // stop loading screen after rendering has been completed
    useEffect(() => {
        passLoadingStatus(false);
    })

    // handlers
    const handleOnSubmit = () => {
        history.push('/waitingroom');
    }
    const handleBackupSeedPhrase = () => {
        setBackupRequested(true)
    }


    return (
        <>
            <Background src={RingPng} />
            <Overlay>
                <Content>
                    {!backupFinished ? (
                        <>
                            <Title>Backup your Wallet</Title>
                            <Text>The crypto wallet associated with this lottery game is not backed up. Please backup your seed phrase and secure the wallet to avoid loss of funds.</Text>                        
                            {backupRequested ? (
                                <>
                                    <SeedPhrase 
                                        phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                                    />             
                                    <SecondaryButton onClick={() => setBackupFinished(true)}>Continue</SecondaryButton>       
                                </>            
                            ) : (
                                <>
                                    <SecondaryButton onClick={handleBackupSeedPhrase}>Backup Wallet</SecondaryButton>
                                    <Skip onClick={() => setBackupFinished(true)}>Skip Backup</Skip>     
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Title>Get Notified</Title>
                            <Text>Enter your email to get notified when the results are ready:</Text>
                            <form onSubmit={() => handleOnSubmit()}>
                                <Input 
                                    placeholder="Enter Email"
                                />
                                <ButtonCtn>
                                    <SubmitButton type="submit">Submit</SubmitButton>                                    
                                </ButtonCtn>
                            </form>                        
                        </>
                    )} 
                </Content>
                <SupportButtons prev="/backup" types={["help"]}/>
          
            </Overlay>
        </>
    )
}

export default Backup;