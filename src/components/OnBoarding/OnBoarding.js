// node modules
import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '@utils/context';
import PrimaryButton from '@components/Common/PrimaryButton';
import { nationalityOptions, residencyOptions } from '@utils/geoblock';
import styled from 'styled-components';
import Select from 'react-select';
import BeachPng from '@assets/ResultBackground.png';
import { bcrypto, KeyRing } from '@hansekontor/checkout-components';
import { Modal } from 'antd';
const { SHA256 } = bcrypto;

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
        <Form onSubmit={(e) => handlePasswordSubmit(e)}>
            <Input 
                name="password"
                type="text"
                placeholder="Password"
                required={true}
            />               
            <PrimaryButton type="submit">Log In</PrimaryButton>                         
        </Form>
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
    passIsProtected,
	passUser
}) => {
	const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
	
    const [isPasswordProtected, setIsPasswordProtected] = useState(true);
    const [isGeoProtected, setIsGeoProtected] = useState(true);
    const [modal, modalHolder] = Modal.useModal();
	const [checksDone, setChecksDone] = useState(false);

	// const [geoblock, setGeoblock] = useState(true);
	// useEffect(async () => {
	// 	const ipRes = await fetch({
	// 		mode: "cors",
	// 		signal: AbortSignal(20000),
	// 		url: "https://lsbx.nmrai.com/v1"
	// 	});

	// 	const ipOptions = await ipRes.json();
	// 	const allowTickets = ipOptions.ipGeo.ticketPurchase;
	// 	const allowAffiliate = ipOptions.ipGeo.affiliate;			
	// })

    useEffect(async () => {
		console.log("called turn off protection effect", isGeoProtected, isPasswordProtected)
        if (!isGeoProtected && !isPasswordProtected) {
            console.log("SET PROTECTION OFF FOR APP")
            passIsProtected(false);
        }            
    }, [isGeoProtected, isPasswordProtected]);

	useEffect(async () => {
		if (!wallet.loading && !checksDone) {
			const accessRes = await fetch(`https://lsbx.nmrai.com/v1/access/${wallet.Path1899.publicKey}`, {
				signal: AbortSignal.timeout(20000),
				headers: new Headers({
					"Content-Type": "application/json"
				})
			});
			const accessData = await accessRes.json();
			
			const msg = Buffer.from(accessData.access, 'utf-8');
			const keyring = KeyRing.fromSecret(wallet.Path1899.fundingWif);
			const sig = keyring.sign(SHA256.digest(msg));

			const userRes = await fetch("https://lsbx.nmrai.com/v1/user/", {
				method: "POST",
				signal: AbortSignal.timeout(20000),
				headers: new Headers({
					"Content-Type": "application/json"
				}),
				body: JSON.stringify({
					access: accessData.access, 
					pubkey: wallet.Path1899.publicKey,
					signature: sig.toString('hex')
				}),
			})
			const user = await userRes.json();
			console.log("user", user);

			if (!user.ipGeo) {
				const geoRes = await fetch(`https://lsbx.nmrai.com/v1`, {
					signal: AbortSignal.timeout(20000)
				});
				const geoData = await geoRes.json();
				console.log("geodata", geoData);
			
				user.ipGeo = geoData.ipGeo;
				passUser(user);

				if (geoData.ipGeo.ticketPurchase) {
					// everything is allowed
					setIsGeoProtected(false); 
				} else if (geoData.ipGeo.affiliate) {
					// show info screen for affiliates
					const modalConfig = {
						title: "Access restricted",
						content: "You can not purchase tickets, but you can be an affiliate",
						onOk: () => {
							setIsGeoProtected(false);
						},
					};
					modal.info(modalConfig);					
				} else {
					// nothing is allowed
					// show  info modal
					const modalConfig = {
						title: "Access denied",
						content: "You can not access this site from your location.",
					};
					modal.info(modalConfig);

				}
			} else {
				passUser(user);
			}

			setChecksDone(true);
		}
	}, [wallet]);

	return (
        <>
			{modalHolder}			            
			<Background src={BeachPng} />
            {isPasswordProtected &&
				<PasswordProtection 
					passIsProtected={setIsPasswordProtected}
				/>	
			}
        </>
    );
};

export default OnBoarding;