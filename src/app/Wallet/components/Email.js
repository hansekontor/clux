// node modules
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// custom react components
import Button from '@components/Button';

// core functions
import { useApp } from 'blocklotto-sdk';
import { useNotifications } from 'blocklotto-sdk';


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

const Email = () => {
    const { changeEmail } = useApp();
    const notify = useNotifications();
    const history = useHistory();


    const handleChangeEmail = async (e) => {
        try {
            e.preventDefault();
            const emailInput = e.target.email.value;
            const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput);
            if (!isValid) {
                notify({
                    type: "error",
                    message: "Invalid email"
                })
                return;
            }

            await changeEmail(emailInput);

            history.push("/select");            
        } catch(err) {
            console.error(err);
            notify({ type: "error", message: err.message});
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