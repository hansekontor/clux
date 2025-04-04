import React from 'react'

// custom react components
import Header from '@components/Header';
import NavigationBar from '@components/Navigation';
import PrimaryButton from '@components/PrimaryButton';
import { FooterCtn } from '@components/Footer';
import { Paragraph, LargeHeading } from '@components/Text';
import { Input } from '@components/Inputs';
import { AccountForm, CheckboxItem, CheckboxText, CustomCheckbox, Divider, ErrorMessage, FormSection, Item, Label, PrimaryFlexGrow, PrimaryFooterBackground, selectStyle, WideCreatableSelect } from '../Styled';

// core functions
import { useCheckout } from '@core/context/Checkout';

const accountTitle = "Create Account";
const emailButtonText = "Continue";
const countryOptions = ["AllowedCountry", "ForbiddenCountry"].map(option => {
    return {
        label: option,
        value: option
    };
});

export default function Email() {
    const {
        emailError,
        countryError,
        handleReturn,
        handleSubmitEmail,
    } = useCheckout();

    return (
        <>
            <Header />
            <NavigationBar
                handleOnClick={handleReturn}
                title={accountTitle}
            />
            <PrimaryFlexGrow>
                <AccountForm id='email-form' onSubmit={(e) => handleSubmitEmail(e)}>

                    <FormSection>
                        <Item>
                            <LargeHeading>Create Your Account</LargeHeading>
                        </Item>
                        <Item>
                            <Paragraph>
                                Please enter your details to create an account.
                            </Paragraph>
                        </Item>
                    </FormSection>

                    <FormSection>
                        <Label>Email</Label>
                        <Input
                            placeholder="your@email.com"
                            name="email"
                            type="text"
                            required
                        />
                        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                        <Item>
                            <Paragraph>Your email is required and is only used to announce results. No marketing emails.</Paragraph>
                        </Item>
                    </FormSection>
                    <FormSection>
                        <Label>Country</Label>
                        <Item>
                            <Paragraph>Select the country of your government-issued ID.</Paragraph>
                        </Item>
                        <WideCreatableSelect
                            isClearable
                            name="country"
                            required
                            options={countryOptions}
                            placeholder={"Select your country"}
                            styles={selectStyle}
                        />
                        {countryError && <ErrorMessage>{countryError}</ErrorMessage>}
                    </FormSection>

                    <Divider />

                    <CheckboxItem>
                        <CustomCheckbox required />
                        <CheckboxText>I confirm that I am at least 18 years old</CheckboxText>
                    </CheckboxItem>
                    <CheckboxItem>
                        <CustomCheckbox required />
                        <CheckboxText>I understand a government ID will be required for purchase and I will be verified during KYC</CheckboxText>
                    </CheckboxItem>
                    <CheckboxItem>
                        <CustomCheckbox required />
                        <CheckboxText>I agree to the Purchase Terms, Privacy Policy and Terms of Service</CheckboxText>
                    </CheckboxItem>

                </AccountForm>
            </PrimaryFlexGrow>
            <FooterCtn>
                <PrimaryFooterBackground />
                <PrimaryButton
                    form={"email-form"}
                >
                    {emailButtonText}
                </PrimaryButton>
            </FooterCtn>
        </>
    )
}
