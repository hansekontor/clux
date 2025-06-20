import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

// core functions
import { useCheckout, useNotifications } from 'blocklotto-sdk';

// custom react components
import Navigation from '@components/Navigation';
import Ticket from './components/Ticket';
import Footer from '@components/Footer';
import { CardIconBox } from '@components/Icons';
import { QuantityInput, QuantitySuggestions } from '@components/Inputs';
import Typography from '@components/Typography';
import { Column, Overlay } from '@components/Common';
import { RollUp } from '@components/Animations';
import { NmiCheckoutForm, WidgetBody } from './components/Processors';
import Button from '@components/Button';
import FlexGrow from '../components/FlexGrow';
import FooterBackground from '../components/FooterBackground';
import AccountForm from '../components/AccountForm';
import Item from '../components/Item';
import ErrorMessage from '../components/ErrorMessage';
import PaymentMethod from './components/PaymentMethod';
import Price from './components/Price';
import { FormWrapper } from './components/Processors/Processors.styles';

// dom variables
const checkoutTitle = "Checkout";
const fiatPurchaseButtonText = "Pay";

export default function Cart() {
    const history = useHistory();
    const notify = useNotifications();

    const {
        showPaymentForm,
        ticketPrice,
        ticketQtyError,
        ticketQuantity,
        maxEtokenTicketQuantity,
        handlePayment,
        setTicketQuantity,
        setShowPaymentForm,
    } = useCheckout();

    const [paymentMethod, setPaymentMethod] = useState("NMIC");

    const handleReturn = () => {
        const previousPath = "/select";
        history.push(previousPath);
    }

    const handlePaymentSuccess = () => {
        notify({ type: "success", message: "Successful purchase!"});
    }

    const handlePaymentError = () => {
        notify( { type: "error", message: "API Error. Try again"});
    }

    return (
        <>
            <Navigation
                handleOnClick={handleReturn}
                title={checkoutTitle}
                merchantTag={true}
            />

            <FlexGrow>
                <Ticket
                    background={'#EAEAEA'}
                    quantity={ticketQuantity}
                />

                <AccountForm id="purchase-options-form">
                    <Item>
                        <Typography variant="header" size="large">How many tickets?</Typography>
                    </Item>
                    <Item>
                        <Typography variant="paragraph">
                            Each ticket result is random and unique, including entry in each of the Jackpots.
                        </Typography>
                    </Item>

                    <QuantityInput
                        quantity={ticketQuantity}
                        passQuantity={setTicketQuantity}
                        step={1}
                        max={50}
                    />
                    <QuantitySuggestions
                        passQuantity={setTicketQuantity}
                    />
                    {ticketQtyError && <ErrorMessage>{ticketQtyError}</ErrorMessage>}

                    <Column>
                        <Item>
                            <Typography variant="header" size="large">Payment Method</Typography>
                            <CardIconBox />
                        </Item>
                        <PaymentMethod
                            onClick={() => setPaymentMethod("NMIC")}
                            $active={paymentMethod === "NMIC"}
                        >Credit Card</PaymentMethod>
                        {maxEtokenTicketQuantity >= ticketQuantity &&
                            <PaymentMethod
                                onClick={() => setPaymentMethod("etoken")}
                                $active={paymentMethod === "etoken"}
                            >Pay with Balance</PaymentMethod>
                        }
                        <Item>
                            <Typography variant="header" size="large">Total</Typography>
                            <Price>${ticketQuantity * ticketPrice}</Price>
                        </Item>
                    </Column>
                </AccountForm>
            </FlexGrow>

            <Footer variant="empty">
                <FooterBackground variant={"secondary"} />
                <Button onClick={() => handlePayment(paymentMethod, handlePaymentSuccess, handlePaymentError)}>
                    Pay
                </Button>
            </Footer>

            {showPaymentForm && (
                <Overlay onClick={() => setShowPaymentForm(false)}>
                    <FormWrapper>
                        <RollUp onClick={(e) => e.stopPropagation()} $animate={showPaymentForm}>
                            <WidgetBody>
                                <NmiCheckoutForm />
                                <Button
                                    type="submit"
                                    form={`${paymentMethod}-form`}
                                >
                                    {fiatPurchaseButtonText}
                                </Button>
                            </WidgetBody>
                        </RollUp>
                    </FormWrapper>
                </Overlay>
            )}
        </>
    )
}
