import React, { useEffect, useState } from 'react';
import { FormHeader, PaymentForm, PaymentInput, Price } from './Processors.styles';
import Typography from '@components/Typography';

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
                <Typography variant="header">{headerText}</Typography>
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