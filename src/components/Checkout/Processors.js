import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Input = styled('input').withConfig({shouldForwardProp: (prop) => prop != 'error'})`
    height: 52px;
    width: 100%;
    min-width: 50px;
    background-color: #F6F6F6;
    border-radius: 8px;
    border: ${props => props.$error ? 'solid 0.5px red' : 'none'};
    text-indent: 12px;

    &:focus {
        border: solid 0.5px black; 
    };
`;
const PaymentInput = styled(Input)`
	background-color: #EAEAEA;
`;
export const WidgetBody = styled.div`
    width: 100%;
    max-width: 480px;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 11;
    height: fit-content;
    bottom: 0;
    padding-bottom: 12px;
    background-color: #FEFFFE;
    border-radius: 12px 12px 0 0;
`;
const PaymentForm = styled.form`
    z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 30px;
	margin-bottom: 30px;
    gap: 12px;
    width: 90%;
`;
const Item = styled.div`
    display: flex;
    padding-bottom: 15px;
    width: 100%;
    gap: 5%;
`;
const FormHeader = styled(Item)`
    text-align: justify;
    justify-content: space-between;
    display: flex;
`;
import { Header } from '@components/Common/Text';
const Price = styled(Header)`
    text-align: right;
`;

export const NmiCheckoutForm = ({
    passMetadata,
    amount
}) => {

    const [inputError, setInputError] = useState(false);
    useEffect(() => {
        window.CollectJS.configure({
            variant: 'lightbox',
            styleSniffer: false,
            callback: (token) => {
                console.log("token", token);
                handleResult(token);
            },
            fields: {
                ccnumber: {
                    placeholder: "1234 1234 1234 1234",
                    selector: "#ccnumber"
                },
                ccexp: {
                    placeholder: "MM / YY",
                    selector: "#ccexp"
                },
                cvv: {
                    placeholder: "CVV",
                    selector: "#cvv"
                }
            },
            customCss: {
                "border-radius": "12px",
                "height": "44px",
                "border-style": "none"
            }
        })
    }, []);


    const handleSubmit = (e) => {
        console.log("handleSubmit()")
        e.preventDefault();

        if (window.CollectJS) {
            window.CollectJS.startPaymentRequest();
        } else 
            console.log("CollectJS unavailable")
    }
    const handleResult = async (result) => {
        console.log("payment token", result.token);
        const paymentMetadata = result.token; 

        passMetadata(paymentMetadata);
    }
    
    const headerText = "PAY WITH CARD";
    const currency = "$";


    return (
        <PaymentForm onSubmit={handleSubmit} id="NMIC-form">
            <FormHeader>
                <Header>{headerText}</Header>
                <Price>{currency}{amount}</Price>
            </FormHeader>
            <PaymentInput 
                type="text"
                name="firstname"
                placeholder="First Name	"
                required
            />
            <PaymentInput 
                type="text"
                name="lastname"
                placeholder="Last Name"
                required
            />
            <PaymentInput 
                type="text"
                name="zip"
                placeholder="ZIP"
                required
            />                   
            {/* {inputError && <ErrorMessage>{inputError}</ErrorMessage>} */}
        </PaymentForm>
    )
}