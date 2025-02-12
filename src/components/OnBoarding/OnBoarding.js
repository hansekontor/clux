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
    passProtection
}) => {

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const password = e.target.password.value;
        const passwordBuf = Buffer.from(password, 'utf-8');
        const hashedPassword = bcrypto.SHA256.digest(passwordBuf).toString('hex');
        
        const expectedHash = "615da616fc5a5bcd93bc21237807c08eeacbe120ca60e0c3e228712be644596d";

        const verified = hashedPassword === expectedHash;
        console.log("pw verified", verified);
        passProtection(!verified);
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


const OnBoarding = ({
    passProtection,
	passUser
}) => {
	const ContextValue = useContext(WalletContext);
    const { wallet } = ContextValue;
	
    const [passwordProtection, setPasswordProtection] = useState(true);
    const [geoProtection, setGeoProtection] = useState(true);
	const [kycProtection, setKycProtection] = useState(true);
	const [checksDone, setChecksDone] = useState(false);
    const [modal, modalHolder] = Modal.useModal();

	useEffect(() => {
		// remove protections if access allowed
		console.log("test", passwordProtection, kycProtection, geoProtection)
		if (!passwordProtection && !kycProtection && !geoProtection) {
			console.log("allow access")
			passProtection(false);
		}   		

	}, [checksDone, passwordProtection, geoProtection])

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
			
			// evaluate access based on kyc
			let accessDenied = false;
			if (user.kyc_status === "auto_declined") {
				console.log("kyc declined")
				accessDenied = true;
				// nothing is allowed
				// show  info modal
				const modalConfig = {
					title: "Access denied",
					content: "Your KYC has been declined.",
				};
				modal.info(modalConfig);
			} else if (user.kyc_status === "needs_review") {
				console.log("kyc needs review");
				accessDenied = false;
				// user has to wait until email notification
				// show info modal
				const modalConfig = {
					title: "Your KYC Needs Review",
					content: "You will receive an email when this issue is resolved.",
				};
				modal.info(modalConfig);
			} else {
				console.log("kyc approved or outstanding")
				// user is either approved or not yet kyced
				setKycProtection(false);
			}

			// evaluate access based on ip
			if (!accessDenied) {
				// get ip data if missing
				if (!user.ipGeo) {
					const geoRes = await fetch(`https://lsbx.nmrai.com/v1`, {
						signal: AbortSignal.timeout(20000)
					});
					const geoData = await geoRes.json();
					console.log("geodata", geoData);
				
					user.ipGeo = geoData.ipGeo;
				}

				// evaluate ip access
				if (user.ipGeo.ticketPurchase) {
					console.log("allow ticket purchase")
					// everything is allowed
					setGeoProtection(false); 
				} else if (user.ipGeo.affiliate) {
					console.log("allow affiliate")
					// show info screen for affiliates
					const modalConfig = {
						title: "Access restricted",
						content: "You can not purchase tickets, but you can be an affiliate",
						onOk: () => {
							setGeoProtection(false);
						},
					};
					modal.info(modalConfig);					
				} else {
					console.log("allow nothing")
					accessDenied = true;
					// nothing is allowed
					// show  info modal
					const modalConfig = {
						title: "Access denied",
						content: "You can not access this site from your location.",
					};
					modal.info(modalConfig);
				}
			}

			// pass user data 
			passUser(user);
			setChecksDone(true);
		}
	}, [wallet]);

	return (
        <>
			{modalHolder}			            
			<Background src={BeachPng} />
            {passwordProtection &&
				<PasswordProtection 
					passProtection={setPasswordProtection}
				/>	
			}
        </>
    );
};

export default OnBoarding;