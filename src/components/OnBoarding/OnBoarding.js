// node modules
import React, { useState, useEffect } from 'react';
import { WalletContext } from '@utils/context';
import PrimaryButton from '@components/Common/PrimaryButton';
import { nationalityOptions, residencyOptions } from '@utils/geoblock';
import styled from 'styled-components';
import Select from 'react-select';
import BeachPng from '@assets/ResultBackground.png';
import { bcrypto } from '@hansekontor/checkout-components';


const Input = styled.input`
    border-radius: 12px;
    background-color: #F6F6F6;
    color: #00000;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 90%;
    border: ${props => props.error ? "1px solid red" : "none"};
	text-indent: 12px;
    margin-bottom: 24px;
`;

const PasswordProtection = ({
    passIsProtected
}) => {

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const password = e.target.password.value;
        const passwordBuf = Buffer.from(password, 'utf-8');
        const hashedPassword = bcrypto.SHA256.digest(passwordBuf).toString('hex');
        
        const expectedHash = "615da616fc5a5bcd93bc21237807c08eeacbe120ca60e0c3e228712be644596d";

        const verified = hashedPassword === expectedHash;
        console.log("pw verified", verified);
        passIsProtected(!verified);
    }

    return (
        <form onSubmit={(e) => handlePasswordSubmit(e)}>
            <Input 
                name="password"
                type="text"
                placeholder="Password"
                required={true}
            />               
            <PrimaryButton type="submit">Log In</PrimaryButton>                         
        </form>
    )
}


const Background = styled.img`
    z-index: -1;
`;
const Text = styled.p``;
const Form = styled.form`
position: absolute;
top: 40%;
    width: 95%;
    background-color: #ffffff;
    gap: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px 0;
    border-radius: 20px;

`;

const GeoPrompt = ({
    passIsProtected
}) => {

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const residency = e.target.residency.value;
        const nationality = e.target.nationality.value;
        const age = e.target.age.value;

        console.log("chosen residency, nationality, age", residency, nationality, age);
        // dev todo: save string of local timezone in browser cache

        passIsProtected(false);
    }

    return (
        <>
            <Background src={BeachPng} />

            <Form onSubmit={(e) => handleOnSubmit(e)}>            
                <Text>
                    Please keep your Passport at hand.
                </Text>
                <Select 
                    name="residency"
                    placeholder="Country of residence"
                    options={residencyOptions}
                />
                <Select
                    name="nationality"
                    placeholder="Nationality"
                    options={nationalityOptions}
                />
                <input 
                    name="age"
                    placeholder="Age"
                    type="number"
                />
                <PrimaryButton type="submit">
                    Confirm
                </PrimaryButton>
            </Form>        
        </>

    )
}


const OnBoarding = ({
    passIsProtected
}) => {
    const [isPasswordProtected, setIsPasswordProtected] = useState(true);
    const [isGeoProtected, setIsGeoProtected] = useState(true);

    useEffect(async () => {
        if (!isGeoProtected && !isPasswordProtected) {
            console.log("SET PROTECTION OFF FOR APP")
            passIsProtected(false);
        }            
    }, [isGeoProtected]);

    return (
        <>
            {isPasswordProtected ? 
                <>
                    <PasswordProtection 
                        passIsProtected={setIsPasswordProtected}
                    />
                </>
            :   
                <>
                    {isGeoProtected && (
                        <GeoPrompt 
                            passIsProtected={setIsGeoProtected}
                        />
                    )}
                </>
            }
        </>
    );
};

export default OnBoarding;