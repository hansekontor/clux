import React from 'react';
import { FormHeader, PaymentForm, PaymentInput, Price } from './Processors.styles';
import Typography from '@components/Typography';

// core functions
import { useCheckout } from '@core/context/Checkout';

export const NmiCheckoutForm = () => {
    const { ticketPrice, ticketQuantity, handleSubmit } = useCheckout();

    return (
        <PaymentForm onSubmit={handleSubmit} id="NMIC-form">
            <FormHeader>
                <Typography variant="header">PAY WITH CARD</Typography>
                <Price>${ticketPrice * ticketQuantity}</Price>
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
        </PaymentForm>
    )
}