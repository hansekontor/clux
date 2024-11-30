// node modules
import React, { useState } from 'react';
import styled from 'styled-components';

// custom react components
import { SecondaryButton } from '@components/Common/PrimaryButton';
import { infoNotification } from '@components/Common/Notifications';

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
    border: ${props => props.error ? "1px solid red" : "none"};
	text-indent: 12px;
`;

const Email = ({
    passLoadingStatus
}) => {
    const [emailChanged, setEmailChanged] = useState(false);

    const handleChangeEmail = (e) => {
        e.preventDefault();
        // change email placeholder
        infoNotification("Email Changed")
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
                <SecondaryButton type="submit" form="email-form">
                    Change Email
                </SecondaryButton>
            </EmailCtn>        
        </>

    )
}

export default Email;