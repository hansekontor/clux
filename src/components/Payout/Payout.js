// node modules
import React from 'react';
import styled from 'styled-components';

// react components
import { ReturnButton } from '@components/Common/PrimaryButton';
import { FooterCtn, SupportBar, Links, LightFooterBackground } from '@components/Common/Footer';
import PrimaryButton from '@components/Common/PrimaryButton';
import NavigationBar from '@components/Common/Navigation';
import Header from '@components/Common/Header'
import FadeInOut from '@components/Backup/FadeInOut';

// css styled components
const Input = styled.input`
    border-radius: 12px;
    background-color: #F6F6F6;
    color: #ABABAB;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 86%;
    border-style: none;
`;
const FadeIn = styled(FadeInOut)`
    width: 100%;
    height: 100%;
    background-color: #EAEAEA;
    display: flex; 
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;
const Form = styled.form`
    flex-grow: 1;
`;

const Payout = ({
}) => {
    // handlers
    const handlePayout = async () => {
        console.log("handlePayout()");
    }

    // DOM variables
    const payoutButtonText = "Payout";
    const title = "Payout";

    const previousPath = location.state?.returnTo || "/select";
    console.log("Payout previousPath", previousPath);

    return (
        <FadeIn duration={300} show={true}>
            <Header />
                <NavigationBar 
                    returnTo={previousPath}
                    title={title}                              
                />
                <Form id="payout-form">
                    <Input 
                        placeholder={"Payout Amount"}
                        name="amount"
                        type="number"
                    />         
                </Form>

            <FooterCtn>
                <LightFooterBackground />
                <PrimaryButton type="submit" form="payout-form" onClick={handlePayout}>{payoutButtonText}</PrimaryButton>
            </FooterCtn>
        </FadeIn>
    )
}

export default Payout;