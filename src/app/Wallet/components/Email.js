// node modules
import React, { useState } from 'react';
import styled from 'styled-components';

// custom react components
import Button from '@components/Button';
import { useNotifications } from '@core/context/Notifications';

// styled components
const EmailCtn = styled.div`
    display: flex; 
    justify-content: center; 
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 24px;
`;
const Form = styled.form`
    flex-grow: 1;
    width: 90%;
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
    width: 100%;
    border: ${props => props.$error ? "1px solid red" : "none"};
	text-indent: 12px;
`;

const Email = ({
    passLoadingStatus
}) => {
    const [emailChanged, setEmailChanged] = useState(false);

    const notify = useNotifications();

    const handleChangeEmail = async (e) => {
        e.preventDefault();
		const emailInput = e.target.email.value;
		const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput);
		if (!isValid) {
			setEmailError(true);
			return;
		}

		const keyring = KeyRing.fromSecret(wallet.Path1899.fundingWif);
		const msg = Buffer.from(emailInput, 'utf-8');
		const sig = keyring.sign(SHA256.digest(msg));

		const json = {
			email: emailInput, 
			pubkey: wallet.Path1899.publicKey,
			signature: sig.toString('hex'),			
		};
		console.log("json", json);
		const userRes = await fetch("https://lsbx.nmrai.com/v1/user", {
			method: "POST", 
			mode: "cors",
			headers: new Headers({
				"Content-Type": "application/json"
			}),
			signal: AbortSignal.timeout(20000),
			body: JSON.stringify(json)
		});
		console.log("userRes", userRes);
		// forward based on response
		const userResJson = await userRes.json();
		console.log("userResJson", userResJson);
		if (userRes.status === 200) {
            notify({
                message: "Email has been changed",
                type: "success"
            });
			history.pushState({
				pathname: "/",
				state: {
					repeatOnboarding: true
				}
			})
		}
    }


    return (
        <>
            <EmailCtn>
                <Form id="email-form" onSubmit={handleChangeEmail}>
                    <Input 
                        placeholder={"new email address"}
                        name="email"
                        type="text"
                    />
                </Form>
                <Button variant="secondary" type="submit" form="email-form">
                    Change Email
                </Button>
            </EmailCtn>        
        </>
    )
}

export default Email;