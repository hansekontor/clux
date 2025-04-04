import React from 'react'

// custom react components
import NavigationBar from '@components/Navigation';
import Ticket from './Ticket';
import PrimaryButton from '@components/PrimaryButton';
import { FooterCtn } from '@components/Footer';
import { CardIconBox } from '@components/Icons';
import { QuantityInput, QuantitySuggestions } from '@components/Inputs';
import { Paragraph, LargeHeading } from '@components/Text';
import { Column, Overlay } from '@components/Container';
import { AccountForm, ErrorMessage, Item, PaymentMethod, Price, PrimaryFlexGrow, SecondaryFooterBackground } from '../Styled';
import { RollUp } from '@components/CssAnimations';
import { NmiCheckoutForm, WidgetBody } from './Processors';

// core functions
import { useCheckout } from '@core/checkout';

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
            <NavigationBar
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
                        <LargeHeading>How  many tickets?</LargeHeading>
                    </Item>
                    <Item>
                        <Paragraph>
                            Each ticket result is random and unique, including entry in each of the Jackpots.
                        </Paragraph>
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
                            <LargeHeading>Payment Method</LargeHeading>
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
                            <LargeHeading>Total</LargeHeading>
                            <Price>${ticketQuantity * ticketPrice}</Price>
                        </Item>
                    </Column>
                </AccountForm>
            </PrimaryFlexGrow>

            <FooterCtn>
                <SecondaryFooterBackground />
                <PrimaryButton onClick={handleConfirmation}>
                    Pay
                </PrimaryButton>
            </FooterCtn>

            {showPaymentForm && (
                <Overlay onClick={() => setShowPaymentForm(false)}>
                    <RollUp onClick={(e) => e.stopPropagation()} $animate={showPaymentForm}>
                        <WidgetBody>
                            <NmiCheckoutForm
                                passMetadata={setPaymentMetadata}
                                amount={ticketPrice * ticketQuantity}
                            />
                            <PrimaryButton
                                type="submit"
                                form={`${paymentProcessor}-form`}
                            >
                                {fiatPurchaseButtonText}
                            </PrimaryButton>
                        </WidgetBody>
                    </RollUp>
                </Overlay>
            )}
        </>
    )
}
