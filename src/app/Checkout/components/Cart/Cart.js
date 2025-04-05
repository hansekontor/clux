import React from 'react'

// core functions
import { useCheckout } from '@core/context/Checkout';

// custom react components
import Navigation from '@components/Navigation';
import Ticket from './Ticket';
import Footer from '@components/Footer';
import { CardIconBox } from '@components/Icons';
import { QuantityInput, QuantitySuggestions } from '@components/Inputs';
import Typography from '@components/Typography';
import { Column, Overlay } from '@components/Common';
import { AccountForm, ErrorMessage, Item, PaymentMethod, Price, PrimaryFlexGrow, SecondaryFooterBackground } from '../Styled';
import { RollUp } from '@components/Animations';
import { NmiCheckoutForm, WidgetBody } from './Processors';
import Button from '@components/Button';

// dom variables
const checkoutTitle = "Checkout";
const fiatPurchaseButtonText = "Pay";

export default function Cart() {
    const {
        playerNumbers,
        showPaymentForm,
        ticketPrice,
        ticketQtyError,
        ticketQuantity,
        paymentProcessor,
        maxEtokenTicketQuantity,
        handleReturn,
        handleConfirmation,
        handlePaymentMethod,
        setTicketQuantity,
        setPaymentMetadata,
        setShowPaymentForm,
    } = useCheckout();

    return (
        <>
            <Navigation
                handleOnClick={handleReturn}
                title={checkoutTitle}
                merchantTag={true}
            />

            <PrimaryFlexGrow>
                <Ticket
                    numbers={playerNumbers}
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
                            onClick={() => handlePaymentMethod("NMIC")}
                            $active={paymentProcessor === "NMIC"}
                        >Credit Card</PaymentMethod>
                        {maxEtokenTicketQuantity >= ticketQuantity &&
                            <PaymentMethod
                                onClick={() => handlePaymentMethod("etoken")}
                                $active={paymentProcessor === "etoken"}
                            >eToken</PaymentMethod>
                        }
                        <Item>
                            <Typography variant="header" size="large">Total</Typography>
                            <Price>${ticketQuantity * ticketPrice}</Price>
                        </Item>
                    </Column>
                </AccountForm>
            </PrimaryFlexGrow>

            <Footer variant="empty">
                <SecondaryFooterBackground />
                <Button onClick={handleConfirmation}>
                    Pay
                </Button>
            </Footer>

            {showPaymentForm && (
                <Overlay onClick={() => setShowPaymentForm(false)}>
                    <RollUp onClick={(e) => e.stopPropagation()} $animate={showPaymentForm}>
                        <WidgetBody>
                            <NmiCheckoutForm
                                passMetadata={setPaymentMetadata}
                                amount={ticketPrice * ticketQuantity}
                            />
                            <Button
                                type="submit"
                                form={`${paymentProcessor}-form`}
                            >
                                {fiatPurchaseButtonText}
                            </Button>
                        </WidgetBody>
                    </RollUp>
                </Overlay>
            )}
        </>
    )
}
