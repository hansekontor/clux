// node modules
import React, { useState } from 'react';
import styled from 'styled-components';

// react components
import { FooterCtn, SupportBar, Links, LightFooterBackground } from '@components/Common/Footer';
import PrimaryButton from '@components/Common/PrimaryButton';
import NavigationBar from '@components/Common/Navigation';
import Header from '@components/Common/Header'

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
    width: 100%;
    border: ${props => props.error ? "1px solid red" : "none"};
`;
const FlexGrow = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FEFFFE;
    flex-direction: column;
    width: 100%;
`;
const Form = styled.form`
    flex-grow: 1;
    width: 86%;
`;

const Cashout = ({
}) => {
    const balance = 333;

        // handlers
    const handleCashout = () => {
        console.log("handleCashout()");
    }

    // DOM variables
    const cashoutButtonText = "Confirm Amount";
    const title = "Cashout";
    const previousPath = location.state?.returnTo || "/select";


    return (
        <FlexGrow>
            <Header />
            <NavigationBar 
                returnTo={previousPath}
                title={title}                              
            />
            <Form id="cashout-form">
                <Input 
                    placeholder={"Cashout Amount"}
                    name="amount"
                    type="number"
                />
            </Form>
            <FooterCtn>
                <LightFooterBackground />
                <PrimaryButton type="submit" form="cashout-form" onClick={handleCashout}>{cashoutButtonText}</PrimaryButton>
            </FooterCtn>
        </FlexGrow>
    )
}

export default Cashout;