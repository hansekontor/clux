import React from 'react'

// core functions
import { useCheckout } from '@core/context/Checkout';

// custom react components
import Header from '@components/Header';
import Navigation from '@components/Navigation';
import Footer from '@components/Footer';
import Typography from '@components/Typography';
import { Input } from '@components/Inputs';
import { 
    AccountForm, 
    CheckboxItem, 
    CheckboxText, 
    CustomCheckbox, 
    Divider, 
    ErrorMessage, 
    FormSection, 
    Item, 
    Label, 
    PrimaryFlexGrow, 
    PrimaryFooterBackground, 
    selectStyle, 
    WideCreatableSelect 
} from '../Styled';
import Button from '@components/Button';

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
            <Navigation
                handleOnClick={handleReturn}
                title={accountTitle}
            />
            <PrimaryFlexGrow>
                <AccountForm id='email-form' onSubmit={(e) => handleSubmitEmail(e)}>

                    <FormSection>
                        <Item>
                            <Typography variant="header" size="large">Create Your Account</Typography>
                        </Item>
                        <Item>
                            <Typography variant="paragraph">
                                Please enter your details to create an account.
                            </Typography>
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
                            <Typography variant="paragraph">Your email is required and is only used to announce results. No marketing emails.</Typography>
                        </Item>
                    </FormSection>
                    <FormSection>
                        <Label>Country</Label>
                        <Item>
                            <Typography variant="paragraph">Select the country of your government-issued ID.</Typography>
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
            <Footer variant="empty">
                <PrimaryFooterBackground />
                <Button
                    form={"email-form"}
                >
                    {emailButtonText}
                </Button>
            </Footer>
        </>
    )
}
